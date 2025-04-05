import { config } from "@/config";
import { cookieToInitialState } from "@account-kit/core";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hom3Town-v3",
  description: "Your home in the metaverse",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Persist state across pages
  // https://accountkit.alchemy.com/react/ssr#persisting-the-account-state
  const initialState = cookieToInitialState(
    config,
    (await headers()).get("cookie") ?? undefined
  );

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers initialState={initialState}>
          <div className="max-w-screen-xl mx-auto">
            <Navbar />
            <main className="container">
              {children}
            </main>
            <Footer />
        </div>
      </Providers>
      </body>
    </html>
  );
}
