import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

export const metadata = {
  title: "Friends Juice Bar",
  description: "Fresh and Healthy Juices",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" className={`bg-background text-foreground ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className={`${GeistSans.className} antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
