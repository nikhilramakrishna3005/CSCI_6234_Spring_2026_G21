import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/toast-provider";
import { AppStateProvider } from "@/lib/app-state";

export const metadata: Metadata = {
  title: "MicroMeet",
  description: "Real-time micro meetup social discovery demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ToastProvider>
          <AppStateProvider>{children}</AppStateProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
