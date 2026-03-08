import ContactForm from "@/components/Contact/Form";
import Volunteer from "@/components/SharedComponent/Volunteer";
import React from "react";
import HeroSub from "@/components/SharedComponent/HeroSub";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | BookMyWorker",

  description:
    "Contact BookMyWorker for workforce hiring support, business enquiries, worker supplier partnerships, and manpower solutions across India.",

  keywords: [
    "BookMyWorker contact",
    "contact BookMyWorker",
    "hire workers India",
    "workforce support India",
    "manpower enquiry",
    "labour hiring support",
    "worker supplier contact",
    "business enquiry BookMyWorker",
  ],

  alternates: {
    canonical: "https://www.bookmyworkers.com/contact",
  },

  openGraph: {
    title: "Contact Us | BookMyWorker",
    description:
      "Get in touch with BookMyWorker for hiring support, workforce solutions, and business enquiries across India.",
    url: "https://www.bookmyworkers.com/contact",
    siteName: "BookMyWorker",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.bookmyworkers.com/images/seo/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Contact BookMyWorker",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Contact Us | BookMyWorker",
    description:
      "Connect with BookMyWorker for workforce hiring support and business enquiries.",
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
      <HeroSub title="Contact BookMyWorker" />
      <ContactForm />
      <Volunteer />
    </>
  );
};

export default page;