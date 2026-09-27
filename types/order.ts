export type OrderStatus =
    | "PROCESSING"
    | "CONFIRMED"
    | "PACKED"
    | "SHIPPED"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED";

export interface Order {
    id: string;
    orderNumber: string;

    userId: string;

    status: OrderStatus;

    createdAt: string;
    updatedAt: string;

    items: OrderItem[];

    subtotal: number;
    discount: number;
    shippingCharge: number;
    tax: number;
    total: number;

    shippingAddress: ShippingAddress;

    payment: Payment;

    tracking?: Tracking;

    statusHistory: OrderStatusHistory[];
}

export interface OrderItem {
    id: string;

    productId: string;
    variantId: string;

    productName: string;
    variantName: string;

    image: string;

    quantity: number;

    unitPrice: number;
    totalPrice: number;
}

export interface ShippingAddress {
    name: string;
    phone: string;

    addressLine1: string;
    addressLine2?: string;

    city: string;
    state: string;
    postalCode: string;

    addressType?: "HOME" | "OFFICE";
}

export type PaymentMethod =
    | "COD"
    | "UPI"
    | "CARD"
    | "NET_BANKING";

export interface Payment {
    method: PaymentMethod;
    status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";

    transactionId?: string;

    paidAt?: string;
}

export interface Tracking {
    courier?: string;
    trackingNumber?: string;

    estimatedDelivery?: string;

    deliveredAt?: string;
}

export interface OrderStatusHistory {
    status: OrderStatus;
    timestamp: string;
    description?: string;
}