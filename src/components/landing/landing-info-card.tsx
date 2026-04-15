import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTranslations } from "next-intl";

export const LandingInfoCard = ({ className }: { className?: string }) => {
  const t = useTranslations("LandingInfoCard");

  return (
    <Card className={cn("max-w-2xl bg-bg-secondary", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs sm:text-sm">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="text-text-secondary leading-relaxed">
        <p className="mb-1 text-xs sm:text-sm">
          {t("description")}
          <br className="hidden sm:block" />
          {t.rich("visitPrompt", {
            link: (chunks) => (
              <Link
                href="https://dodopayments.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
      </CardContent>
    </Card>
  );
};
