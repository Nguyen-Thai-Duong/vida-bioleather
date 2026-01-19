/**
 * Custom App Component
 * Wraps all pages with Layout and global styles
 */

import Layout from '../components/Layout';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}
