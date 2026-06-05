import type { Metadata } from 'next';
import { Providers } from '@/components/providers/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'QRAZY — AI-Powered AR Commerce Platform',
  description:
    'Transform your products into immersive AR experiences. Generate QR codes, deploy AR commerce, and track analytics — all in one platform.',
  keywords: ['AR', 'Augmented Reality', 'Commerce', 'QR Codes', 'SaaS', '3D'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#4c6ef5" />
        <script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
          async
        ></script>
      </head>
      <body className="min-h-screen font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}