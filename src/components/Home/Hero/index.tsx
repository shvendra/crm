"use client";

import { useContext } from "react";
import Slider from "react-slick";
import DonationFormContext from "@/app/context/donationContext";
import { heroSliderSettings, heroHeadlines, heroBgImages } from "../../data/heroSlider";

const Hero = () => {
  const donationInfo = useContext(DonationFormContext);

  return (
<section className="relative text-white h-[700px] lg:mt-40 sm:mt-44 mt-20 overflow-hidden flex items-center">
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        <Slider {...heroSliderSettings}>
          {heroBgImages.map((img, index) => (
            <div key={index}>
              <div
                className="h-[700px] w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${img})` }}
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      {/* Content */}
      <div className="relative z-20 container mx-auto lg:max-w-(--breakpoint-xl) px-4 grid grid-cols-12">

        <div className="bg-white rounded-md p-10 lg:col-span-5 md:col-span-7 sm:col-span-10 col-span-12 dark:bg-dark">

          {/* Headline Slider */}
          <div className="mb-4">
            <Slider {...heroSliderSettings}>
              {heroHeadlines.map((text, i) => (
                <h1
                  key={i}
                  className="text-midnight_text dark:text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
                >
                  {text}
                </h1>
              ))}
            </Slider>
          </div>

          <p className="text-muted dark:text-white/60 text-sm mb-6">
            BookMyWorker is a digital platform where workers, manpower suppliers,
            and employers connect in one place.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 border-t border-border dark:border-dark_border mb-6">

            <div className="text-center px-3 py-4 border-r border-border">
              <p className="text-xs text-muted mb-1">👨‍💼 Employers Served</p>
              <h4 className="text-xl font-bold text-secondary">8k+</h4>
            </div>

            <div className="text-center px-3 py-4 border-r border-border">
              <p className="text-xs text-muted mb-1">🧑‍🏭 Workers Available</p>
              <h4 className="text-xl font-bold text-secondary">4.5L+</h4>
            </div>

            <div className="text-center px-3 py-4">
              <p className="text-xs text-muted mb-1">🏢 Suppliers Network</p>
              <h4 className="text-xl font-bold text-secondary">10K+</h4>
            </div>

          </div>

          {/* CTA */}
          <div className="flex justify-center">
            <button
              onClick={() =>
                window.open("https://www.bookmyworkers.com/register", "_blank")
              }
              className="text-white bg-linear-to-r text-sm from-error to-warning px-7 py-4 border font-semibold rounded-md"
            >
              Get Workers Instantly
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;