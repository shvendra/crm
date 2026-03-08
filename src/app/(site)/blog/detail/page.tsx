import React from "react";
import BlogCard from "@/components/SharedComponent/Blog/blogCard";
import { getAllBlogs, type BlogItem } from "@/lib/blog";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs | BookMyWorker Workforce Insights",
  description:
    "Read the latest blogs, hiring tips, labour market updates, and workforce insights from BookMyWorker across India.",
  keywords: [
    "BookMyWorker blog",
    "workforce blog India",
    "hire workers India",
    "labour hiring tips",
    "skilled workers India",
    "unskilled workers India",
    "employer hiring guide",
    "BookMyWorker news",
  ],
  alternates: {
    canonical: "https://www.bookmyworkers.com/blog",
  },
  openGraph: {
    title: "Blogs | BookMyWorker Workforce Insights",
    description:
      "Explore BookMyWorker blogs for hiring tips, workforce insights, labour trends, and employer guidance across India.",
    url: "https://www.bookmyworkers.com/blog",
    siteName: "BookMyWorker",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.bookmyworkers.com/images/seo/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BookMyWorker Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BookMyWorker Blogs",
    description:
      "Read BookMyWorker blogs on hiring workers, labour trends, and workforce insights.",
    images: ["https://www.bookmyworkers.com/images/seo/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const BlogPage = async () => {
  let blogs: BlogItem[] = [];

  try {
    blogs = await getAllBlogs();
  } catch (error) {
    blogs = [];
  }

  return (
    <section className="flex flex-wrap justify-center py-16 lg:py-24 dark:bg-dark">
      <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) px-4">
        <div className="mx-auto mb-10 max-w-[820px] text-center">
          <h1 className="mb-4 text-3xl font-bold text-midnight_text dark:text-white md:text-5xl">
            BookMyWorker Blog & Workforce Insights
          </h1>
          <p className="text-base leading-8 text-muted dark:text-white/70 md:text-lg">
            Stay updated with BookMyWorker blogs covering workforce hiring,
            labour market trends, employer guidance, and practical tips for
            finding skilled, semi-skilled, and unskilled workers across India.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-muted dark:text-white/60">
              No blogs found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
            {blogs.map((blog, i) => (
              <div
                key={blog._id || i}
                className="w-full"
                data-aos="fade-up"
                data-aos-delay="200"
                data-aos-duration="1000"
              >
                <BlogCard blog={blog} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogPage;