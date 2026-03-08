import HeroSub from "@/components/SharedComponent/HeroSub";
import CategoryList from "@/components/Cause/CategoryList";
import Volunteer from "@/components/SharedComponent/Volunteer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Worker Categories | BookMyWorker",

  description:
    "Explore worker categories on BookMyWorker including skilled, semi-skilled, and unskilled workers for construction, warehouse, factory, agriculture, household, and other workforce needs across India.",

  keywords: [
    "BookMyWorker",
    "worker categories",
    "skilled workers India",
    "unskilled workers India",
    "semi-skilled workers India",
    "construction workers",
    "warehouse workers",
    "factory workers",
    "labour categories India",
    "find workers near me",
  ],

  alternates: {
    canonical: "https://www.bookmyworkers.com/worker-category",
  },

  openGraph: {
    title: "Worker Categories | BookMyWorker",
    description:
      "Browse skilled, semi-skilled, and unskilled worker categories on BookMyWorker across India.",
    url: "https://www.bookmyworkers.com/worker-category",
    siteName: "BookMyWorker",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.bookmyworkers.com/images/seo/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BookMyWorker Worker Categories",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Worker Categories | BookMyWorker",
    description:
      "Explore worker categories and hire the right workforce through BookMyWorker.",
    images: ["https://www.bookmyworkers.com/images/seo/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

const Page = () => {
  return (
    <>
      <HeroSub title="Worker Categories" />
      <CategoryList />
      <Volunteer />
    </>
  );
};

export default Page;