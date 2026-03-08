import React from "react";
import Link from "next/link";
const plans = [
  {
    name: "Monthly Plan",
    duration: "1 Month Access",
    originalPrice: "₹149",
    discount: "30% OFF",
    price: "₹99",
    highlight: false,
    description:
      "Ideal for employers, contractors, and businesses looking for quick access to BookMyWorker’s workforce network.",
    features: [
      "Access to 5 Lakh+ skilled & unskilled workers",
      "Suitable for Employers, Companies & Contractors",
      "Connect with workers near your location",
      "Basic support from BookMyWorker team",
      "Easy workforce discovery and hiring assistance",
    ],
  },
  {
    name: "Half-Yearly Plan",
    duration: "6 Months Access",
    originalPrice: "₹799",
    discount: "38% OFF",
    price: "₹499",
    highlight: true,
    description:
      "Best value for growing businesses that need regular manpower support and wider workforce reach.",
    features: [
      "Access to 5 Lakh+ skilled & unskilled workers",
      "Priority access for workforce requirements",
      "Suitable for Employers, Companies & Contractors",
      "Support from BookMyWorker team",
      "Better value for repeated hiring needs",
    ],
  },
  {
    name: "Yearly Plan",
    duration: "12 Months Access",
    originalPrice: "₹1499",
    discount: "33% OFF",
    price: "₹999",
    highlight: false,
    description:
      "Perfect for businesses with continuous manpower requirements and long-term workforce planning.",
    features: [
      "Access to 5 Lakh+ skilled & unskilled workers",
      "Long-term workforce hiring convenience",
      "Suitable for Employers, Companies & Contractors",
      "Dedicated support from BookMyWorker side",
      "Most cost-effective yearly access plan",
    ],
  },
];

const PricingPlan: React.FC = () => {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto max-w-[1280px] px-4">
        <div className="mx-auto mb-14 max-w-[850px] text-center">
          <span className="mb-4 inline-block rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
            Flexible Pricing Plans
          </span>

          <h2 className="mb-5 text-3xl font-bold leading-tight text-midnight_text md:text-5xl">
            Choose the Right BookMyWorker Plan for Your Hiring Needs
          </h2>

          <p className="text-base leading-8 text-gray-600 md:text-lg">
            Get access to <span className="font-semibold text-midnight_text">5 Lakh+ skilled and unskilled workers</span>{" "}
            across India. Whether you are an employer, company, or contractor,
            BookMyWorker helps you discover workforce faster with support from our team.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                plan.highlight
                  ? "border-blue-600 bg-gradient-to-b from-blue-50 to-white"
                  : "border-gray-200 bg-white"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="mb-2 text-2xl font-bold text-midnight_text">
                  {plan.name}
                </h3>
                <p className="text-sm font-medium text-gray-500">
                  {plan.duration}
                </p>
              </div>

              <div className="mb-6">
                <div className="mb-2 flex items-center gap-3">
                  <span className="text-lg font-medium text-gray-400 line-through">
                    {plan.originalPrice}
                  </span>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {plan.discount}
                  </span>
                </div>

                <div className="flex items-end gap-2">
                  <span className="text-4xl font-extrabold text-midnight_text">
                    {plan.price}
                  </span>
                  <span className="mb-1 text-sm font-medium text-gray-500">
                    starting from
                  </span>
                </div>
              </div>

              <p className="mb-6 text-sm leading-7 text-gray-600">
                {plan.description}
              </p>

              <div className="mb-8 space-y-3">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-sm text-white">
                      ✓
                    </span>
                    <p className="text-sm leading-6 text-gray-700">{feature}</p>
                  </div>
                ))}
              </div>

             <Link
  href="https://www.bookmyworkers.com/register"
  target="_blank"
  rel="noopener noreferrer"
  className={`block w-full rounded-lg px-6 py-4 text-center text-sm font-semibold transition-all duration-300 ${
    plan.highlight
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-midnight_text text-white hover:bg-blue-600"
  }`}
>
  Get Started
</Link>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-[1000px] rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 text-center">
          <p className="text-sm font-medium leading-7 text-amber-800 md:text-base">
            <span className="font-bold">Note:</span> Prices shown above are introductory
            starting prices only. Final pricing may change depending on the
            user type, role, requirement size, support level, and business category.
            BookMyWorker reserves the right to customize subscription plans based on employer,
            contractor, company, or supplier needs.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingPlan;