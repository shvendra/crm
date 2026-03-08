"use client";

import Link from "next/link";

const UrgentWorker = () => {
  return (
    <section className="bg-[url('/images/background/urgent_worker.png')] bg-cover bg-center sm:py-52 lg:py-28 py-16 bg-no-repeat">
      <div className="container mx-auto lg:max-w-(--breakpoint-xl) px-4">
        <div
          className="bg-white dark:bg-dark max-w-[700px] w-full px-10 py-14 rounded-lg text-center mx-auto"
          data-aos="fade-right"
        >
          <h3 className="sm:text-3xl text-xl font-bold mb-5 text-midnight_text dark:text-white">
            Urgently Need Workers for Your Work?
          </h3>

          <p className="text-muted dark:text-white/60 sm:text-base text-sm mb-7 leading-7">
            Is your work getting delayed because you cannot find workers on
            time? Connect with thousands of skilled, semi-skilled, and
            unskilled workers across construction, factories, farms, domestic
            services, and many more categories. Get direct worker and supplier
            contacts and hire workers near you within minutes.
          </p>
<div className="flex justify-center">
  <a
    href="https://www.bookmyworkers.com/register"
    target="_blank"
    rel="noopener noreferrer"
    className="bg-linear-to-r from-primary to-secondary px-7 border text-sm font-semibold text-white border-transparent py-4 rounded-sm hover:from-transparent hover:to-transparent hover:border-primary hover:text-primary transition-all duration-300"
  >
    Find Workers Now
  </a>
</div>
        </div>
      </div>
    </section>
  );
};

export default UrgentWorker;