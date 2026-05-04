"use client";
import Container from "@/components/Container";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel"

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import ProductList from "@/components/products/list";
import { Product } from "@prisma/client";
import { useEffect, useState } from "react";
const Home = () => {
	const [products, setProducts] = useState<Product[]>([]);
	useEffect(() => {
		const fetchProducts = async () => {
			const res = await fetch("/api/products");
			const data = await res.json();
			setProducts(data.products);
			console.log(data.products.length);
		};

		fetchProducts();
	}, []);

	return (
		<Container>
			<Carousel
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
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>

			<Container className="my-8">
				<ProductList products={products} />
			</Container>
		</Container>
	);
}

export default Home;