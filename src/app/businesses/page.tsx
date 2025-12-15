import { extractPaginationParams } from "@/lib/pagination-utils";
import { fetchBusinesses } from "./action";
import NavbarTwo from "@/components/navbar-two";

interface BusinessesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const DEFAULT_PAGE_SIZE = 50;
const PAGE_PARAM_KEY = "business_page";

export default async function BusinessesPage({
  searchParams,
}: BusinessesPageProps) {
  const { currentPage, pageSize, baseUrl } = await extractPaginationParams(
    searchParams,
    DEFAULT_PAGE_SIZE,
    PAGE_PARAM_KEY
  );
  const businessesData = await fetchBusinesses(currentPage, pageSize);
  console.log(businessesData);

  return (
    <div className="w-full px-4 md:px-12 py-4 md:py-6 mb-16 flex flex-col h-ful container mx-auto">
      <NavbarTwo />
    </div>
  );
}
