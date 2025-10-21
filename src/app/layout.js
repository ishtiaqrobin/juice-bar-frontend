import "./globals.css";
import localFont from 'next/font/local';
import { UserProvider } from "@/context/UserContext";

const national2 = localFont({
  src: [
    {
      path: '../fonts/National2-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/National2-Bold.otf',
      weight: '700',
      style: 'normal',
    }
  ],
  variable: '--font-national2'
});

export const metadata = {
  title: "FreshFruit - Fruits & Juices",
  description: "Fresh organic fruits and juices everyday!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" className={`bg-background text-foreground ${national2.variable}`}>
      <body className={national2.className}>
        <UserProvider>
          <main className="min-h-[60vh] pb-20 md:pb-0">{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}
