import React from "react";
import HeroSub from "@/components/SharedComponent/HeroSub";
import { Metadata } from "next";
import UrgentWorker from "@/components/Home/UrgentDonation";
import RefundPolicy from "@/components/refund/RefundPolicy";

export const metadata: Metadata = {
  title: "Refund Policy | BookMyWorker",

  description:
    "Read the BookMyWorker Refund Policy to understand payment rules, subscription terms, and refund conditions for workforce hiring services on the BookMyWorker platform.",

  keywords: [
    "BookMyWorker refund policy",
    "refund policy BookMyWorker",
    "BookMyWorker subscription refund",
    "workforce hiring refund policy",
    "labour hiring platform refund terms",
    "BookMyWorker payment policy",
  ],

  alternates: {
    canonical: "https://www.bookmyworkers.com/refund-policy",
  },

  openGraph: {
    title: "Refund Policy | BookMyWorker",
    description:
      "Understand BookMyWorker's refund terms, payment rules, and subscription conditions for workforce hiring services.",
    url: "https://www.bookmyworkers.com/refund-policy",
    siteName: "BookMyWorker",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.bookmyworkers.com/images/seo/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BookMyWorker Refund Policy",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Refund Policy | BookMyWorker",
    description:
      "Learn about BookMyWorker's refund rules and payment conditions for workforce hiring services.",
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
      <HeroSub title="BookMyWorker Refund Policy" />
      <RefundPolicy />
      <UrgentWorker />
    </>
  );
};

export default page;