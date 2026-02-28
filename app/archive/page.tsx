'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ArchivePage() {
    const articles = [
        {
            id: 1,
            title: "The Return of Minimalism",
            subtitle: "Why simplicity is the ultimate sophistication in 2026.",
            image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop",
            category: "Editorial"
        },
        {
            id: 2,
            title: "Neutral Palette",
            subtitle: "Navigating elegance in oversized silhouettes.",
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop",
            category: "Lookbook"
        },
        {
            id: 3,
            title: "Organic Fabrics",
            subtitle: "Redesigning the texture of reality.",
            image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000&auto=format&fit=crop",
            category: "Tech"
        }
    ];

    const visualDiary = [
        "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000&auto=format&fit=crop"
    ];

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 p-6 z-50 text-black">
                <Link href="/" className="flex items-center gap-2 uppercase font-medium tracking-widest text-xs hover:text-gray-500 transition-colors">
                    <ArrowLeft size={16} /> Back to Store
                </Link>
            </nav>

            <header className="pt-32 px-6 md:px-12 mb-20 text-center flex flex-col items-center">
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-4xl md:text-6xl font-light uppercase tracking-widest pb-4 text-black"
                >
                    The Archive
                </motion.h1>
                <div className="flex justify-center gap-8 items-center mt-4 uppercase tracking-widest text-xs font-medium text-gray-500">
                    <span>Vol. 04 — 2026</span>
                    <span>AURA Editorial</span>
                </div>
            </header>

            <main className="px-6 md:px-12 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-20 gap-x-8">

                    {/* Featured Article */}
                    <Link href="#" className="col-span-1 md:col-span-8 relative group cursor-pointer block">
                        <div className="overflow-hidden mb-4">
                            <img
                                src={articles[0].image}
                                alt={articles[0].title}
                                className="w-full h-[60vh] object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                            />
                        </div>
                        <div className="pl-4 pt-4">
                            <span className="text-[10px] font-medium text-gray-400 px-2 py-1 uppercase tracking-widest mb-2 inline-block border border-gray-200">
                                {articles[0].category}
                            </span>
                            <h2 className="text-3xl md:text-5xl font-light uppercase tracking-widest leading-tight mb-4 mt-2 text-black">
                                {articles[0].title}
                            </h2>
                            <p className="text-sm font-medium text-gray-600 max-w-xl leading-relaxed mb-8 uppercase tracking-widest">
                                {articles[0].subtitle}
                            </p>
                            <div className="text-sm text-gray-500 max-w-2xl leading-relaxed border-t border-gray-200 pt-8 space-y-6 text-justify">
                                <p>
                                    As we move further into the decade, we crave clarity and purpose.
                                    This season explores the beauty of essential forms, focusing on pure materials, and the harmony between silhouette and structure.
                                    We are not just wearing clothes; we are adorning the self with intention.
                                </p>
                                <p>
                                    Why do we seek comfort in simplicity? Because the clean lines of true minimalism successfully provide an anchor in a chaotic world.
                                    The new silhouette is about quiet confidence. It's about fabric that feels fundamental—lightweight cottons, smooth silks, and refined wools that drape with effortless grace.
                                </p>
                                <p className="font-medium text-black mt-8 text-xs uppercase tracking-widest">
                                    — THE EDITORIAL BOARD
                                </p>
                            </div>
                        </div>
                    </Link>

                    {/* Side Column */}
                    <div className="col-span-1 md:col-span-4 flex flex-col gap-12 pt-12 md:pt-4">
                        <div className="bg-gray-50 p-8 border border-gray-100">
                            <h3 className="text-sm font-medium uppercase tracking-widest mb-4 text-black">Manifesto</h3>
                            <p className="font-serif text-gray-600 text-base leading-relaxed italic">
                                "Fashion is the pursuit of the essential. We refine style to understand our own elegance."
                            </p>
                        </div>

                        {articles.slice(1).map((article) => (
                            <Link href="#" key={article.id} className="group cursor-pointer block">
                                <div className="overflow-hidden mb-4 aspect-[4/5] bg-gray-50">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                                    />
                                </div>
                                <h2 className="text-lg font-light uppercase tracking-widest text-black mb-1">
                                    {article.title}
                                </h2>
                                <p className="text-[10px] uppercase tracking-widest font-medium text-gray-500">
                                    {article.subtitle}
                                </p>
                            </Link>
                        ))}
                    </div>

                </div>

                {/* New Section: Visual Diary */}
                <div className="my-32">
                    <h3 className="text-xs font-medium uppercase tracking-widest mb-8 border-b border-gray-200 pb-2 text-black text-center">Visual Diary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                        {visualDiary.map((img, i) => (
                            <motion.div
                                key={i}
                                className="aspect-square bg-gray-50 overflow-hidden"
                            >
                                <img src={img} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Big Text Divider */}
                <div className="border-y border-gray-200 py-16 text-center">
                    <h2 className="text-3xl md:text-5xl font-light uppercase tracking-widest leading-none text-black">
                        Redefining <span className="italic text-gray-400">Elegance</span>
                    </h2>
                </div>

            </main>
        </div>
    );
}
