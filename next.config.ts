import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Keep Turbopack scoped to this app so it doesn't use the unrelated
	// workspace lockfile in the user's home directory as the project root.
	turbopack: {
		root: process.cwd(),
	},
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: '0znsc5k7w8.ufs.sh' },
			{ protocol: 'https', hostname: 'lh3.googleusercontent.com' },
		],
	}
};

export default nextConfig;
