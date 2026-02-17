import { fetchUser, fetchWalletLedger, fetchWallets, fetchCreditEntitlements, fetchCreditEntitlementLedger } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { WalletItem, CreditEntitlementItem, CreditLedgerItem } from "./types";
import { Wallet } from "@/components/session/profile/wallets";
import { Credits } from "@/components/session/profile/credits";
import { extractPaginationParams } from "@/lib/pagination-utils";
import { SessionPageLayout } from "@/components/session/session-page-layout";

export const dynamic = "force-dynamic";

const DEFAULT_PAGE_SIZE = 50;
const WALLET_PAGE_PARAM_KEY = "wallet_page";
const CREDITS_PAGE_PARAM_KEY = "credits_page";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  let user = null;
  let wallets = null;
  let creditEntitlements = null;

  try {
    [user, wallets, creditEntitlements] = await Promise.all([
      fetchUser(),
      fetchWallets(),
      fetchCreditEntitlements(),
    ]);
  } catch (error) {
    console.error("Failed to fetch profile data:", error);
  }

  const params = await searchParams;

  // --- Wallets ---
  const walletItems = wallets?.items || [];
  const tab =
    (Array.isArray(params?.tab) ? params.tab[0] : params?.tab) ||
    `${walletItems[0]?.currency?.toLowerCase()}-wallet` ||
    "usd-wallet";

  // Extract currency from tab (format: "usd-wallet" -> "USD")
  const selectedWalletCurrency = (tab?.replace("-wallet", "") || "usd").toUpperCase();

  const { currentPage: walletCurrentPage, pageSize: walletPageSize, baseUrl: walletBaseUrl } = await extractPaginationParams(
    searchParams,
    DEFAULT_PAGE_SIZE,
    WALLET_PAGE_PARAM_KEY
  );

  let walletLedger = { data: [], totalCount: 0, hasNext: false };
  try {
    walletLedger = await fetchWalletLedger({
      currency: selectedWalletCurrency,
      pageNumber: walletCurrentPage,
      pageSize: walletPageSize,
    });
  } catch (error) {
    console.error("Failed to fetch wallet ledger:", error);
  }

  const allWallets = walletItems.map((wallet: WalletItem) => ({
    value: `${wallet.currency.toLowerCase()}-wallet`,
    label: `${wallet.currency} Wallet`,
    link: `/session/profile?tab=${wallet.currency.toLowerCase()}-wallet`,
  }));

  // --- Credit Entitlements ---
  const entitlementItems = creditEntitlements?.items || [];

  const creditsTab =
    (Array.isArray(params?.credits_tab) ? params.credits_tab[0] : params?.credits_tab) ||
    entitlementItems[0]?.credit_entitlement_id ||
    "";

  const { currentPage: creditsCurrentPage, pageSize: creditsPageSize, baseUrl: creditsBaseUrl } = await extractPaginationParams(
    searchParams,
    DEFAULT_PAGE_SIZE,
    CREDITS_PAGE_PARAM_KEY
  );

  let creditLedger: { data: CreditLedgerItem[]; totalCount: number; hasNext: boolean } = { data: [], totalCount: 0, hasNext: false };
  if (creditsTab) {
    try {
      creditLedger = await fetchCreditEntitlementLedger({
        creditEntitlementId: creditsTab,
        pageNumber: creditsCurrentPage,
        pageSize: creditsPageSize,
      });
    } catch (error) {
      console.error("Failed to fetch credit entitlement ledger:", error);
    }
  }

  const allEntitlements = entitlementItems.map((entitlement: CreditEntitlementItem) => ({
    value: entitlement.credit_entitlement_id,
    label: entitlement.name,
    link: `/session/profile?credits_tab=${entitlement.credit_entitlement_id}`,
  }));

  return (
    <SessionPageLayout backHref="/session/overview">
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
              currentPage={walletCurrentPage}
              pageSize={walletPageSize}
              currentPageItems={walletLedger.data.length}
              hasNextPage={walletLedger.hasNext}
              baseUrl={walletBaseUrl}
              pageParamKey={WALLET_PAGE_PARAM_KEY}
            />
          </div>
        )}

        {entitlementItems.length > 0 && (
          <div className="flex flex-col gap-4">
            <p className="text-text-primary text-lg font-medium">Credits</p>
            <Credits
              entitlements={entitlementItems}
              allEntitlements={allEntitlements}
              tab={creditsTab}
              creditLedger={creditLedger.data}
              currentPage={creditsCurrentPage}
              pageSize={creditsPageSize}
              currentPageItems={creditLedger.data.length}
              hasNextPage={creditLedger.hasNext}
              baseUrl={creditsBaseUrl}
              pageParamKey={CREDITS_PAGE_PARAM_KEY}
            />
          </div>
        )}
      </div>
    </SessionPageLayout>
  );
}
