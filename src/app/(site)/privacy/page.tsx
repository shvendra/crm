import React from "react";
import HeroSub from "@/components/SharedComponent/HeroSub";
import { Metadata } from "next";
import UrgentWorker from "@/components/Home/UrgentDonation";
import PrivacyPolicySection from "@/components/privacy/PrivacyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy | BookMyWorker",

  description:
    "Read the Privacy Policy of BookMyWorker to understand how we collect, use, and protect your personal information when using our workforce hiring platform.",

  keywords: [
    "BookMyWorker privacy policy",
    "privacy policy BookMyWorker",
    "user data protection BookMyWorker",
    "BookMyWorker data privacy",
    "workforce platform privacy policy",
    "labour hiring platform privacy",
  ],

  alternates: {
    canonical: "https://www.bookmyworkers.com/privacy",
  },

  openGraph: {
    title: "Privacy Policy | BookMyWorker",
    description:
      "Learn how BookMyWorker protects your data and maintains privacy while connecting employers and workers across India.",
    url: "https://www.bookmyworkers.com/privacy",
    siteName: "BookMyWorker",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.bookmyworkers.com/images/seo/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BookMyWorker Privacy Policy",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | BookMyWorker",
    description:
      "Understand how BookMyWorker collects and protects your personal information.",
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
      <HeroSub title="BookMyWorker Privacy Policy" />
      <PrivacyPolicySection />
      <UrgentWorker />
    </>
  );
};

export default page;