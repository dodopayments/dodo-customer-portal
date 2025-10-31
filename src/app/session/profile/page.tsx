import PageHeader from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { fetchUser, fetchWallets } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionTabs } from "@/components/session/tabs";
import { CurrencyCode, formatCurrency } from "@/lib/currency-helper";

interface WalletItem {
  balance: number,
  created_at: string,
  currency: string,
  customer_id: string,
  updated_at: string,
}
interface Wallet {
  items: WalletItem[];
  total_balance_usd: number;
}

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const user = await fetchUser();
  const wallets = await fetchWallets();

  const params = await searchParams;
  const tab = params?.tab || `${wallets?.items?.[0]?.currency?.toLowerCase()}-wallet` || 'usd-wallet';

  const allWallets = wallets.items.map((wallet: WalletItem) => ({
    value: `${wallet.currency.toLowerCase()}-wallet`,
    label: `${wallet.currency} Wallet`,
    link: `/session/profile?tab=${wallet.currency.toLowerCase()}-wallet`
  }));

  return (
    <div className="w-full px-4 md:px-12 py-4 md:py-6 mb-16 flex flex-col h-full">
      <PageHeader showSeparator={false}>
        <p className="text-text-primary text-lg font-medium">Your billing details</p>
      </PageHeader>
      <Separator className="my-4" />
      <div className="flex flex-col gap-6">
        <Card className="p-6 flex flex-col gap-4">
          <CardContent className="flex flex-row gap-8 p-0">
            <div className="flex flex-col gap-2">
              <p className="text-text-secondary text-sm">Name</p>
              <p className="text-text-primary text-sm">{user?.name}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-text-secondary text-sm">Email</p>
              <p className="text-text-primary text-sm">{user?.email}</p>
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-0">
            <p className="text-text-primary text-lg font-medium">Wallets</p>
            <Wallet wallets={wallets?.items} allWallets={allWallets} tab={tab} />
          </div>
        </div>
      </div>
    </div>
  );
}


function Wallet({ wallets, allWallets, tab }: { wallets: WalletItem[], allWallets: { value: string, label: string, link: string }[], tab: string }) {
  if (allWallets.length === 0) {
    return <p className="text-text-secondary text-sm">No wallets found</p>;
  }
  const selectedCurrency = (tab?.replace("-wallet", "") || "usd").toUpperCase();
  const currentWallet: WalletItem | undefined = wallets.find((wallet: WalletItem) => wallet.currency?.toUpperCase() === selectedCurrency);
  console.log("currentWallet", currentWallet);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <SessionTabs className="w-full" items={allWallets} currentTab={tab} />
        <Separator className="my-0" />
      </div>
      <Card className="p-6 flex flex-col gap-4">
          <CardHeader className="flex flex-col gap-1 p-3 items-center">
            <CardTitle className="text-text-primary text-lg md:text-2xl text-green-500 font-medium text-center">{formatCurrency(currentWallet?.balance || 0, selectedCurrency as CurrencyCode)}</CardTitle>
            <CardDescription className="text-text-secondary text-sm text-center">Available balance</CardDescription>
          </CardHeader>
          <Separator className="my-0" />
          <CardContent className="flex flex-row gap-2 p-0">
            <div className="flex flex-col gap-2">
              <p className="text-sm">Recent Transactions</p>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}