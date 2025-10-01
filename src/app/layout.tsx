import type { Metadata, Viewport } from "next";
import { Gabarito, Inter } from "next/font/google";
import { ThemeProvider } from "@/hooks/theme-provider";
import "./globals.css";
import { StoreProvider } from "@/redux/provider";
import ThemeToaster from "@/hooks/theme-toaster";
import { CSPostHogProvider } from "@/hooks/posthogProvider";
import { LingoProvider, loadDictionary } from "lingo.dev/react/rsc";

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
  return (
    <StoreProvider>
      <CSPostHogProvider>
      <html
        lang="en"
        className={`${inter.variable} ${gabarito.variable} h-full`}
        suppressHydrationWarning
      >
        <body className="font-body w-full h-full overflow-x-hidden">
          <LingoProvider loadDictionary={(locale) => loadDictionary(locale)}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <main className="mx-auto max-w-[1920px]">
                <ThemeToaster />
                {children}
              </main>
            </ThemeProvider>
          </LingoProvider>
        </body>
      </html>
      </CSPostHogProvider>
    </StoreProvider>
  );
}