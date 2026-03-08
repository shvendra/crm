"use client"

import DonationFormContext from "@/app/context/donationContext";
import { useContext } from "react";

const Volunteer = () => {
    const donationInfo = useContext(DonationFormContext);
    return (
     <section className="relative lg:py-28 py-16 bg-[url('/images/background/volunteer-bg.jpg')] bg-no-repeat bg-cover bg-center overflow-hidden">
  
  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/50"></div>

  <div className="relative container mx-auto lg:max-w-(--breakpoint-xl) px-4">
    <div className="text-center">
      
      <h2 className="text-3xl md:text-4xl font-medium text-white mb-6">
        Become a Manpower Supplier
      </h2>

      <p className="text-base text-white lg:max-w-[60%] mx-auto mb-6">
        Partner with our platform as a manpower supplier and connect your workers
        with employers across construction sites, factories, farms, warehouses,
        and household services. Expand your network and get consistent work
        opportunities through our platform.
      </p>

      <div className="flex justify-center">
  <a
    href="https://play.google.com/store/apps/details?id=com.app.myworker&pcampaignid=web_share"
    target="_blank"
    rel="noopener noreferrer"
    className="text-white rounded-md bg-linear-to-r text-sm font-semibold from-error to-warning px-7 py-4 hover:from-transparent hover:to-transparent border border-transparent hover:border-error hover:text-error transition-all duration-300"
  >
    Download App & Register as Supplier
  </a>
</div>

    </div>
  </div>
</section>
    )
}

export default Volunteer;