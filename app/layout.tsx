import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Chat from '@/components/Chat';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tienda IA Hybrid Store',
  description: 'AI Powered Shopping Experience',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen overflow-hidden">
          {/* Main Store Area - Left Panel */}
          <main className="flex-1 overflow-y-auto bg-white">
            {children}
          </main>

          {/* AI Assistant - Right Panel (Sticky Sidebar) */}
          <aside className="w-[350px] lg:w-[400px] flex-shrink-0 h-full relative z-20 shadow-xl">
            <Chat />
          </aside>
        </div>
      </body>
    </html>
  );
}
