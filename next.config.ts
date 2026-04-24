import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: '0znsc5k7w8.ufs.sh' },
			{ protocol: 'https', hostname: 'lh3.googleusercontent.com' },
		],
	}
};

export default nextConfig;
