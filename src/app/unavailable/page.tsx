import { Storefront } from "@phosphor-icons/react/dist/ssr";
import { getTranslations } from "next-intl/server";

const Page = async () => {
  const t = await getTranslations("UnavailablePage");
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col gap-4 items-center justify-center max-w-md text-center">
        <div className="rounded-full p-3 bg-bg-secondary">
          <Storefront className="w-6 h-6" />
        </div>
        <h1 className="md:text-3xl text-xl px-10 font-display font-semibold">
          {t("title")}
        </h1>
        <p className="px-10 text-text-secondary">{t("description")}</p>
      </div>
    </div>
  );
};

export default Page;
