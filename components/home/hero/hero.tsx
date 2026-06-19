"use client"
import { useEffect, useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    CarouselApi
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

export default function HeroSection() {
    const [api, setApi] = useState<CarouselApi | null>(null);
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    // Listen for carousel slide changes
    useEffect(() => {
        if (!api) return;

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());

        const onSelect = () => {
            setCurrent(api.selectedScrollSnap());
        };

        api.on("select", onSelect);

        return () => {
            api.off("select", onSelect);
        };
    }, [api]);

    return (
        <Carousel
            setApi={setApi}
            className="w-full"
            plugins={[
                Autoplay({
                    delay: 3000,
                }),
            ]}
        >
            <CarouselContent>
                <CarouselItem className="relative w-full h-[200px] md:h-[200px]">
                    <Image
                        src="https://0znsc5k7w8.ufs.sh/f/Pq5X8YsNcm6T2PPqEKcwvCXxHj6InyPFMdzqg8aB1t52uSGo"
                        alt="Slide 1"
                        fill
                        className="object-cover"
                        priority
                    />
                </CarouselItem>
                <CarouselItem className="relative w-full h-[200px] md:h-[200px]">
                    <Image
                        src="https://0znsc5k7w8.ufs.sh/f/Pq5X8YsNcm6T8yb5VZCS9qJN72GbUytsVo8xMa3e1OTRP5vL"
                        alt="Slide 2"
                        fill
                        className="object-cover"
                    />
                </CarouselItem>
                <CarouselItem className="relative w-full h-[200px] md:h-[200px]">
                    <Image
                        src="https://0znsc5k7w8.ufs.sh/f/Pq5X8YsNcm6TyBB9I1GkeOg1rqolhXsVzHtijx6aBJvLd253"
                        alt="Slide 3"
                        fill
                        className="object-cover"
                    />
                </CarouselItem>
            </CarouselContent>
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                {Array.from({ length: count }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => api?.scrollTo(index)}
                        className={`h-2 w-2 rounded-full transition-all ${current === index
                            ? "bg-project_primary w-6"
                            : "bg-gray-500"
                            }`}
                    />
                ))}
            </div>
            <CarouselPrevious className="hidden lg:inline-flex" />
            <CarouselNext className="hidden lg:inline-flex" />
        </Carousel>
    );
}