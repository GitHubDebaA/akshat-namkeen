import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";
import Provider from "./SessionProvider";
export const metadata: Metadata = {
	title: "Akshat Namkeen | Traditional Indian Snacks",
	description: "Shop Akshat Namkeen snacks online. Explore our range of traditional Indian namkeen, mixtures, bhujia and savory snacks.",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
	return (
		<html lang="en">
			<body className="font-poppins antialiased">
				<Provider>
					<Analytics />
					{children}
				</Provider>
			</body>
		</html>
	);
}
