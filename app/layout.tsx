import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Warpion Website',
  description: 'Admin panel for Warpion operations',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}