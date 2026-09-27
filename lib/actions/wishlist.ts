"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getCurrentUser() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("You must be logged in.");
    }

    return session.user;
}

export async function addToWishlist(variantId: string) {
    const user = await getCurrentUser();

    const wishlist = await prisma.wishlist.upsert({
        where: {
            userId: user.id,
        },
        create: {
            userId: user.id,
        },
        update: {},
    });

    await prisma.wishlistItem.upsert({
        where: {
            wishlistId_variantId: {
                wishlistId: wishlist.id,
                variantId,
            },
        },
        create: {
            wishlistId: wishlist.id,
            variantId,
        },
        update: {},
    });

    return {
        success: true,
    };
}

export async function removeFromWishlist(variantId: string) {
    const user = await getCurrentUser();

    const wishlist = await prisma.wishlist.findUnique({
        where: {
            userId: user.id,
        },
    });

    if (!wishlist) {
        return {
            success: true,
        };
    }

    await prisma.wishlistItem.deleteMany({
        where: {
            wishlistId: wishlist.id,
            variantId,
        },
    });

    return {
        success: true,
    };
}

export async function toggleWishlist(variantId: string) {
    const user = await getCurrentUser();

    const wishlist = await prisma.wishlist.upsert({
        where: {
            userId: user.id,
        },
        create: {
            userId: user.id,
        },
        update: {},
    });

    const existingItem = await prisma.wishlistItem.findUnique({
        where: {
            wishlistId_variantId: {
                wishlistId: wishlist.id,
                variantId,
            },
        },
    });

    if (existingItem) {
        await prisma.wishlistItem.delete({
            where: {
                id: existingItem.id,
            },
        });

        return {
            success: true,
            wishlisted: false,
        };
    }

    await prisma.wishlistItem.create({
        data: {
            wishlistId: wishlist.id,
            variantId,
        },
    });

    return {
        success: true,
        wishlisted: true,
    };
}

export async function clearWishlist() {
    const user = await getCurrentUser();

    const wishlist = await prisma.wishlist.findUnique({
        where: {
            userId: user.id,
        },
    });

    if (!wishlist) {
        return {
            success: true,
        };
    }

    await prisma.wishlistItem.deleteMany({
        where: {
            wishlistId: wishlist.id,
        },
    });

    return {
        success: true,
    };
}