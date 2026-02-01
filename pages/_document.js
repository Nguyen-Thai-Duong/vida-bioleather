/**
 * Custom Document Component
 * Modifies the HTML document structure
 */

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta charSet="utf-8" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="description" content="VIDA Bioleather develops sustainable kombucha SCOBY leather, an innovative eco-friendly biomaterial for fashion and design." />
                <meta property="og:title" content="VIDA Bioleather – Sustainable Kombucha SCOBY Leather" />
                <meta property="og:description" content="VIDA Bioleather develops sustainable kombucha SCOBY leather, an innovative eco-friendly biomaterial for fashion and design." />
                <meta property="og:site_name" content="VIDA Bioleather" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="VIDA Bioleather – Sustainable Kombucha SCOBY Leather" />
                <meta name="twitter:description" content="VIDA Bioleather develops sustainable kombucha SCOBY leather, an innovative eco-friendly biomaterial for fashion and design." />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
