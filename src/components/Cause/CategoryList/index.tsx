"use client"

import { WorkerCategoryData } from "@/app/api/data"
import Image from "next/image"
import Slider from "react-slick"

import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const WorkerCategories = () => {

  const settings = {
    autoplay: true,
    dots: true,
    arrows: false,
    infinite: true,
    speed: 400,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          autoplay: true,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  return (
    <section className="lg:py-28 py-16 bg-grey dark:bg-darkmode">
      <div className="container mx-auto lg:max-w-(--breakpoint-xl) px-4">

        {/* Section Title */}
        <h2 className="text-center text-3xl font-medium mb-3">
          Workers Available for These Categories
        </h2>

        <p className="text-base text-muted dark:text-white/60 text-center">
          BookMyWorker connects employers with skilled, semi-skilled, and unskilled workers across 30+ job categories. Easily hire workers for construction, factories, farms, household services, and more—quickly, reliably, and without middlemen.
        </p>

        {/* Slider */}
        <div className="mt-20">
          <Slider {...settings}>

            {WorkerCategoryData.map((item, index) => (

              <div key={index} className="px-4">

                <div className="bg-white group dark:bg-dark rounded-4 overflow-hidden">

                  {/* Image */}
                  <div className="overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={350}
                      height={250}
                      className="w-full h-auto group-hover:scale-110 duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="px-8 pt-8 pb-6 shadow-cause-shadow dark:shadow-darkmd">

                    <h4 className="text-lg font-bold dark:text-white group-hover:text-primary mb-4">
                      {item.title}
                    </h4>

                    <p className="text-muted dark:text-white/60 text-base pb-6 border-b border-border">
                      {item.text}
                    </p>

                    {/* Button */}
                    <div className="mt-6">
                      <button className="bg-primary text-white px-5 py-2 rounded-lg text-sm hover:bg-secondary transition">
                        Hire Workers
                      </button>
                    </div>

                  </div>

                </div>

              </div>

            ))}

          </Slider>
        </div>

      </div>
    </section>
  )
}

export default WorkerCategories