export interface WalletItem {
  balance: number;
  created_at: string;
  currency: string;
  customer_id: string;
  updated_at: string;
}

export interface Wallet {
  items: WalletItem[];
  total_balance_usd: number;
}
export interface UserResponse {
  business_id: string;
  created_at: string;
  customer_id: string;
  email: string;
  name: string;
  phone_number: string;
}

export interface WalletLedgerItem {
  after_balance?: number;
  amount: number;
  before_balance?: number;
  business_id: string;
  created_at: string;
  currency: string;
  description?: string;
  event_type: string;
  id: string;
  is_credit: boolean;
  reason?: string;
  reference_object_id?: string;
  usd_equivalent_amount: number;
}

export interface CreditEntitlementItem {
  credit_entitlement_id: string;
  name: string;
  unit: string;
  balance: string;
  overage: string;
  description?: string | null;
}

export interface CreditLedgerItem {
  id: string;
  business_id: string;
  customer_id: string;
  credit_entitlement_id: string;
  transaction_type: string;
  amount: string;
  is_credit: boolean;
  balance_before: string;
  balance_after: string;
  overage_before: string;
  overage_after: string;
  created_at: string;
  description?: string | null;
  grant_id?: string | null;
  reference_id?: string | null;
  reference_type?: string | null;
}
