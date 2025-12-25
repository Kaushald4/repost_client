import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import QueryProvider from "@/providers/query-provider";
import { AppHeader } from "@/app/_components/header/app-header";
import { Sidebar } from "@/components/global/sidebar";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Repost - Modern Social Platform",
  description: "A modern, Reddit-inspired social platform for meaningful discussions",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <AppHeader />
            <div className="container mx-auto">
              <div className="flex">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-72 sticky top-16 h-[calc(100vh-4rem)]">
                  <Sidebar />
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0">{children}</main>
              </div>
            </div>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
