import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "Friends Juice Bar",
  description: "Fresh and Healthy Juices",
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
        </ThemeProvider>
        <Toaster
          //  richColors
          position="bottom-right"
        />
        <Analytics />
      </body>
    </html>
  );
}
