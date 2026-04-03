import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";
import prisma from "@/lib/prisma";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Flashmart | Premium Shopping",
  description: "Shop premium clothes, cosmetics, and groceries in one place.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }) {
  // Try dynamic fetch for user settings (e.g. text color)
  let settings = { globalTextColor: '#333333' }; // Default Amazon-ish dark text color
  try {
    const s = await prisma.setting.findMany();
    s.forEach(item => {
      settings[item.key] = item.value;
    });
  } catch (err) {
    console.error("Prisma settings fetch failed in layout:", err);
  }

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --dynamic-text: ${settings.globalTextColor || '#0f172a'};
          }
        `}} />
      </head>
      <body className={inter.className}>
        <div id="mobile-container">
          <CartProvider>
            <Navbar />
            <main className="main-container">
              {children}
            </main>
            {/* Bottom Nav Spacer for Mobile */}
            <div className="mobile-only" style={{ height: '70px' }}></div>
          </CartProvider>
        </div>
      </body>
    </html>
  );
}
