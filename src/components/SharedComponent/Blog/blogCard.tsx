import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BlogItem, getBlogImageUrl } from "../../../lib/blog";

type Props = {
  blog: BlogItem;
};

const BlogCard = ({ blog }: Props) => {
  return (
    <div className="w-full">
      <Link
        href={`/blog/${blog._id}`}
        className="flex flex-col gap-5 md:flex-row md:items-start"
      >
        <div className="relative h-[180px] w-full overflow-hidden rounded-[10px] md:h-[180px] md:w-[235px] min-w-[235px]">
          <Image
            src={getBlogImageUrl(blog.photo)}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col justify-center pt-1">
          <p className="mb-3 text-[16px] font-medium text-[#98A2B3]">
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </p>

          <h3 className="mb-4 text-[22px] font-semibold leading-[1.25] line-clamp-2">
            {blog.title}
          </h3>

          <div className="inline-flex items-center gap-3 text-[16px] font-semibold text-[#12B8C8]">
            <span>Read More</span>
            <span className="text-[22px] leading-none">→</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;