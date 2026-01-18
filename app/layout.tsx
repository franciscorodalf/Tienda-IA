import type { Metadata } from 'next';
import './globals.css';

import { CartProvider } from '@/context/CartContext';
import { ChatProvider } from '@/context/ChatContext';
import { CartDrawer } from '@/components/CartDrawer';
import Chat from '@/components/Chat';

export const metadata: Metadata = {
  title: 'TIENDA.IA | STREETWEAR',
  description: 'Future of fashion commerce.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[var(--background)] text-[var(--foreground)] selection:bg-white selection:text-black">
        <CartProvider>
          <ChatProvider>
            {children}
            <CartDrawer />
            <Chat />
          </ChatProvider>
        </CartProvider>
      </body>
    </html>
  );
}
