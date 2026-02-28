import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AURA | MINIMALIST',
  description: 'Minimalist fashion ecommerce.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[var(--background)] text-[var(--foreground)] selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
