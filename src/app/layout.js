import "./globals.css";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import AuthProvider from "@/components/providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "FreshFruit - Fruits & Juices",
  description: "Fresh organic fruits and juices everyday!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" className={`bg-background text-foreground ${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={GeistSans.className}>
        <AuthProvider>
          <main className="min-h-[60vh] pb-20 md:pb-0">
            {children}
          </main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
