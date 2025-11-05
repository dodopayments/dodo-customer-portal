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
import { decodeCurrency, formatCurrency } from "@/lib/currency-helper";
import { CurrencyCode } from "@/lib/currency-helper";
import { WalletTable } from "./wallet-table";

export function Wallet({
  wallets,
  allWallets,
  tab,
  walletLedger,
  currentPage,
  pageSize,
  currentPageItems,
  hasNextPage,
  baseUrl,
  pageParamKey,
}: {
  wallets: WalletItem[];
  allWallets: { value: string; label: string; link: string }[];
  tab: string;
  walletLedger: WalletLedgerItem[];
  currentPage: number;
  pageSize: number;
  currentPageItems: number;
  hasNextPage: boolean;
  baseUrl: string;
  pageParamKey?: string;
}) {
  if (allWallets.length === 0) {
    return <p className="text-text-secondary text-sm">No wallets found</p>;
  }
  const selectedCurrency = (tab?.replace("-wallet", "") || "usd").toUpperCase();
  const currentWallet: WalletItem | undefined = wallets.find(
    (wallet: WalletItem) => wallet.currency?.toUpperCase() === selectedCurrency
  );
  const ledgerItems = walletLedger || [];
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
              decodeCurrency(
                currentWallet?.balance || 0,
                selectedCurrency as CurrencyCode
              ),
              selectedCurrency as CurrencyCode
            )}
          </CardTitle>
          <CardDescription className="text-text-secondary text-sm text-center">
            Available balance
          </CardDescription>
        </CardHeader>
        <Separator className="my-0" />
        <CardContent className="flex flex-col gap-4 p-0">
          <div className="flex flex-col gap-2">
            <p className="text-sm">Recent Transactions</p>
            <WalletTable
              walletLedger={ledgerItems}
              currentPage={currentPage}
              pageSize={pageSize}
              currentPageItems={currentPageItems}
              hasNextPage={hasNextPage}
              baseUrl={baseUrl}
              pageParamKey={pageParamKey}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
