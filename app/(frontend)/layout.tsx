import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./_components/navbar/navbar";
import { AuthProvider } from "./_components/utils/context/auth";
import { PopupProvider } from "./_components/utils/context/popup_provider";
import QueryProvider from "./_components/utils/query/query";
import PopupComponent from "./_components/popup/popup";
import { ThemeProvider } from "./_components/utils/theme/provider";
import { Toaster } from "react-hot-toast";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Wasila",
  description: "Wasila for insurance brokers",
  icons: {
    icon: [
      { url: "/icon/wasila_icon_32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon/wasila_icon_192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon/wasila_icon_512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icon/wasila_icon_180.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="theme"
        >
          <Toaster position="top-right" reverseOrder={false} />
          <AuthProvider>
            <PopupProvider>
              <QueryProvider>
                <Navbar />
                <PopupComponent />
                {children}
              </QueryProvider>
            </PopupProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
