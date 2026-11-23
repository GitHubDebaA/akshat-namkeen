"use client";

import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose
} from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { RatingProductData } from "@/types/product";
import { Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Props {
    product: RatingProductData;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (review: { rating: number; comment: string; file: File | null }) => Promise<boolean>;
}

export default function ReviewDrawer({
    product,
    open,
    onOpenChange,
    onSubmit,
}: Props) {
    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!rating) return;
        setIsSubmitting(true);
        try {
            if (await onSubmit({ rating, comment, file: null })) {
                setRating(0);
                setComment("");
                onOpenChange(false);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction="right">
            <DrawerContent className="!rounded-none h-full max-w-xl ml-auto flex flex-col bg-white">
                <div className="flex flex-col h-full w-full overflow-hidden">
                    {/* Drawer Header */}
                    <DrawerHeader className="p-5 lg:px-8 border-b border-obsidian/10 shrink-0">
                        <DrawerTitle className="text-xl font-bold text-obsidian">
                            Write a review
                        </DrawerTitle>
                        <DrawerDescription className="text-sm text-obsidian/60 mt-1">
                            Share your experience with other customers.
                        </DrawerDescription>
                    </DrawerHeader>

                    {/* Scrollable Content Body */}
                    <div className="flex-1 overflow-y-auto p-5 lg:px-8 space-y-6">
                        {/* Compact Product Details Header */}
                        <div className="flex items-center gap-4 rounded-xl border border-obsidian/10 bg-ivory/50 p-3.5">
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-obsidian/5 border border-obsidian/5">
                                {product.image && (
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-sm text-obsidian truncate">
                                    {product.name}
                                </h3>
                                {product.variant && (
                                    <p className="text-xs text-obsidian/50 mt-0.5 truncate">
                                        {product.variant}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Interactive Star Rating */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-obsidian">
                                Rate this Product <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-2 pt-1">
                                {[1, 2, 3, 4, 5].map((starIndex) => {
                                    const active = starIndex <= (hoverRating || rating);
                                    return (
                                        <button
                                            key={starIndex}
                                            type="button"
                                            onClick={() => setRating(starIndex)}
                                            onMouseEnter={() => setHoverRating(starIndex)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="p-1 transition-transform duration-150 hover:scale-125 focus:outline-none"
                                        >
                                            <Star
                                                className={`h-7 w-7 transition-colors duration-200 ${active
                                                    ? "fill-amber-400 text-amber-400"
                                                    : "text-slate-300 hover:text-slate-400"
                                                    }`}
                                            />
                                        </button>
                                    );
                                })}
                                {rating > 0 && (
                                    <span className="text-xs font-semibold text-obsidian/60 ml-2">
                                        {rating} of 5 stars
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Textarea Review Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-obsidian">
                                Write your review
                            </label>
                            <Textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Would you like to write anything about this product?"
                                className="min-h-[140px] resize-none border-obsidian/20 focus-visible:ring-obsidian rounded-xl p-3.5 text-sm"
                            />
                        </div>

                    </div>

                    {/* Fixed Drawer Footer */}
                    <DrawerFooter className="p-5 lg:px-8 border-t border-obsidian/10 shrink-0 bg-white">
                        <div className="grid grid-cols-2 gap-3 w-full">
                            <DrawerClose asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full border-obsidian/20 text-obsidian hover:bg-obsidian/5"
                                >
                                    Cancel
                                </Button>
                            </DrawerClose>
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!rating || isSubmitting}
                                className="w-full bg-obsidian text-white hover:bg-obsidian/90"
                            >
                                {isSubmitting ? "Submitting…" : "Submit Review"}
                            </Button>
                        </div>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
