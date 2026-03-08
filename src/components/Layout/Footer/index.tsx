import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../Header/Logo";
import { menuItemsFooter } from "@/app/api/data";
import { Icon } from "@iconify/react/dist/iconify.js";

const Footer: FC = () => {
  return (
    <footer className="pt-16 dark:bg-dark">
      <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) px-4">

   <div className="grid grid-cols-12 gap-8 pb-10">

  {/* Column 1 - Logo & Description (5 columns) */}
  <div className="lg:col-span-5 md:col-span-6 col-span-12">
    <Logo />
    <div className="mt-6">
      <p className="text-sm font-light text-muted dark:text-white/60 mb-6">
        BookMyWorker connects employers with verified skilled, semi-skilled,
        and unskilled workers across India, making workforce hiring simple,
        transparent, and reliable for industries, businesses, and households.
      </p>
    </div>
  </div>

  {/* Column 2 - Contact Info (4 columns) */}
  <div className="lg:col-span-4 md:col-span-6 col-span-12">
    <div className="flex items-start mb-8 gap-4">
      <Image
        src="/images/icons/icon-pin.svg"
        alt="icon"
        width={24}
        height={24}
      />
      <div>
        <h5 className="text-sm text-midnight_text dark:text-white mb-2">
          BookMyWorker Head Office
        </h5>
        <p className="text-sm text-muted dark:text-white/60">
          KHASARA NO 34/1/33, Karahiya, Rewa, Madhya Pradesh 486001, India
        </p>
      </div>
    </div>

    <div className="flex items-center mb-6 gap-4">
      <Image
        src="/images/icons/icon-phone.svg"
        alt="icon"
        width={24}
        height={24}
      />
      <Link
        href="tel:+917389791873"
        className="text-sm text-midnight_text dark:text-white hover:text-primary"
      >
        +91 7389791873
      </Link>
    </div>

    <div className="flex items-center gap-4">
      <Image
        src="/images/icons/icon-mail.svg"
        alt="icon"
        width={24}
        height={24}
      />
      <Link
        href="mailto:support@bookmyworkers.com"
        className="text-sm text-midnight_text dark:text-white hover:text-primary"
      >
        support@bookmyworkers.com
      </Link>
    </div>
  </div>

  {/* Column 3 - Useful Links (3 columns) */}
  <div className="lg:col-span-3 md:col-span-12 col-span-12">
    <h4 className="text-base text-midnight_text dark:text-white mb-4">
      Useful Links
    </h4>
    <ul className="pl-5">
      {menuItemsFooter.slice(0, 5).map((item, index) => (
        <li key={index} className="mb-1">
          <Link
            href={item.link}
            className="text-sm relative text-muted dark:text-white/60 hover:text-primary dark:hover:text-primary hover:before:border-primary before:content-[''] before:absolute before:w-2 before:h-2 before:border-t-2 before:border-r-2 before:top-1 before:-left-5 before:rotate-45"
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>

</div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border dark:border-dark_border">
        <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) px-4 flex items-center justify-between py-6 lg:flex-nowrap flex-wrap lg:gap-0 gap-4">
          <p className="text-sm text-midnight_text dark:text-white">
            © {new Date().getFullYear()} <span>BookMyWorker</span>. All Rights Reserved
          </p>

          <div className="flex items-center gap-6">
            <Link href="https://www.facebook.com/BookMyWorker" target="_blank">
              <Icon icon="ri:facebook-fill" className="text-xl hover:text-primary" />
            </Link>

            <Link href="https://www.instagram.com/bookmyworker/" target="_blank">
              <Icon icon="mdi:instagram" className="text-xl hover:text-primary" />
            </Link>

            <Link href="https://www.linkedin.com/company/bookmyworker" target="_blank">
              <Icon icon="ri:linkedin-fill" className="text-xl hover:text-primary" />
            </Link>

            <Link href="https://twitter.com" target="_blank">
              <Icon icon="line-md:twitter-x-alt" className="text-xl hover:text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;