import type { Metadata, Viewport } from "next";
import { Gabarito, Inter, Hanken_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/hooks/theme-provider";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import ThemeToaster from "@/hooks/theme-toaster";
import { DeferredProviders } from "@/hooks/deferred-providers";
import { fetchBusiness } from "@/lib/server-actions";
import ThemeWrapper from "@/components/providers/theme-wrapper";

// Load fonts
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
  // const locale = await getLocale();
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  let businessData = null;
  try {
    businessData = await fetchBusiness();
  } catch (error) {
    console.error("Failed to fetch business data:", error);
  }
  return (
    <html
      lang="en"
      className={`${inter.variable} ${gabarito.variable} ${hankenGrotesk.variable} h-full`}
      suppressHydrationWarning
    >
      <head />
      <body className="font-body w-full h-full overflow-hidden">
        <ThemeWrapper
          sessionThemeConfig={businessData?.theme_config}
          themeMode={businessData?.theme_mode}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            themeMode={businessData?.theme_mode}
          >
            <NextIntlClientProvider messages={messages}>
              <main className="h-full w-full">
                <ThemeToaster />
                {children}
              </main>
            </NextIntlClientProvider>
          </ThemeProvider>
        </ThemeWrapper>
        <DeferredProviders />
      </body>
    </html>
  );
}
