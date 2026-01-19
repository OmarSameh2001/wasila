import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./_components/navbar/navbar";
import { AuthProvider } from "./_utils/context/auth";
import { PopupProvider } from "./_utils/context/popup_provider";
import QueryProvider from "./_utils/query/query";
import PopupComponent from "./_utils/popup/popup";
import { ThemeProvider } from "./_utils/theme/provider";
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
  icons: [
    {
      url: "/wasila_logo.png",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={`antialiased h-full`}>
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
                <div className="flex min-h-screen flex-col">
                  <Navbar />
                  <main className="flex-1 flex flex-col">
                    <PopupComponent />
                    {children}
                  </main>
                  <div className="border-t border-gray-800 py-8 text-center text-gray-900 dark:text-gray-300 text-sm">
                    <p>
                      &copy; 2026 Wasila. All rights reserved. | From the Brokers, For the Brokers
                    </p>
                  </div>
                </div>
              </QueryProvider>
            </PopupProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
