import type { Metadata, Viewport } from "next";
import { Gabarito, Inter } from "next/font/google";
import { ThemeProvider } from "@/hooks/theme-provider";
import { Toaster } from "sonner";

import "./globals.css";
import { StoreProvider } from "@/store/provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

// Load fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const gabarito = Gabarito({
  subsets: ["latin"],
  variable: "--font-gabarito",
});

export const metadata: Metadata = {
  title: "Dodo Payments",
  description: "Launch and Accept Global Payments in less than 60 minutes",
  metadataBase: new URL("https://dodopayments.com"),
  openGraph: {
    title: "Dodo Payments",
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
  return (
    <StoreProvider>
      <html
        lang="en"
        className={`${inter.variable} ${gabarito.variable} h-full`}
        suppressHydrationWarning
      >
        <body className="font-body w-full h-full overflow-x-hidden">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider messages={messages}>
              <main className="mx-auto max-w-[1920px]">
                <Toaster position="top-right" richColors />
                {children}
              </main>
            </NextIntlClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </StoreProvider>
  );
}
