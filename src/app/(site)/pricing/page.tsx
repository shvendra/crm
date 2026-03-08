import React from "react";
import HeroSub from "@/components/SharedComponent/HeroSub";
import { Metadata } from "next";
import UrgentWorker from "@/components/Home/UrgentDonation";
import PricingPlan from "@/components/pricing/PricingPlan";

export const metadata: Metadata = {
  title: "Pricing Plans | BookMyWorker Workforce Access",

  description:
    "Explore BookMyWorker pricing plans starting from ₹99/month. Get access to 5 lakh+ skilled, semi-skilled, and unskilled workers across India for employers, contractors, and companies.",

  keywords: [
    "BookMyWorker pricing",
    "worker hiring subscription",
    "hire workers India pricing",
    "labour hiring platform cost",
    "BookMyWorker subscription",
    "hire skilled workers India",
    "manpower hiring platform",
    "workforce hiring plans",
  ],

  alternates: {
    canonical: "https://www.bookmyworkers.com/pricing",
  },

  openGraph: {
    title: "Pricing Plans | BookMyWorker Workforce Access",
    description:
      "Get affordable BookMyWorker subscription plans to access skilled, semi-skilled, and unskilled workers across India.",
    url: "https://www.bookmyworkers.com/pricing",
    siteName: "BookMyWorker",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.bookmyworkers.com/images/seo/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BookMyWorker Pricing Plans",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "BookMyWorker Pricing Plans",
    description:
      "Affordable workforce hiring plans starting from ₹99/month with access to thousands of workers across India.",
    images: ["https://www.bookmyworkers.com/images/seo/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

const page = () => {
  return (
    <>
      <HeroSub title="BookMyWorker Pricing Plans" />
      <PricingPlan />
      <UrgentWorker />
    </>
  );
};

export default page;