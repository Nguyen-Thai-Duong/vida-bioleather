# Google Sheets Integration Setup Guide

This guide will help you connect the contact form to your Google Spreadsheet.

## Your Spreadsheet
https://docs.google.com/spreadsheets/d/11PNLDW1USJ0tAuFiYHnTzh1AgY_bm04xYzpJrkwSTYU/edit?usp=sharing

## Step-by-Step Setup

### 1. Open Your Spreadsheet
Open the link above in your browser.

### 2. Prepare the Sheet
Make sure your first sheet has these column headers in Row 1:
- Column A: Timestamp
- Column B: Name  
- Column C: Email
- Column D: Subject
- Column E: Message

### 3. Open Apps Script Editor
1. In your spreadsheet, click **Extensions** → **Apps Script**
2. You'll see a code editor window

### 4. Add the Script Code
1. Delete any existing code in the editor
2. Copy and paste this code:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Append a new row with the contact form data
    sheet.appendRow([
      data.timestamp,
      data.name,
      data.email,
      data.subject,
      data.message
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click the **Save** icon (💾) or press Ctrl+S
4. Name your project (e.g., "Contact Form Handler")

### 5. Deploy as Web App
1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Fill in the settings:
   - **Description**: Contact Form Integration
   - **Execute as**: Me (your Google account email)
   - **Who has access**: Anyone
5. Click **Deploy**
6. You may need to authorize the script:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** → **Go to [Project Name] (unsafe)**
   - Click **Allow**
7. Copy the **Web app URL** (it looks like: `https://script.google.com/macros/s/AKfy...../exec`)

### 6. Add URL to Environment Variables
1. Create a file named `.env.local` in the `back-end` folder (if it doesn't exist)
2. Add this line:
```
GOOGLE_SHEETS_SCRIPT_URL=paste_your_web_app_url_here
```
3. Save the file

### 7. Restart Your Development Server
Stop your current dev server (Ctrl+C) and restart it:
```bash
npm run dev
```

## Testing

1. Go to your contact page
2. Fill in the form and submit
3. Check your Google Sheet - you should see a new row with the submission data!

## Troubleshooting

### Data not appearing in sheet?
- Check the terminal/console for error messages
- Verify the Web App URL is correct in `.env.local`
- Make sure the script is deployed with "Anyone" access
- Try redeploying the script

### Authorization errors?
- Make sure you authorized the script when deploying
- Check that "Execute as: Me" is selected
- Redeploy and reauthorize if needed

### Still having issues?
- Check the Apps Script Executions log: Apps Script Editor → Executions
- Look for error messages in the execution history
- Verify your spreadsheet has the correct headers in Row 1

## Security Note
The script is set to "Anyone" access, which means anyone with the Web App URL can submit data. This is normal for contact forms. The URL is kept private in your .env.local file (which should never be committed to Git).
