import { fetchUser, fetchWalletLedger, fetchWallets } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { WalletItem } from "./types";
import { Wallet } from "@/components/session/profile/wallets";
import { extractPaginationParams } from "@/lib/pagination-utils";
import { SessionPageLayout } from "@/components/session/session-page-layout";

export const dynamic = "force-dynamic";

const DEFAULT_PAGE_SIZE = 50;
const PAGE_PARAM_KEY = "wallet_page";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  let user = null;
  let wallets = null;

  try {
    [user, wallets] = await Promise.all([
      fetchUser(),
      fetchWallets(),
    ]);
  } catch (error) {
    console.error("Failed to fetch profile data:", error);
  }

  const params = await searchParams;
  const walletItems = wallets?.items || [];
  const tab =
    (Array.isArray(params?.tab) ? params.tab[0] : params?.tab) ||
    `${walletItems[0]?.currency?.toLowerCase()}-wallet` ||
    "usd-wallet";

  // Extract currency from tab (format: "usd-wallet" -> "USD")
  const selectedCurrency = (tab?.replace("-wallet", "") || "usd").toUpperCase();

  const { currentPage, pageSize, baseUrl } = await extractPaginationParams(
    searchParams,
    DEFAULT_PAGE_SIZE,
    PAGE_PARAM_KEY
  );

  let walletLedger = { data: [], totalCount: 0, hasNext: false };
  try {
    walletLedger = await fetchWalletLedger({
      currency: selectedCurrency,
      pageNumber: currentPage,
      pageSize,
    });
  } catch (error) {
    console.error("Failed to fetch wallet ledger:", error);
  }

  const allWallets = walletItems.map((wallet: WalletItem) => ({
    value: `${wallet.currency.toLowerCase()}-wallet`,
    label: `${wallet.currency} Wallet`,
    link: `/session/profile?tab=${wallet.currency.toLowerCase()}-wallet`,
  }));

  return (
    <SessionPageLayout title="Profile & Wallets" backHref="/session/overview">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-text-primary text-lg font-medium mb-4">
            Your billing details
          </p>
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
        </div>

        {walletItems.length > 0 && (
          <div className="flex flex-col gap-4">
            <p className="text-text-primary text-lg font-medium">Wallets</p>
            <Wallet
              wallets={walletItems}
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
        )}
      </div>
    </SessionPageLayout>
  );
}
