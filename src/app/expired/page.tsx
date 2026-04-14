import { Warning } from "@phosphor-icons/react/dist/ssr";
import { getTranslations } from "next-intl/server";

const Page = async () => {
  const t = await getTranslations("ExpiredPage");
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col gap-4 items-center justify-center">
        <div className="rounded-full p-3 bg-bg-secondary">
          <Warning className="w-6 h-6" />
        </div>
        <h1 className="md:text-3xl text-xl px-10 font-display font-semibold">
          {t("title")}
        </h1>
      </div>
    </div>
  );
};

export default Page;
