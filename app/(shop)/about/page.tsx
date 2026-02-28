'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
            <nav className="fixed top-0 left-0 p-6 z-50">
                <Link href="/" className="flex items-center gap-2 uppercase font-bold tracking-widest text-xs hover:text-gray-400 transition-colors">
                    <ArrowLeft size={16} /> Close
                </Link>
            </nav>

            <div className="max-w-4xl mx-auto pt-32 px-6 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-xs font-medium uppercase tracking-[0.3em] text-gray-500 mb-4 block">The Origin</span>
                    <h1 className="text-4xl md:text-6xl font-light uppercase tracking-widest leading-tight mb-12 text-black">
                        The Essence<br />Of Elegance.
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="prose prose-lg text-gray-700 font-medium leading-relaxed"
                    >
                        <p>
                            AURA was born from a desire for absolute simplicity. An exploration of shape, material, and movement that focuses on what is truly essential.
                        </p>
                        <p>
                            We realized that the future of fashion wasn't in excess, but in restraint. The intersection where precise tailoring meets timeless design.
                        </p>
                        <p>
                            We are curators of style. Every piece in our collection is a dialogue between traditional craftsmanship and modern utility.
                        </p>
                    </motion.div>

                    <div className="relative h-[500px] bg-neutral-900 overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-60"></div>
                        <div className="absolute bottom-4 left-4 border border-white p-4">
                            <p className="text-xs uppercase font-bold tracking-widest">Est. 2026</p>
                            <p className="text-xs uppercase font-bold tracking-widest">Madrid / Tokyo / Cloud</p>
                        </div>
                    </div>
                </div>

                <div className="mt-32">
                    <h2 className="text-xl font-medium uppercase tracking-widest mb-8 border-b border-gray-200 pb-2 text-black">The Atelier</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['Elena (Design)', 'Marcus (Curation)', 'David (Sourcing)', 'Sofia (Operations)'].map((member) => (
                            <div key={member} className="bg-gray-50 p-4 pt-12">
                                <p className="font-medium uppercase tracking-widest text-xs text-gray-600">{member}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
