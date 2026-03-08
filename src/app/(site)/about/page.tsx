import React from "react";
import AboutUs from "@/components/About/AboutUs";
import HeroSub from "@/components/SharedComponent/HeroSub";
import UrgentWorker from "@/components/Home/UrgentDonation";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About BookMyWorker | Workforce Hiring Platform India",

  description:
    "Learn about BookMyWorker, a trusted workforce platform connecting employers, contractors, suppliers, and workers across India. Hire skilled, semi-skilled, and unskilled workers easily.",

  keywords: [
    "BookMyWorker",
    "About BookMyWorker",
    "hire workers India",
    "skilled workers India",
    "unskilled workers India",
    "manpower hiring platform",
    "worker hiring platform India",
    "labour supplier India",
  ],

  alternates: {
    canonical: "https://www.bookmyworkers.com/about",
  },

  openGraph: {
    title: "About BookMyWorker | Workforce Hiring Platform India",
    description:
      "BookMyWorker connects employers with skilled, semi-skilled, and unskilled workers across India.",
    url: "https://www.bookmyworkers.com/about",
    siteName: "BookMyWorker",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.bookmyworkers.com/images/seo/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "About BookMyWorker Workforce Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "About BookMyWorker",
    description:
      "BookMyWorker helps employers hire skilled and unskilled workers across India.",
    images: ["https://www.bookmyworkers.com/images/seo/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

const AboutPage = () => {
  return (
    <>
      <HeroSub title="About BookMyWorker" />

      <AboutUs />

      <UrgentWorker />
    </>
  );
};

export default AboutPage;