import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: {
    default: "Friends Juice Bar | Fresh Cold-Pressed Juices",
    template: "%s | Friends Juice Bar",
  },
  description:
    "Bangladesh's favourite cold-pressed juice bar. 100% natural juices, smoothies & detox drinks — order online for delivery or self-collect.",
  keywords: [
    "juice bar",
    "cold pressed juice",
    "fresh smoothies",
    "healthy drinks",
    "friends juice bar",
  ],
  authors: [{ name: "Friends Juice Bar" }],
  creator: "Friends Juice Bar",
  metadataBase: new URL("https://friendsjuicebar.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Friends Juice Bar",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`bg-background text-foreground ${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className={`${GeistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
        <Toaster
          //  richColors
          position="bottom-right"
        />
      </body>
    </html>
  );
}
