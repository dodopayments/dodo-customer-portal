export interface WalletItem {
    balance: number,
    created_at: string,
    currency: string,
    customer_id: string,
    updated_at: string,
}

export interface Wallet {
    items: WalletItem[];
    total_balance_usd: number;
}

export interface WalletLedgerItem {
    after_balance: number;
    amount: number;
    before_balance: number;
    business_id: string;
    created_at: string;
    currency: string;
    customer_id: string;
    event_type: string;
    id: string;
    is_credit: boolean;
    reason: string;
    reference_object_id: string;
}