/**
 * Contact Form API Endpoint
 * POST /api/contact - Submit contact form (stores in DB and Google Sheets)
 */

import clientPromise from '../../lib/db';

export default async function handler(req, res) {
    try {
        if (req.method === 'POST') {
            const { name, email, subject, message } = req.body;

            // Validate required fields
            if (!name || !email || !message) {
                return res.status(400).json({ error: 'Name, email, and message are required' });
            }

            // Store contact submission in database
            const client = await clientPromise;
            const db = client.db('ecommerce');

            const submission = {
                name,
                email,
                subject: subject || 'No subject',
                message,
                submittedAt: new Date()
            };

            await db.collection('contacts').insertOne(submission);

            // Save to Google Sheets using Google Apps Script Web App
            let sheetsSaved = false;
            let sheetsError = null;

            try {
                const scriptUrl = process.env.GOOGLE_SHEETS_SCRIPT_URL;

                console.log('=== Google Sheets Integration Debug ===');
                console.log('Script URL configured:', !!scriptUrl);

                if (scriptUrl) {
                    console.log('Attempting to save to Google Sheets...');

                    const sheetsResponse = await fetch(scriptUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            timestamp: new Date().toISOString(),
                            name,
                            email,
                            subject: subject || 'No subject',
                            message
                        })
                    });

                    console.log('Google Sheets response status:', sheetsResponse.status);

                    const responseText = await sheetsResponse.text();
                    console.log('Google Sheets response:', responseText);

                    try {
                        const result = JSON.parse(responseText);

                        if (result.status === 'success') {
                            console.log('✓ Successfully saved to Google Sheets');
                            sheetsSaved = true;
                        } else {
                            console.error('✗ Google Sheets save failed:', result);
                            sheetsError = result.message || 'Unknown error';
                        }
                    } catch (parseError) {
                        console.error('✗ Failed to parse Google Sheets response:', parseError);
                        sheetsError = 'Invalid response from Google Sheets';
                    }
                } else {
                    console.warn('⚠ GOOGLE_SHEETS_SCRIPT_URL not configured in .env.local');
                    console.warn('⚠ Data saved to MongoDB only. To enable Google Sheets:');
                    console.warn('  1. Follow instructions in GOOGLE_SHEETS_SETUP.md');
                    console.warn('  2. Add GOOGLE_SHEETS_SCRIPT_URL to .env.local');
                    console.warn('  3. Restart the dev server');
                }
            } catch (error) {
                console.error('✗ Failed to save to Google Sheets:', error);
                sheetsError = error.message;
            }

            return res.status(200).json({
                success: true,
                message: 'Thank you for contacting us! We will get back to you soon.',
                debug: {
                    savedToMongoDB: true,
                    savedToGoogleSheets: sheetsSaved,
                    googleSheetsError: sheetsError
                }
            });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
