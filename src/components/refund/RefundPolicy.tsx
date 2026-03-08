import React from "react";

const refundSections = [
  {
    title: "Subscription & Payment Policy",
    content:
      "BookMyWorker offers subscription-based access to its platform for employers, companies, contractors, suppliers, and other users. Subscription charges shown on the platform are starting prices only and may vary depending on user type, service requirements, support level, and business category.",
  },
  {
    title: "Refund Eligibility",
    content:
      "Once a subscription plan is activated, the amount paid is generally non-refundable. However, refund requests may be reviewed in exceptional situations such as duplicate payments, technical errors, or unsuccessful payment deductions without service activation.",
  },
  {
    title: "Non-Refundable Cases",
    content:
      "Refunds will not be applicable in cases where the user has already availed platform access, used subscription benefits, changed their mind after purchase, or failed to use the subscription during the active period. BookMyWorker does not guarantee refunds for business performance, hiring results, or role-specific expectations.",
  },
  {
    title: "Refund Review Process",
    content:
      "If a user believes a refund is applicable, they may contact BookMyWorker support with complete transaction details. Each request will be reviewed internally, and the final decision will be made based on payment records, platform usage, and the nature of the issue reported.",
  },
  {
    title: "Processing Time",
    content:
      "If a refund is approved, the amount will be processed through the original payment method. Refund timelines may vary depending on the payment gateway, bank processing cycle, and financial institution policies. Users are advised to allow reasonable time for the credited amount to reflect.",
  },
  {
    title: "Plan Changes & Pricing Flexibility",
    content:
      "BookMyWorker reserves the right to modify subscription pricing, features, support structure, and access benefits at any time without prior notice. Pricing and refund decisions may vary depending on the category of user, service type, business requirements, and custom commercial discussions.",
  },
  {
    title: "Contact for Refund Queries",
    content:
      "For any refund-related questions, billing concerns, or payment issues, users can contact the BookMyWorker support team. Our team will review the concern and provide appropriate assistance based on the applicable policy and transaction details.",
  },
];

const RefundPolicy: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-16 lg:py-24">
      <div className="container mx-auto max-w-[1100px] px-4">
        <div className="mx-auto mb-12 max-w-[850px] text-center">
          <span className="mb-4 inline-block rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
            Refund Policy
          </span>

          <h1 className="mb-5 text-3xl font-bold leading-tight text-midnight_text md:text-5xl">
            BookMyWorker Refund Policy
          </h1>

          <p className="text-base leading-8 text-gray-600 md:text-lg">
            This Refund Policy explains how subscription payments, refund
            requests, and billing-related concerns are handled on the
            BookMyWorker platform. Please read this policy carefully before
            purchasing any plan or service.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
          <div className="border-b border-gray-100 bg-gradient-to-r from-midnight_text to-slate-800 px-6 py-8 md:px-10">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Transparent & Fair Refund Guidelines
            </h2>
            <p className="mt-3 max-w-[800px] text-sm leading-7 text-white/80 md:text-base">
              Our goal is to maintain transparency in subscription access,
              payment handling, and support services for all users of the
              BookMyWorker platform.
            </p>
          </div>

          <div className="px-6 py-8 md:px-10 md:py-10">
            <div className="space-y-8">
              {refundSections.map((section, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-100 bg-slate-50/70 p-5 md:p-6"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-midnight_text md:text-xl">
                      {section.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-7 text-gray-700 md:text-base">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-5 md:px-6">
              <p className="text-sm font-medium leading-7 text-amber-900 md:text-base">
                <span className="font-bold">Important Note:</span> Refund
                approval, subscription pricing, service access, and support
                structure may vary depending on the user role, business type,
                category, and specific commercial terms agreed with
                BookMyWorker. Submission of a refund request does not guarantee
                refund approval.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-blue-50 px-5 py-5 md:px-6">
              <h4 className="mb-2 text-lg font-semibold text-blue-900">
                Need Help?
              </h4>
              <p className="text-sm leading-7 text-blue-800 md:text-base">
                For payment support or refund-related questions, please contact
                the BookMyWorker support team at{" "}
                <span className="font-semibold">support@bookmyworkers.com</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RefundPolicy;