import type { Metadata, Viewport } from "next";
import { Gabarito, Inter } from "next/font/google";
import { ThemeProvider } from "@/hooks/theme-provider";
import "./globals.css";
import { StoreProvider } from "@/redux/provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import ThemeToaster from "@/hooks/theme-toaster";
import { CSPostHogProvider } from "@/hooks/posthogProvider";

// Load fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const gabarito = Gabarito({
  subsets: ["latin"],
  variable: "--font-gabarito",
});

const baseUrl = process.env.NEXT_PUBLIC_HOST_URL || 'https://dodopayments.com';

export const metadata: Metadata = {
  title: "Dodo Payments | Customer Portal",
  description: "Launch and Accept Global Payments in less than 60 minutes",
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: "Dodo Payments | Customer Portal",
    description: "Launch and Accept Global Payments in less than 60 minutes",
    type: 'website',
    siteName: 'Dodo Payments',
    // Dynamic OG images are now handled by opengraph-image.tsx files in each route
  },
  twitter: {
    card: 'summary_large_image',
    title: "Dodo Payments | Customer Portal",
    description: "Launch and Accept Global Payments in less than 60 minutes",
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
      <CSPostHogProvider>
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
                <ThemeToaster />
                {children}
              </main>
            </NextIntlClientProvider>
          </ThemeProvider>
        </body>
      </html>
      </CSPostHogProvider>
    </StoreProvider>
  );
}
