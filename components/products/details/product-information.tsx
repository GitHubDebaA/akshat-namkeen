"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import type {
    ProductDetailsVariant,
    ProductWithVariants,
    ProductPropertyData,
} from "@/types/product";

interface Props {
    product: Omit<ProductWithVariants, "variants">;
    variant: ProductDetailsVariant;
}

type TextTab = {
    id: string;
    label: string;
    type: "text";
    content: string;
};

type PropertiesTab = {
    id: string;
    label: string;
    type: "properties";
    items: ProductPropertyData[];
};

type Tab = TextTab | PropertiesTab;

export default function ProductInformation({
    product,
    variant,
}: Props) {
    const [openTab, setOpenTab] = useState<string | null>(
        "description"
    );

    const sorted = [...variant.properties].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );

    const grouped = sorted.reduce(
        (acc, item) => {
            if (!acc[item.section]) {
                acc[item.section] = [];
            }

            acc[item.section].push(item);

            return acc;
        },
        {} as Record<string, ProductPropertyData[]>
    );

    const dynamicSections: PropertiesTab[] =
        Object.entries(grouped).map(
            ([section, items]) => ({
                id: section
                    .toLowerCase()
                    .replace(/\s+/g, "-"),
                label: section,
                type: "properties",
                items,
            })
        );

    const tabs: Tab[] = [
        {
            id: "description",
            label: "Description",
            type: "text",
            content:
                product.description || variant.name,
        },
        ...dynamicSections,
        {
            id: "shipping",
            label: "Shipping & Returns",
            type: "text",
            content:
                "Free shipping on all orders over INR 499. Returns accepted within 7 days.",
        },
    ];

    return (
        <div className="border-t border-brand-200 divide-y divide-brand-200">
            {tabs.map((tab) => (
                <div key={tab.id}>
                    <button
                        type="button"
                        onClick={() =>
                            setOpenTab(
                                openTab === tab.id
                                    ? null
                                    : tab.id
                            )
                        }
                        className="flex items-center justify-between w-full py-4 text-left"
                    >
                        <span className="text-sm font-bold text-obsidian">
                            {tab.label}
                        </span>

                        <ChevronDown
                            className={`w-4 h-4 text-obsidian/50 transition-transform ${
                                openTab === tab.id
                                    ? "rotate-180"
                                    : ""
                            }`}
                        />
                    </button>

                    <AnimatePresence>
                        {openTab === tab.id && (
                            <motion.div
                                initial={{
                                    height: 0,
                                    opacity: 0,
                                }}
                                animate={{
                                    height: "auto",
                                    opacity: 1,
                                }}
                                exit={{
                                    height: 0,
                                    opacity: 0,
                                }}
                                transition={{
                                    duration: 0.2,
                                }}
                                className="overflow-hidden"
                            >
                                <div className="pb-4 text-sm text-obsidian/70 space-y-2">
                                    {tab.type === "text" && (
                                        <p>
                                            {tab.content}
                                        </p>
                                    )}

                                    {tab.type ===
                                        "properties" &&
                                        tab.items.map(
                                            (item) => (
                                                <div
                                                    key={
                                                        item.id
                                                    }
                                                    className="flex justify-between"
                                                >
                                                    <span className="text-obsidian/50">
                                                        {
                                                            item.label
                                                        }
                                                    </span>

                                                    <span className="font-medium text-right">
                                                        {
                                                            item.value
                                                        }
                                                    </span>
                                                </div>
                                            )
                                        )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}