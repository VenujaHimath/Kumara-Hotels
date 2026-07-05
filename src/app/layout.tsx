import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import SchemaMarkup from "@/components/SchemaMarkup";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Kumara Hotels | Luxury Hotel Group Sri Lanka",
  description: "Experience unforgettable stays across our premium hotels in Sri Lanka: Sanhida Guest House, Lake Garden Villa, City Heaven Villa, and Option Resort & Restaurant. Book your stay now.",
  metadataBase: new URL("https://kumarahotels.com"),
  openGraph: {
    title: "Kumara Hotels | Premium Hospitality",
    description: "Discover luxury stays across Sri Lanka. High-end comfort, natural getaways, urban business retreats, and modern lofts.",
    images: ["/og-image.jpg"],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  // Mobile viewport — prevents iOS auto-zoom and ensures correct scaling
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  // iOS PWA / home-screen meta
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kumara Hotels",
  },
  // Theme color for Android Chrome address bar
  themeColor: "#09090b",
  formatDetection: {
    telephone: false, // we use explicit tel: links; avoid iOS auto-linking random numbers
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <SchemaMarkup />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <LanguageProvider>
          <div className="flex flex-col min-h-screen relative">
            <Navbar />
            <main className="flex-grow pt-20">
              {children}
            </main>
            <Footer />
            <WhatsAppWidget />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}

