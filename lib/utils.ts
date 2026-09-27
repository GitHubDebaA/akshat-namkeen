import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		minimumFractionDigits: 0,
	}).format(price);
}

export function formatDate(value: string | Date | number): string {
	const date = new Date(value);
	if (isNaN(date.getTime())) return '';

	return new Intl.DateTimeFormat('en-IN', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true
	}).format(date).toLowerCase();
}

export function maskEmail(email: string): string {
	if (!email || !email.includes('@')) return email;

	const [localPart, domain] = email.split('@');

	if (localPart.length <= 2) {
		return `${localPart[0]}*@${domain}`;
	}

	// Keeps the first 2 characters and masks the rest of the local part
	const visiblePart = localPart.slice(0, 2);
	const maskedPart = '*'.repeat(localPart.length - 2);

	return `${visiblePart}${maskedPart}@${domain}`;
}

export function slugify(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}