import type { Metadata } from 'next';
import './globals.css';


export const metadata: Metadata = {
  title: 'KumbhMantra Pro',
  description: 'Mahakumbh command OS for chat, routing, telemetry, maps, and SOS response.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#07111f" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
