"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ImageOff } from "lucide-react";

import type { ProductDetailsVariant } from "@/types/product";
import WishlistButton from "../../wishlist/wishlist-button";

interface Props {
    variant: ProductDetailsVariant;
    wishlisted: boolean;
}

export default function ProductGallery({
    variant,
    wishlisted,
}: Props) {
    const [selectedImage, setSelectedImage] = useState(0);

    const images = [
        variant.displayURL,
        ...variant.images,
    ].filter(Boolean) as string[];

    return (
        <div className="w-full h-[80dvh] min-h-[500px] max-h-[700px] lg:h-[calc(100dvh-200px)] lg:min-h-[600px] lg:max-h-none">
            <div className="h-full flex flex-col">
                {/* Main Image */}
                <div className="relative flex-1 min-h-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${variant.id}-${selectedImage}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="absolute inset-0"
                        >
                            {images[selectedImage] ? (
                                <Image
                                    src={images[selectedImage]}
                                    alt={variant.name}
                                    fill
                                    className={
                                        images[selectedImage] ===
                                        variant.displayURL
                                            ? "object-cover"
                                            : "object-contain"
                                    }
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
                                    <div className="text-obsidian/20 mb-3">
                                        <ImageOff
                                            className="w-16 h-16 sm:w-20 sm:h-20"
                                            strokeWidth={1}
                                        />
                                    </div>

                                    <div className="text-center">
                                        <h2 className="text-lg font-light uppercase tracking-widest text-obsidian/40">
                                            Image
                                        </h2>

                                        <p className="mt-2 text-[10px] uppercase tracking-widest text-obsidian/30">
                                            Not Available
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Badge */}
                    {/* 
                    <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-obsidian text-ivory text-[10px] font-semibold tracking-widest uppercase rounded-full">
                        New Arrival
                    </div>
                    */}

                    {/* Wishlist */}
                    <div className="absolute top-1 right-1 z-10">
                        <WishlistButton
                            variantId={variant.id}
                            size="sm"
                            initialWishlisted={wishlisted}
                        />
                    </div>
                </div>

                {/* Thumbnails */}
                {images.length > 0 && (
                    <div className="flex-shrink-0 mt-4">
                        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setSelectedImage(i)}
                                    className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 border overflow-hidden transition-all rounded-lg
                                        ${
                                            i === selectedImage
                                                ? "border-obsidian"
                                                : "border-brand-200 hover:border-obsidian/50"
                                        }
                                    `}
                                >
                                    <Image
                                        src={img}
                                        alt={`${variant.name} image ${
                                            i + 1
                                        }`}
                                        fill
                                        className="object-contain"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}