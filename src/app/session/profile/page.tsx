import PageHeader from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { fetchUser, fetchWalletLedger, fetchWallets } from "./actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WalletItem, WalletLedgerItem } from "./types";
import { Wallet } from "@/components/session/profile/wallets";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await fetchUser();
  const wallets = await fetchWallets();
  const walletLedger = await fetchWalletLedger();
  console.log("walletLedger", walletLedger);
  const params = await searchParams;
  const tab =
    params?.tab ||
    `${wallets?.items?.[0]?.currency?.toLowerCase()}-wallet` ||
    "usd-wallet";

  const allWallets = wallets.items.map((wallet: WalletItem) => ({
    value: `${wallet.currency.toLowerCase()}-wallet`,
    label: `${wallet.currency} Wallet`,
    link: `/session/profile?tab=${wallet.currency.toLowerCase()}-wallet`,
  }));

  return (
    <div className="w-full px-4 md:px-12 py-4 md:py-6 mb-16 flex flex-col h-full">
      <PageHeader showSeparator={false}>
        <p className="text-text-primary text-lg font-medium">
          Your billing details
        </p>
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
            <Wallet
              wallets={wallets?.items}
              allWallets={allWallets}
              tab={tab}
              walletLedger={walletLedger}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
