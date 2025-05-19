import { config } from "../config";
import { cookieToInitialState } from "@account-kit/core";
import type { Metadata } from "next";
import { Inter, Sour_Gummy } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });
const sourGummy = Sour_Gummy({ subsets: ["latin"] });

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
          <Navbar />
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow p-4">
              <div className="max-w-screen-xl mx-auto">
                <main className="items-center text-center justify-center">
                  {children}
                </main>
              </div>
            </div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}