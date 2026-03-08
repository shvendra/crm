import React from "react";
import HeroSub from "@/components/SharedComponent/HeroSub";
import { Metadata } from "next";
import UrgentWorker from "@/components/Home/UrgentDonation";
import TermsAndConditionsSection from "@/components/terms/Terms";

export const metadata: Metadata = {
  title: "Terms and Conditions | BookMyWorker",

  description:
    "Read the Terms and Conditions of BookMyWorker for employers, contractors, and workforce suppliers using our platform to hire skilled, semi-skilled, and unskilled workers across India.",

  keywords: [
    "BookMyWorker terms and conditions",
    "worker hiring platform terms",
    "labour hiring terms India",
    "BookMyWorker employer policy",
    "manpower hiring rules",
    "worker supplier platform terms",
  ],

  alternates: {
    canonical: "https://www.bookmyworkers.com/terms",
  },

  openGraph: {
    title: "Terms and Conditions | BookMyWorker",
    description:
      "Understand the terms and conditions for using BookMyWorker workforce hiring platform.",
    url: "https://www.bookmyworkers.com/terms",
    siteName: "BookMyWorker",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.bookmyworkers.com/images/seo/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BookMyWorker Terms and Conditions",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "BookMyWorker Terms and Conditions",
    description:
      "Read the official terms and policies for using the BookMyWorker platform.",
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
      <HeroSub title="Terms and Conditions" />

      <TermsAndConditionsSection />

      <UrgentWorker />
    </>
  );
};

export default page;