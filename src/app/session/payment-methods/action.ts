export interface DummyPaymentMethod {
    id: string;
    type: "card" | "other";
    brand?: "mastercard" | "visa" | "amex" | "discover" | "google" | "apple" | "other";
    last4?: string;
    name?: string;
}

const dummyPaymentMethods: DummyPaymentMethod[] = [{
    id: "1",
    type: "card",
    last4: "1234",
    brand: "mastercard",
    name: "Mastercard",
}, {
    id: "2",
    type: "other",
    name: "Google Pay",
    brand: "google",
}, {
    id: "3",
    type: "other",
    name: "Apple Pay",
    brand: "apple",
}];


export async function fetchPaymentMethods() {
    return dummyPaymentMethods;
}