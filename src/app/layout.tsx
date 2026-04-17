import type { Metadata, Viewport } from "next";
import { TelegramBridgeFallback } from "@/features/telegram/components/TelegramBridgeFallback";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solo System RPG",
  description: "Telegram-first RPG progression shell for daily self-development."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#080a0d"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script defer src="https://telegram.org/js/telegram-web-app.js" />
        {children}
        <TelegramBridgeFallback />
      </body>
    </html>
  );
}
