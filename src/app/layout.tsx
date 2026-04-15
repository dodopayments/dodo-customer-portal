import type { Metadata, Viewport } from "next";
import { Gabarito, Inter, Hanken_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/hooks/theme-provider";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { AbstractIntlMessages } from "next-intl";
import { getUserLocale } from "@/lib/i18n-helper";
import { LanguageSelector } from "@/components/custom/language-selector";
import ThemeToaster from "@/hooks/theme-toaster";
import { DeferredProviders } from "@/hooks/deferred-providers";
import { cookies } from "next/headers";
import type { ThemeMode } from "@/types/theme";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const gabarito = Gabarito({
  subsets: ["latin"],
  variable: "--font-gabarito",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-display-grotesk",
});

export const metadata: Metadata = {
  title: "Dodo Payments | Customer Portal",
  description: "Launch and Accept Global Payments in less than 60 minutes",
  metadataBase: new URL("https://dodopayments.com"),
  openGraph: {
    title: "Dodo Payments | Customer Portal",
    description: "Launch and Accept Global Payments in less than 60 minutes",
    images: [
      {
        url: "images/brand-assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dodo Payments",
      },
    ],
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0D0D0D" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let locale: string = "en";
  let messages: AbstractIntlMessages = {};
  try {
    locale = await getUserLocale();
    messages = await getMessages();
  } catch (error) {
    console.error("[i18n] Root layout failed to load locale/messages", { error });
  }

  // Read theme_mode from cookie (set during session validation) — no API call
  const cookieStore = await cookies();
  const rawThemeMode = cookieStore.get("theme_mode")?.value;
  const themeMode: ThemeMode | undefined =
    rawThemeMode === "light" || rawThemeMode === "dark" || rawThemeMode === "system"
      ? rawThemeMode
      : undefined;

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${gabarito.variable} ${hankenGrotesk.variable} h-full`}
      suppressHydrationWarning
    >
      <head />
      <body className="font-body w-full h-full overflow-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themeMode={themeMode}
        >
          <NextIntlClientProvider messages={messages}>
            <main className="h-full w-full">
              <ThemeToaster />
              {children}
            </main>
            <div className="fixed flex z-10 bottom-5 right-6">
              <LanguageSelector />
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
        <DeferredProviders />
      </body>
    </html>
  );
}
