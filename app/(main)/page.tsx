import Container from "@/components/Container";
// import ProductList from "@/components/products/list";
// import { Product } from "@prisma/client";
// import { useEffect, useState } from "react";
import Home from "@/components/home/home";
const Landingpage = () => {
	// const [products, setProducts] = useState<Product[]>([]);

	// useEffect(() => {
	// 	const fetchProducts = async () => {
	// 		const res = await fetch("/api/products");
	// 		const data = await res.json();
	// 		setProducts(data.products);
	// 		console.log(data.products.length);
	// 	};

	// 	fetchProducts();
	// }, []);

	return (
		<Container>
			<Home />
			{/* <Container className="my-8">
				<h1 className="font-display text-2xl font-medium text-obsidian mb-4">See whats all Akshat Namkeen have</h1>
				<ProductList products={products} />
			</Container> */}
		</Container>
	);
}

export default Landingpage;