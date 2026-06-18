"use client";
import Container from "@/components/Container";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	CarouselApi
} from "@/components/ui/carousel"

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import ProductList from "@/components/products/list";
import { Product } from "@prisma/client";
import { useEffect, useState } from "react";

const Home = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [api, setApi] = useState<CarouselApi | null>(null);
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);

	useEffect(() => {
		const fetchProducts = async () => {
			const res = await fetch("/api/products");
			const data = await res.json();
			setProducts(data.products);
			console.log(data.products.length);
		};

		fetchProducts();
	}, []);

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
		<Container>
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
					<CarouselItem>
						<Container className="relative w-full h-[200px] md:h-[200px]">
							<Image
								src="https://0znsc5k7w8.ufs.sh/f/Pq5X8YsNcm6T2PPqEKcwvCXxHj6InyPFMdzqg8aB1t52uSGo"
								alt="Slide 1"
								fill
								className="object-cover"
								priority
							/>
						</Container>
					</CarouselItem>
					<CarouselItem>
						<Container className="relative w-full h-[200px] md:h-[200px]">
							<Image
								src="https://0znsc5k7w8.ufs.sh/f/Pq5X8YsNcm6T8yb5VZCS9qJN72GbUytsVo8xMa3e1OTRP5vL"
								alt="Slide 2"
								fill
								className="object-cover"
							/>
						</Container>
					</CarouselItem>
					<CarouselItem>
						<Container className="relative w-full h-[200px] md:h-[200px]">
							<Image
								src="https://0znsc5k7w8.ufs.sh/f/Pq5X8YsNcm6TyBB9I1GkeOg1rqolhXsVzHtijx6aBJvLd253"
								alt="Slide 3"
								fill
								className="object-cover"
							/>
						</Container>
					</CarouselItem>
				</CarouselContent>
				<div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
					{Array.from({ length: count }).map((_, index) => (
						<button
							key={index}
							onClick={() => api?.scrollTo(index)}
							className={`h-2 w-2 rounded-full transition-all ${current === index
								? "bg-project_primary w-6"
								: "bg-gray-300"
								}`}
						/>
					))}
				</div>
				<CarouselPrevious className="hidden lg:inline-flex" />
				<CarouselNext className="hidden lg:inline-flex" />
			</Carousel>

			<Container className="my-8">
				<h1 className="font-display text-2xl font-medium text-obsidian mb-4">See whats all Akshat Namkeen have</h1>
				<ProductList products={products} />
			</Container>
		</Container>
	);
}

export default Home;