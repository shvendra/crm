import { HeaderItem } from "@/types/menu";

export const headerData: HeaderItem[] = [
  { label: "Home", href: "/" },
    {
    label: "AboutUs",
    href: "/about",
  },
  // {
  //   label: "Causes",
  //   href: "#",
  //   submenu: [
  //     { label: "Cause list", href: "/cause" },
  //     { label: "Cause details", href: "/cause/cause-1" },
  //   ],
  // },
  // {
  //   label: "Services",
  //   href: "#",
  //   submenu: [
  //     { label: "Services list", href: "/events" },
  //     { label: "Services details", href: "/events/event-1" },
  //   ],
  // },
    {
    label: "Blog",
    href: "/blog",
    // submenu: [
    //   { label: "Blog list", href: "/blog" },
    //   { label: "Blog details", href: "/blog/blog_1" },
    // ],
  },
  {
    label: "Suppliers/SelfWorkers",
    href: "#",
    submenu: [
      { label: "Install Project Search App", href: "https://play.google.com/store/apps/details?id=com.app.myworker&pcampaignid=web_share" },
      // { label: "Find Work by Category", href: "/blog/blog_1" },
    ],
  },
  {
    label: "Employers",
    href: "#",
    submenu: [
      { label: "Start Hiring", href: "https://www.bookmyworkers.com/register" },
      // { label: "Install Recruiter App", href: "/blog/blog_1" },
            { label: "Pricing Plans", href: "/pricing" },
      { label: "Refund Policy", href: "/refund" },
            // { label: "FAQ", href: "/efaq" },


    ],
  },
  { label: "Contact", href: "/contact" },
];
