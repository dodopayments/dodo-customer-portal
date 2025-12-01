import PageHeader from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { fetchUser, fetchWalletLedger, fetchWallets } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { WalletItem } from "./types";
import { Wallet } from "@/components/session/profile/wallets";
import { extractPaginationParams } from "@/lib/pagination-utils";

const DEFAULT_PAGE_SIZE = 50;
const PAGE_PARAM_KEY = "wallet_page";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await fetchUser();
  const wallets = await fetchWallets();
  const params = await searchParams;
  const tab =
    (Array.isArray(params?.tab) ? params.tab[0] : params?.tab) ||
    `${wallets?.items?.[0]?.currency?.toLowerCase()}-wallet` ||
    "usd-wallet";

  // Extract currency from tab (format: "usd-wallet" -> "USD")
  const selectedCurrency = (tab?.replace("-wallet", "") || "usd").toUpperCase();

  const { currentPage, pageSize, baseUrl } = await extractPaginationParams(
    searchParams,
    DEFAULT_PAGE_SIZE,
    PAGE_PARAM_KEY
  );

  const walletLedger = await fetchWalletLedger({
    currency: selectedCurrency,
    pageNumber: currentPage,
    pageSize,
  });

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
          <CardContent className="flex flex-col md:flex-row gap-4 md:gap-8 p-0">
            <div className="flex flex-col gap-2 min-w-0">
              <p className="text-text-secondary text-sm">Name</p>
              <p className="text-text-primary text-sm break-words">
                {user?.name}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-w-0">
              <p className="text-text-secondary text-sm">Email</p>
              <p className="text-text-primary text-sm break-all">
                {user?.email}
              </p>
            </div>
          </CardContent>
        </Card>
        {wallets?.items?.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-0">
              <p className="text-text-primary text-lg font-medium">Wallets</p>
              <Wallet
                wallets={wallets?.items}
                allWallets={allWallets}
                tab={tab}
                walletLedger={walletLedger.data}
                currentPage={currentPage}
                pageSize={pageSize}
                currentPageItems={walletLedger.data.length}
                hasNextPage={walletLedger.hasNext}
                baseUrl={baseUrl}
                pageParamKey={PAGE_PARAM_KEY}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
