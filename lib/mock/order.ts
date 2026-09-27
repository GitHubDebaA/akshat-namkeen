import { Order } from "@/types/order";

const deliveredOrder: Order = {
    id: "ord_001",
    orderNumber: "102930921",
    userId: "user_001",

    status: "DELIVERED",

    createdAt: "2026-09-18T10:32:00",
    updatedAt: "2026-09-20T15:45:00",

    items: [
        {
            id: "item_001",
            productId: "prod_aloo_bhujia",
            variantId: "variant_aloo_200",

            productName: "Aloo Bhujia",
            variantName: "200g",

            image: "",

            quantity: 2,
            unitPrice: 120,
            totalPrice: 240,
        },
        {
            id: "item_002",
            productId: "prod_khatta_meetha",
            variantId: "variant_khatta_200",

            productName: "Khatta Meetha",
            variantName: "200g",

            image: '',

            quantity: 1,
            unitPrice: 140,
            totalPrice: 140,
        },
        {
            id: "item_003",
            productId: "prod_khatta_meetha",
            variantId: "variant_khatta_200",

            productName: "Khatta Meetha",
            variantName: "200g",

            image: "",

            quantity: 1,
            unitPrice: 140,
            totalPrice: 140,
        },
    ],

    subtotal: 380,
    discount: 30,
    shippingCharge: 40,
    tax: 0,
    total: 390,

    shippingAddress: {
        name: "Debasis Das",
        phone: "+91 98765 43210",

        addressLine1: "123, Example Residency",
        addressLine2: "Sector 45",

        city: "Gurugram",
        state: "Haryana",
        postalCode: "122003",

        addressType: "HOME",
    },

    payment: {
        method: "UPI",
        status: "PAID",

        transactionId: "TXN_98273645",
        paidAt: "2026-09-18T10:33:00",
    },

    tracking: {
        courier: "Delhivery",
        trackingNumber: "DLV123456789",

        estimatedDelivery: "2026-09-20",
        deliveredAt: "2026-09-20T15:45:00",
    },

    statusHistory: [
        {
            status: "CONFIRMED",
            timestamp: "2026-09-18T10:32:00",
        },
        {
            status: "PACKED",
            timestamp: "2026-09-18T17:20:00",
        },
        {
            status: "SHIPPED",
            timestamp: "2026-09-19T08:15:00",
        },
        {
            status: "OUT_FOR_DELIVERY",
            timestamp: "2026-09-20T08:30:00",
        },
        {
            status: "DELIVERED",
            timestamp: "2026-09-20T15:45:00",
        },
    ],
};


const outForDeliveryOrder: Order = {
    id: "ord_002",
    orderNumber: "AKS-10281",
    userId: "user_001",

    status: "OUT_FOR_DELIVERY",

    createdAt: "2026-09-22T09:15:00",
    updatedAt: "2026-09-26T08:30:00",

    items: [
        {
            id: "item_003",
            productId: "prod_masala_peanuts",
            variantId: "variant_peanuts_400",

            productName: "Masala Peanuts",
            variantName: "400g",

            image: "/products/masala-peanuts.jpg",

            quantity: 1,
            unitPrice: 180,
            totalPrice: 180,
        },
        {
            id: "item_004",
            productId: "prod_moong_dal",
            variantId: "variant_moong_200",

            productName: "Moong Dal",
            variantName: "200g",

            image: "/products/moong-dal.jpg",

            quantity: 2,
            unitPrice: 110,
            totalPrice: 220,
        },
    ],

    subtotal: 400,
    discount: 20,
    shippingCharge: 40,
    tax: 0,
    total: 420,

    shippingAddress: {
        name: "Debasis Das",
        phone: "+91 98765 43210",

        addressLine1: "123, Example Residency",
        addressLine2: "Sector 45",

        city: "Gurugram",
        state: "Haryana",
        postalCode: "122003",

        addressType: "HOME",
    },

    payment: {
        method: "UPI",
        status: "PAID",

        transactionId: "TXN_98273646",
        paidAt: "2026-09-22T09:16:00",
    },

    tracking: {
        courier: "Delhivery",
        trackingNumber: "DLV123456790",

        estimatedDelivery: "2026-09-26",
    },

    statusHistory: [
        {
            status: "CONFIRMED",
            timestamp: "2026-09-22T09:15:00",
        },
        {
            status: "PACKED",
            timestamp: "2026-09-22T16:20:00",
        },
        {
            status: "SHIPPED",
            timestamp: "2026-09-23T08:15:00",
        },
        {
            status: "OUT_FOR_DELIVERY",
            timestamp: "2026-09-26T08:30:00",
        },
    ],
};


const shippedOrder: Order = {
    id: "ord_003",
    orderNumber: "AKS-10274",
    userId: "user_001",

    status: "SHIPPED",

    createdAt: "2026-09-24T14:10:00",
    updatedAt: "2026-09-25T07:45:00",

    items: [
        {
            id: "item_005",
            productId: "prod_bhujia",
            variantId: "variant_bhujia_500",

            productName: "Classic Bhujia",
            variantName: "500g",

            image: "/products/bhujia.jpg",

            quantity: 1,
            unitPrice: 250,
            totalPrice: 250,
        },
    ],

    subtotal: 250,
    discount: 0,
    shippingCharge: 40,
    tax: 0,
    total: 290,

    shippingAddress: {
        name: "Debasis Das",
        phone: "+91 98765 43210",

        addressLine1: "123, Example Residency",
        addressLine2: "Sector 45",

        city: "Gurugram",
        state: "Haryana",
        postalCode: "122003",

        addressType: "HOME",
    },

    payment: {
        method: "CARD",
        status: "PAID",

        transactionId: "TXN_98273647",
        paidAt: "2026-09-24T14:11:00",
    },

    tracking: {
        courier: "Blue Dart",
        trackingNumber: "BD123456789",

        estimatedDelivery: "2026-09-28",
    },

    statusHistory: [
        {
            status: "CONFIRMED",
            timestamp: "2026-09-24T14:10:00",
        },
        {
            status: "PACKED",
            timestamp: "2026-09-24T18:30:00",
        },
        {
            status: "SHIPPED",
            timestamp: "2026-09-25T07:45:00",
        },
    ],
};


const processingOrder: Order = {
    id: "ord_004",
    orderNumber: "AKS-10261",
    userId: "user_001",

    status: "PROCESSING",

    createdAt: "2026-09-25T11:30:00",
    updatedAt: "2026-09-25T11:30:00",

    items: [
        {
            id: "item_006",
            productId: "prod_khatta_meetha",
            variantId: "variant_khatta_500",

            productName: "Khatta Meetha",
            variantName: "500g",

            image: "/products/khatta-meetha.jpg",

            quantity: 2,
            unitPrice: 240,
            totalPrice: 480,
        },
    ],

    subtotal: 480,
    discount: 50,
    shippingCharge: 40,
    tax: 0,
    total: 470,

    shippingAddress: {
        name: "Debasis Das",
        phone: "+91 98765 43210",

        addressLine1: "123, Example Residency",
        addressLine2: "Sector 45",

        city: "Gurugram",
        state: "Haryana",
        postalCode: "122003",

        addressType: "HOME",
    },

    payment: {
        method: "UPI",
        status: "PAID",

        transactionId: "TXN_98273648",
        paidAt: "2026-09-25T11:31:00",
    },

    statusHistory: [
        {
            status: "CONFIRMED",
            timestamp: "2026-09-25T11:30:00",
        },
    ],
};


const cancelledOrder: Order = {
    id: "ord_005",
    orderNumber: "AKS-10245",
    userId: "user_001",

    status: "CANCELLED",

    createdAt: "2026-09-12T16:20:00",
    updatedAt: "2026-09-13T10:15:00",

    items: [
        {
            id: "item_007",
            productId: "prod_moong_dal",
            variantId: "variant_moong_400",

            productName: "Moong Dal",
            variantName: "400g",

            image: "/products/moong-dal.jpg",

            quantity: 1,
            unitPrice: 200,
            totalPrice: 200,
        },
    ],

    subtotal: 200,
    discount: 0,
    shippingCharge: 40,
    tax: 0,
    total: 240,

    shippingAddress: {
        name: "Debasis Das",
        phone: "+91 98765 43210",

        addressLine1: "123, Example Residency",
        addressLine2: "Sector 45",

        city: "Gurugram",
        state: "Haryana",
        postalCode: "122003",

        addressType: "HOME",
    },

    payment: {
        method: "UPI",
        status: "REFUNDED",

        transactionId: "TXN_98273649",
        paidAt: "2026-09-12T16:21:00",
    },

    statusHistory: [
        {
            status: "CONFIRMED",
            timestamp: "2026-09-12T16:20:00",
        },
        {
            status: "CANCELLED",
            timestamp: "2026-09-13T10:15:00",
            description: "Cancelled by customer",
        },
    ],
};


const anotherDeliveredOrder: Order = {
    id: "ord_006",
    orderNumber: "AKS-10231",
    userId: "user_001",

    status: "DELIVERED",

    createdAt: "2026-08-28T12:15:00",
    updatedAt: "2026-08-30T17:30:00",

    items: [
        {
            id: "item_008",
            productId: "prod_masala_peanuts",
            variantId: "variant_peanuts_200",

            productName: "Masala Peanuts",
            variantName: "200g",

            image: "/products/masala-peanuts.jpg",

            quantity: 2,
            unitPrice: 100,
            totalPrice: 200,
        },
        {
            id: "item_009",
            productId: "prod_aloo_bhujia",
            variantId: "variant_aloo_400",

            productName: "Aloo Bhujia",
            variantName: "400g",

            image: "/products/aloo-bhujia.jpg",

            quantity: 1,
            unitPrice: 220,
            totalPrice: 220,
        },
    ],

    subtotal: 420,
    discount: 20,
    shippingCharge: 40,
    tax: 0,
    total: 440,

    shippingAddress: {
        name: "Debasis Das",
        phone: "+91 98765 43210",

        addressLine1: "123, Example Residency",
        addressLine2: "Sector 45",

        city: "Gurugram",
        state: "Haryana",
        postalCode: "122003",

        addressType: "HOME",
    },

    payment: {
        method: "COD",
        status: "PAID",
    },

    tracking: {
        courier: "Delhivery",
        trackingNumber: "DLV123456780",

        estimatedDelivery: "2026-08-30",
        deliveredAt: "2026-08-30T17:30:00",
    },

    statusHistory: [
        {
            status: "CONFIRMED",
            timestamp: "2026-08-28T12:15:00",
        },
        {
            status: "PACKED",
            timestamp: "2026-08-28T18:20:00",
        },
        {
            status: "SHIPPED",
            timestamp: "2026-08-29T08:15:00",
        },
        {
            status: "OUT_FOR_DELIVERY",
            timestamp: "2026-08-30T09:00:00",
        },
        {
            status: "DELIVERED",
            timestamp: "2026-08-30T17:30:00",
        },
    ],
};


export const mockOrders: Order[] = [
    deliveredOrder,
    outForDeliveryOrder,
    shippedOrder,
    processingOrder,
    cancelledOrder,
    anotherDeliveredOrder,
];