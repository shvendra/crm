import React from "react";
import HeroSub from "@/components/SharedComponent/HeroSub";
import { Metadata } from "next";
import UrgentWorker from "@/components/Home/UrgentDonation";
import Help from "@/components/Home/Help";

export const metadata: Metadata = {
  title: "Workforce Hiring Services | BookMyWorker",

  description:
    "Explore BookMyWorker services for hiring skilled, semi-skilled, and unskilled workers across India. Connect with manpower suppliers, contractors, and workforce providers easily.",

  keywords: [
    "BookMyWorker services",
    "hire workers India",
    "manpower services India",
    "skilled workers hiring",
    "unskilled labour hiring",
    "contractor workforce services",
    "worker supplier platform",
    "labour hiring platform India",
  ],

  alternates: {
    canonical: "https://www.bookmyworkers.com/services",
  },

  openGraph: {
    title: "Workforce Hiring Services | BookMyWorker",
    description:
      "Discover BookMyWorker services for connecting employers with skilled, semi-skilled, and unskilled workers across India.",
    url: "https://www.bookmyworkers.com/services",
    siteName: "BookMyWorker",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.bookmyworkers.com/images/seo/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BookMyWorker Workforce Services",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "BookMyWorker Workforce Services",
    description:
      "Find workforce hiring solutions with BookMyWorker services across India.",
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
      <HeroSub title="BookMyWorker Services" />
      <Help />
      <UrgentWorker />
    </>
  );
};

export default page;