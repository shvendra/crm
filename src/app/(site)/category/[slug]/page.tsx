import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CauseData } from "@/app/api/data";
import FormPart from "@/components/Cause/CauseDetails/formPart";
import TextPart from "@/components/Cause/CauseDetails/textPart";
import Volunteer from "@/components/SharedComponent/Volunteer";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = CauseData.find((item) => item.slug === slug);

  if (!item) {
    return {
      title: "Worker Category Not Found | BookMyWorker",
      description: "The requested worker category could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${item.title} | Worker Category | BookMyWorker`;
  const description = `Explore ${item.title} hiring details on BookMyWorker. Find skilled, semi-skilled, and unskilled workforce solutions across India.`;
  const canonicalUrl = `https://www.bookmyworkers.com/worker-category/${item.slug}`;

  return {
    title,
    description,
    keywords: [
      "BookMyWorker",
      item.title,
      "worker category",
      "hire workers India",
      "skilled workers India",
      "unskilled workers India",
      "semi-skilled workers India",
      "labour hiring",
      "manpower services India",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "BookMyWorker",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: `https://www.bookmyworkers.com${item.image}`,
          width: 1200,
          height: 630,
          alt: item.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`https://www.bookmyworkers.com${item.image}`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

const Cause = async ({ params }: Props) => {
  const { slug } = await params;
  const item = CauseData.find((item) => item.slug === slug);

  if (!item) {
    notFound();
  }

  const categoryJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: item.title,
    description: `BookMyWorker category page for ${item.title} workforce hiring and manpower support.`,
    provider: {
      "@type": "Organization",
      name: "BookMyWorker",
      url: "https://www.bookmyworkers.com",
    },
    areaServed: "India",
    url: `https://www.bookmyworkers.com/worker-category/${item.slug}`,
    image: `https://www.bookmyworkers.com${item.image}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(categoryJsonLd),
        }}
      />

      <section className="pt-44 py-24 dark:bg-dark">
        <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) px-4">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-9">
              <div className="mb-8 overflow-hidden rounded-lg">
                <Image
                  src={item.image}
                  alt={`${item.title} - BookMyWorker worker category`}
                  width={870}
                  height={750}
                  className="h-full w-full"
                  priority
                />
              </div>

              <h1 className="mb-8 text-[40px] font-semibold leading-tight">
                {item.title}
              </h1>

              <div className="mb-4 flex items-center gap-4">
                <div className="border-border dark:border-dark_border border-r pr-4">
                  <p className="text-12 mb-1 text-muted dark:text-white/60">
                    Raised
                  </p>
                  <h4 className="text-2xl text-midnight_text dark:text-white">
                    {item.raised}
                  </h4>
                </div>
                <div>
                  <p className="text-12 mb-1 text-muted dark:text-white/60">
                    Goal
                  </p>
                  <h4 className="text-2xl text-midnight_text dark:text-white">
                    {item.goal}
                  </h4>
                </div>
              </div>

              <div className="border-border dark:border-dark_border mb-8 border-b pb-8">
                <div className="h-4 w-full overflow-hidden rounded-full bg-light_grey dark:bg-midnight_text">
                  <div className="relative z-1 h-full w-[60%] rounded-full bg-linear-to-r from-primary to-secondary"></div>
                </div>
              </div>

              <FormPart />
              <TextPart />
            </div>

            <div className="col-span-12 lg:col-span-3">
              <h4 className="mb-6 text-lg font-medium">Search</h4>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search ..."
                  className="dark:border-dark_border w-full rounded-md border border-border px-4 py-3.5 text-base focus:border-primary focus-visible:outline-hidden dark:bg-dark dark:focus:border-primary"
                />
                <span className="absolute top-4 right-5 text-muted dark:text-white/60">
                  <Icon icon="tabler:search" width="25" height="25" />
                </span>
              </div>

              <div className="mt-16">
                <h4 className="mb-6 text-lg font-medium">Categories</h4>
                <ul className="flex flex-col gap-4">
                  <li>
                    <Link
                      href="#"
                      className="text-base text-muted hover:text-primary dark:text-white/60"
                    >
                      Chlidren
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-base text-muted hover:text-primary dark:text-white/60"
                    >
                      Development
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-base text-muted hover:text-primary dark:text-white/60"
                    >
                      Education
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-base text-muted hover:text-primary dark:text-white/60"
                    >
                      Environment
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-base text-muted hover:text-primary dark:text-white/60"
                    >
                      Healthcare
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-base text-muted hover:text-primary dark:text-white/60"
                    >
                      Programs
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Volunteer />
    </>
  );
};

export default Cause;