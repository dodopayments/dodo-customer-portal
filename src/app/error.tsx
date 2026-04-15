"use client";

import { Component, type ReactNode } from "react";
import IconColors from "@/components/custom/icon-colors";
import { SmileySad } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";

function TranslatedContent() {
  const t = useTranslations("ErrorPage");
  return (
    <>
      <h1 className="text-xl mt-4 font-display font-semibold">{t("title")}</h1>
      <p className="text-sm mt-2 max-w-sm text-text-secondary text-center">
        {t("description")}
      </p>
    </>
  );
}

const FallbackContent = () => (
  <>
    <h1 className="text-xl mt-4 font-display font-semibold">Something went wrong</h1>
    <p className="text-sm mt-2 max-w-sm text-text-secondary text-center">
      You might be having a network connection problem, the link might be
      expired, or the link/product might be invalid.
    </p>
  </>
);

class TranslationGuard extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <FallbackContent /> : this.props.children;
  }
}

const Error = () => {
  return (
    <div className="w-full h-screen flex flex-col bg-bg-primary items-center justify-center">
      <IconColors icon={<SmileySad className="w-6 h-6" />} />
      <TranslationGuard>
        <TranslatedContent />
      </TranslationGuard>
    </div>
  );
};

export default Error;
