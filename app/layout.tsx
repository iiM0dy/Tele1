import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSuccessPopup from "@/components/CartSuccessPopup";
import { Rubik, Plus_Jakarta_Sans } from "next/font/google";
import NextTopLoader from 'nextjs-toploader';

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin", "arabic"],
  weight: ["300", "400", "500", "700", "900"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TELE1 - Premium Electronics & Tech Accessories",
  description: "Upgrade your tech with TELE1. Shop the latest smartphones, AirPods, premium mobile covers, screen protectors, and high-performance electronics.",
  metadataBase: new URL("https://tele1.vercel.app"),
  openGraph: {
    title: "TELE1 - Premium Electronics & Tech Accessories",
    description: "Upgrade your tech with TELE1. Shop the latest smartphones, AirPods, and premium mobile accessories.",
    url: "https://tele1.vercel.app",
    siteName: "TELE1",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "TELE1 - Premium Tech Accessories",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TELE1 - Premium Electronics & Tech Accessories",
    description: "Shop the latest smartphones, AirPods, and premium mobile accessories at TELE1.",
    images: ["/logo.jpg"],
  },
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: 'light' }} suppressHydrationWarning>
      <body
        className={`${rubik.variable} ${plusJakarta.variable} antialiased font-body`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <LanguageProvider>
            <CartProvider>
              <NextTopLoader color="#000000" showSpinner={false} />
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
              </div>
              <CartSuccessPopup />
              <Toaster
                position="bottom-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1a1b1e',
                    color: '#fff',
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(8px)',
                  },
                  success: {
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </CartProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
