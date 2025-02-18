
import { useTranslations } from "next-intl";

const Page = () => {
  const t = useTranslations("HomePage");
  return (
    <div className="flex flex-col items-center bg-bg-primary justify-center h-screen">
      <div className="text-4xl font-bold text-[#0a4ceb] ">{t("title")}</div>
    </div>
  );
};

export default Page;
