'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatContextType {
    isOpen: boolean;
    openChat: (initialMessage?: string) => void;
    closeChat: () => void;
    initialMessage: string;
    clearInitialMessage: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [initialMessage, setInitialMessage] = useState('');

    const openChat = (msg?: string) => {
        if (msg) setInitialMessage(msg);
        setIsOpen(true);
    };

    const closeChat = () => {
        setIsOpen(false);
    };

    const clearInitialMessage = () => {
        setInitialMessage('');
    };

    return (
        <ChatContext.Provider value={{ isOpen, openChat, closeChat, initialMessage, clearInitialMessage }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}
