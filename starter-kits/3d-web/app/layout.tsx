import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  // Replace per client. Kept explicit rather than templated so nobody ships
  // a site still titled "Create Next App".
  title: 'Client Name — Proposition in one line',
  description:
    'One sentence a search engine can show verbatim and a human can act on. Under 160 characters.',
  openGraph: {
    title: 'Client Name — Proposition in one line',
    description: 'One sentence a search engine can show verbatim and a human can act on.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Deliberately no maximumScale / userScalable:false — blocking zoom is a
  // WCAG failure and the most common one on "premium" agency builds.
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
