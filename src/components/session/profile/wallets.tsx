import { WalletItem, WalletLedgerItem } from "@/app/session/profile/types";
import { SessionTabs } from "@/components/session/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency-helper";
import { CurrencyCode } from "@/lib/currency-helper";

export function Wallet({
  wallets,
  allWallets,
  tab,
  walletLedger,
}: {
  wallets: WalletItem[];
  allWallets: { value: string; label: string; link: string }[];
  tab: string;
  walletLedger: { items: WalletLedgerItem[] };
}) {
  if (allWallets.length === 0) {
    return <p className="text-text-secondary text-sm">No wallets found</p>;
  }
  const selectedCurrency = (tab?.replace("-wallet", "") || "usd").toUpperCase();
  const currentWallet: WalletItem | undefined = wallets.find(
    (wallet: WalletItem) => wallet.currency?.toUpperCase() === selectedCurrency,
  );
  const currentWalletLedger: WalletLedgerItem | undefined = walletLedger.items.find(
    (ledger: WalletLedgerItem) =>
      ledger.currency?.toUpperCase() === selectedCurrency,
  );
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <SessionTabs className="w-full" items={allWallets} currentTab={tab} />
        <Separator className="my-0" />
      </div>
      <Card className="p-6 flex flex-col gap-4">
        <CardHeader className="flex flex-col gap-1 p-3 items-center">
          <CardTitle className="text-text-primary text-lg md:text-2xl text-green-500 font-medium text-center">
            {formatCurrency(
              currentWallet?.balance || 0,
              selectedCurrency as CurrencyCode,
            )}
          </CardTitle>
          <CardDescription className="text-text-secondary text-sm text-center">
            Available balance
          </CardDescription>
        </CardHeader>
        <Separator className="my-0" />
        <CardContent className="flex flex-row gap-2 p-0">
          <div className="flex flex-col gap-2">
            <p className="text-sm">Recent Transactions</p>
            {}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
