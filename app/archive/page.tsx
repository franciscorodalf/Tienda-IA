'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ArchivePage() {
    const articles = [
        {
            id: 1,
            title: "The Death of Minimalist",
            subtitle: "Why chaos is the new order in 2026 fashion landscapes.",
            image: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=1000&auto=format&fit=crop",
            category: "Editorial"
        },
        {
            id: 2,
            title: "Concrete Jungle",
            subtitle: "Navigating urban decay in oversized silhouettes.",
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop",
            category: "Lookbook"
        },
        {
            id: 3,
            title: "Digital Fabrics",
            subtitle: "How AI is redesigning the texture of reality.",
            image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
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
        <div className="min-h-screen bg-[#e5e5e5] text-black font-sans selection:bg-black selection:text-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 p-6 z-50 mix-blend-difference text-white">
                <Link href="/" className="flex items-center gap-2 uppercase font-bold tracking-widest text-xs hover:underline">
                    <ArrowLeft size={16} /> Back to Store
                </Link>
            </nav>

            <header className="pt-32 px-6 md:px-12 mb-20">
                <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-[12vw] leading-[0.8] font-black uppercase tracking-tighter border-b-4 border-black pb-4"
                >
                    The<br />Archive
                </motion.h1>
                <div className="flex justify-between items-start mt-4 uppercase tracking-widest text-xs font-bold">
                    <span>Vol. 04 — 2026</span>
                    <span>Tienda.IA Editorial</span>
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
                                className="w-full h-[60vh] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                            />
                        </div>
                        <div className="border-l-2 border-black pl-4">
                            <span className="text-xs font-bold bg-black text-white px-2 py-1 uppercase tracking-widest mb-2 inline-block">
                                {articles[0].category}
                            </span>
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-2 group-hover:underline">
                                {articles[0].title}
                            </h2>
                            <p className="text-lg md:text-xl font-medium max-w-xl leading-tight mb-6">
                                {articles[0].subtitle}
                            </p>
                            <div className="text-base text-gray-600 max-w-2xl leading-relaxed italic border-t border-black pt-6 space-y-6">
                                <p>
                                    "The era of sterile minimalism is collapsing. As we move further into the digital age, we crave texture, noise, and complex layers.
                                    This season explores the beauty of distortion, reusing industrial materials, and the clash between organic forms and synthetic futures.
                                    We are not just wearing clothes; we are wearing the static of a changing world."
                                </p>
                                <p>
                                    Why do we seek comfort in chaos? Perhaps because the clean lines of the past decade successfully hid the messiness of human existence,
                                    and we are now ready to expose it. The 2026 silhouette is not about hiding; it's about occupying space. It's about fabric that
                                    doesn't just sit on the body but fights with it—heavyweights, stiff canvases, and distressed knits that look like they've
                                    survived an apocalypse.
                                </p>
                                <p>
                                    Streetwear has always been a mirror to society. If the 2010s were about aspirational luxury and logos, the mid-20s are about
                                    authenticity and survival. It’s raw edges, exposed seams, and palettes drawn from concrete, rust, and oil. The "Death of Minimalist"
                                    isn't just an aesthetic choice; it's a declaration that we are done with being perfect. We are ready to be real, to be loud,
                                    and to be beautifully, intentionally messy.
                                </p>
                                <p className="font-bold text-black bg-white inline-block px-2">
                                    — THE EDITORIAL BOARD
                                </p>
                            </div>
                        </div>
                    </Link>

                    {/* Side Column */}
                    <div className="col-span-1 md:col-span-4 flex flex-col gap-20 pt-20">
                        <div className="bg-white p-8 border border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Manifesto</h3>
                            <p className="font-serif text-lg leading-relaxed">
                                "Fashion is no longer about utility. It is a visual language for the post-digital age. We simulate style to understand our own humanity."
                            </p>
                        </div>

                        {articles.slice(1).map((article) => (
                            <Link href="#" key={article.id} className="group cursor-pointer block">
                                <div className="overflow-hidden mb-2 aspect-[4/5]">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                    />
                                </div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter group-hover:underline">
                                    {article.title}
                                </h2>
                                <p className="text-sm font-medium text-gray-600">
                                    {article.subtitle}
                                </p>
                            </Link>
                        ))}
                    </div>

                </div>

                {/* New Section: Visual Diary */}
                <div className="my-32">
                    <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-8 border-b border-black pb-2">Visual Diary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {visualDiary.map((img, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 0.98 }}
                                className="aspect-square bg-gray-300 overflow-hidden"
                            >
                                <img src={img} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Big Text Divider */}
                <div className="border-y border-black py-12 text-center">
                    <h2 className="text-[5vw] font-black uppercase tracking-widest leading-none outline-text text-transparent stroke-black">
                        Redefining <span className="italic text-black">Streetwear</span>
                    </h2>
                </div>

            </main>
        </div>
    );
}
