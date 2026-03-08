import React from "react";
import Image from "next/image";
const features = [
  "Verified Skilled & Unskilled Workforce",
  "Extensive Workforce Network",
  "Fast & Hassle-Free Hiring",
  "Trusted by Businesses & Individuals",
  "Transparent & Efficient Process",
  "Empowering Workers, Supporting Growth",
];

const AboutUs: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-dark">
      <div className="container mx-auto max-w-[1200px] px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left Image */}
          <div className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-md">
            <Image
              src="/images/about/about-us.jpg"
              alt="About BookMyWorker"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Right Content */}
          <div>
          

            <div className="space-y-6 text-gray-600 leading-8">
  <p>
    <span className="font-semibold text-gray-400">BookMyWorker</span>{" "}
    is a digital platform designed to connect employers with skilled,
    semi-skilled, and unskilled workers across India. Instead of acting as a
    manpower supplier, we provide a transparent marketplace where employers can
    easily discover and hire workforce providers and workers near their
    location.
  </p>

  <p>
    Our platform simplifies the process of finding reliable manpower. Employers
    can post their requirements, explore available workers or service agents in
    nearby areas, and choose the most suitable workforce based on their needs.
    This helps businesses save time, reduce hiring effort, and access manpower
    quickly.
  </p>

  <p>
    For workforce suppliers and service agents, BookMyWorker provides an
    opportunity to connect with businesses that require manpower. Suppliers can
    showcase their available workers, receive job requests, and grow their
    network by working with multiple employers across industries.
  </p>

  <p>
    We also empower workers by helping them access more employment
    opportunities. Through our platform, workers can connect with verified
    suppliers and employers, enabling them to find consistent work and improve
    their livelihood.
  </p>

  <p>
    BookMyWorker is built to create a trusted ecosystem where employers,
    suppliers, and workers can collaborate efficiently. By bridging the gap
    between demand and supply, we aim to make manpower hiring faster,
    transparent, and accessible for everyone.
  </p>
</div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {features.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-gray-100 px-4 py-4 rounded-lg text-gray-700 font-medium"
                >
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-sm rounded-full">
                    ✓
                  </span>
                  {item}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;