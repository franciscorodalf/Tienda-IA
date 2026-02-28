import { CartProvider } from '@/context/CartContext';
import { ChatProvider } from '@/context/ChatContext';
import { CartDrawer } from '@/components/CartDrawer';
import Chat from '@/components/Chat';

export default function ShopLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <CartProvider>
            <ChatProvider>
                {children}
                <CartDrawer />
                <Chat />
            </ChatProvider>
        </CartProvider>
    );
}
