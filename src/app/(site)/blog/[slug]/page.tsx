import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogBySlug, getBlogImageUrl } from "../../../../lib/blog";
import BlogPage from "../detail/page";

type Props = {
  params: Promise<{ slug: string }>;
};

function stripHtml(html?: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Not Found | BookMyWorker",
      description: "The requested blog could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const cleanBody = stripHtml(blog.body);
  const description =
    blog.subtitle ||
    cleanBody.slice(0, 160) ||
    "Read the latest workforce insights and hiring updates from BookMyWorker.";

  const imageUrl = getBlogImageUrl(blog.photo);
  const canonicalUrl = `https://www.bookmyworkers.com/blog/${blog.slug}`;

  return {
    title: `${blog.title} | BookMyWorker Blog`,
    description,
    keywords: [
      "BookMyWorker blog",
      blog.title,
      "hire workers India",
      "workforce insights",
      "labour hiring tips",
      "skilled workers India",
      "unskilled workers India",
      "employer hiring guide",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${blog.title} | BookMyWorker Blog`,
      description,
      url: canonicalUrl,
      siteName: "BookMyWorker",
      locale: "en_IN",
      type: "article",
      publishedTime: blog.createdAt,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${blog.title} | BookMyWorker Blog`,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SingleBlogPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description:
      blog.subtitle ||
      stripHtml(blog.body).slice(0, 160) ||
      "Read the latest workforce insights from BookMyWorker.",
    image: [getBlogImageUrl(blog.photo)],
    datePublished: blog.createdAt,
    author: {
      "@type": "Organization",
      name: "BookMyWorker",
    },
    publisher: {
      "@type": "Organization",
      name: "BookMyWorker",
      logo: {
        "@type": "ImageObject",
        url: "https://www.bookmyworkers.com/images/logo.png",
      },
    },
    mainEntityOfPage: `https://www.bookmyworkers.com/blog/${blog.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd),
        }}
      />

      <section className="bg-white pt-32 pb-20 dark:bg-dark">
        <div className="mx-auto max-w-[860px] px-4">
          <div className="mb-7 mt-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-md bg-cyan-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyan-600"
            >
              <span>←</span>
              <span>Go Back</span>
            </Link>
          </div>

          <div className="relative mb-6 h-[240px] w-full overflow-hidden rounded-md sm:h-[320px] md:h-[420px]">
            <Image
              src={getBlogImageUrl(blog.photo)}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <h1 className="mb-4 text-[28px] font-bold leading-tight text-midnight_text dark:text-white md:text-[44px]">
            {blog.title}
          </h1>

          <div className="mb-8 flex items-center justify-between gap-4 border-b border-black/10 pb-4 dark:border-white/10">
            <span className="inline-flex rounded bg-black px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white dark:bg-white dark:text-black">
              Blog
            </span>

            <p className="text-[12px] font-medium text-muted dark:text-white/60">
              {new Date(blog.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          {blog.subtitle && (
            <p className="mb-6 text-[18px] leading-8 text-muted dark:text-white/70">
              {blog.subtitle}
            </p>
          )}

          <div className="rounded-xl bg-white dark:bg-darkmode">
            <div
              className="prose prose-sm max-w-none text-muted dark:prose-invert dark:text-white/70
              prose-headings:text-midnight_text dark:prose-headings:text-white
              prose-p:leading-7 prose-li:leading-7 prose-strong:text-midnight_text dark:prose-strong:text-white
              prose-ul:my-4 prose-ol:my-4 md:prose-base"
              dangerouslySetInnerHTML={{ __html: blog.body || "" }}
            />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-black/10 pt-6 dark:border-white/10">
            <button className="inline-flex items-center gap-2 rounded-md border border-black/10 px-5 py-2.5 text-sm font-semibold text-midnight_text transition hover:bg-black hover:text-white dark:border-white/10 dark:text-white dark:hover:bg-white dark:hover:text-black">
              <span>👍</span>
              <span>Like</span>
            </button>

            <button className="inline-flex items-center gap-2 rounded-md bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600">
              <span>↗</span>
              <span>Share</span>
            </button>
          </div>
        </div>
      </section>

      <BlogPage />
    </>
  );
}