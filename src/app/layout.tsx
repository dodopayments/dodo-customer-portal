import type { Metadata, Viewport } from "next";
import { Gabarito, Inter, Hanken_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/hooks/theme-provider";
import "./globals.css";
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

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken-grotesk",
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
  return (
    <CSPostHogProvider>
    <html
      lang="en"
      className={`${inter.variable} ${gabarito.variable} ${hankenGrotesk.variable} h-full`}
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
  );
}
