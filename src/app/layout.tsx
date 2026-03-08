import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Montserrat } from "next/font/google";
import "./globals.css";

import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { ThemeProvider } from "next-themes";
import ScrollToTop from "@/components/ScrollToTop";
import Aoscompo from "@/utils/aos";
import { DonationProvider } from "./context/donationContext";
import SessionProviderComp from "@/components/nextauth/SessionProvider";
import { AuthDialogProvider } from "./context/AuthDialogContext";
import NextTopLoader from "nextjs-toploader";

const montserrat = Montserrat({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FF4D7E",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bookmyworkers.com"),
  title: {
    default: "BookMyWorker | Hire Skilled & Unskilled Workers Across India",
    template: "%s | BookMyWorker",
  },
  description:
    "BookMyWorker is a trusted workforce platform connecting employers, contractors, companies, suppliers, and workers across India. Hire skilled, semi-skilled, and unskilled workers quickly and efficiently.",
  keywords: [
    "BookMyWorker",
    "hire workers",
    "hire labour India",
    "skilled workers India",
    "semi-skilled workers India",
    "unskilled workers India",
    "construction workers",
    "factory workers",
    "warehouse workers",
    "labour contractor",
    "worker supplier",
    "manpower services India",
    "find workers near me",
  ],
  applicationName: "BookMyWorker",
  category: "business",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  verification: {
    // Replace with your real Google Search Console verification code
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "BookMyWorker" }],
  creator: "BookMyWorker",
  publisher: "BookMyWorker",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "BookMyWorker | Hire Skilled & Unskilled Workers Across India",
    description:
      "BookMyWorker helps employers, contractors, and companies connect with skilled, semi-skilled, and unskilled workers across India.",
    url: "https://www.bookmyworkers.com",
    siteName: "BookMyWorker",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/seo/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BookMyWorker workforce hiring platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BookMyWorker | Hire Skilled & Unskilled Workers Across India",
    description:
      "BookMyWorker connects employers, contractors, suppliers, and workers across India.",
    images: ["/images/seo/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BookMyWorker",
    url: "https://www.bookmyworkers.com",
    logo: "https://www.bookmyworkers.com/images/logo.png",
    email: "support@bookmyworkers.com",
    sameAs: [
      "https://www.facebook.com/BookMyWorker",
      "https://www.instagram.com/bookmyworker/",
      "https://www.linkedin.com/company/bookmyworker",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-7389791873",
        contactType: "customer support",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "KHASARA NO 34/1/33, Karahiya",
      addressLocality: "Rewa",
      addressRegion: "Madhya Pradesh",
      postalCode: "486001",
      addressCountry: "IN",
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BookMyWorker",
    url: "https://www.bookmyworkers.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.bookmyworkers.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={montserrat.className}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PFLVVRPL"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-642593913"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-642593913');
          `}
        </Script>

        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PFLVVRPL');
          `}
        </Script>

        <Script
          id="organization-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />

        <Script
          id="website-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />

        <NextTopLoader color="#FF4D7E" />
        <DonationProvider>
          <AuthDialogProvider>
            <SessionProviderComp>
              <ThemeProvider
                attribute="class"
                enableSystem
                defaultTheme="system"
              >
                <Aoscompo>
                  <Header />
                  {children}
                  <Footer />
                </Aoscompo>
                <ScrollToTop />
              </ThemeProvider>
            </SessionProviderComp>
          </AuthDialogProvider>
        </DonationProvider>
      </body>
    </html>
  );
}