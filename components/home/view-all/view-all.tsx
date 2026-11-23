"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowRight, Sparkles } from "lucide-react";

export default function ViewAll() {
    const reduceMotion = useReducedMotion();

    return (
        <section className="px-1 sm:px-0" aria-labelledby="view-all-heading">
            <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: reduceMotion ? 0 : 0.6, ease: "easeOut" }}
                className="group relative isolate grid overflow-hidden rounded-[2rem] bg-obsidian shadow-xl shadow-obsidian/10 lg:min-h-[430px] lg:grid-cols-[0.9fr_1.1fr]"
            >
                <div className="relative z-10 flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                    <motion.div
                        initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: reduceMotion ? 0 : 0.12, duration: 0.45 }}
                        className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/85 backdrop-blur"
                    >
                        <Sparkles className="size-3.5 text-amber-300" /> Your next favourite snack
                    </motion.div>

                    <h2 id="view-all-heading" className="max-w-xl font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                        Discover every <span className="text-amber-300">crunch</span>, every flavour.
                    </h2>
                    <p className="mt-5 max-w-lg text-sm leading-7 text-white/65 sm:text-base">
                        From classic bhujia and sev to our signature mixtures, find a traditional favourite for every craving.
                    </p>

                    <div className="mt-8 grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-2">
                        <Link
                            href="/product"
                            className="group/button inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-project_primary px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-project_primary/20 transition duration-200 hover:-translate-y-0.5 hover:bg-project_primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
                        >
                            View All Products
                            <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-1" />
                        </Link>
                        <Link
                            href="/categories"
                            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
                        >
                            View All Categories
                            <ArrowDownRight className="size-4" />
                        </Link>
                    </div>
                </div>

                <div className="relative min-h-64 overflow-hidden sm:min-h-80 lg:min-h-full">
                    <Image
                        src="/illustrations/view-all.png"
                        alt="A selection of Akshat Namkeen snacks"
                        fill
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    />
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-obsidian/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-obsidian/25 lg:via-transparent lg:to-transparent" />
                    <motion.div
                        animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-5 right-5 flex items-center gap-3 rounded-2xl border border-white/50 bg-white/90 px-4 py-3 shadow-xl backdrop-blur sm:bottom-7 sm:right-7"
                    >
                        <span className="grid size-10 place-items-center rounded-xl bg-project_primary/10 text-project_primary"><Sparkles className="size-5" /></span>
                        <span>
                            <span className="block text-sm font-semibold text-obsidian">Made for sharing</span>
                            <span className="block text-xs text-obsidian/55">Loved with every chai</span>
                        </span>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
