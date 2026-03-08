import React from "react";

const termsSections = [
  {
    title: "Registration and Account Use",
    content: [
      "Employers must provide accurate and complete details during registration.",
      "Only authorized persons should use the employer account.",
      "BookMyWorker reserves the right to approve, suspend, or terminate any account if found violating platform terms or policies.",
    ],
  },
  {
    title: "Job Posting and Worker Hiring",
    content: [
      "Employers can post job requirements and request skilled or unskilled workers as per their needs.",
      "Job details including work type, timing, payment, and location must be clear, honest, and lawful.",
      "Worker assignments will be made through registered and verified Worker Service Agents.",
    ],
  },
  {
    title: "Payment and Charges",
    content: [
      "Employers must pay workers’ wages on time, as agreed before work begins.",
      "Any platform fee or service agent charges must be paid as communicated before hiring.",
      "Delayed payment or non-payment may lead to account suspension, service restriction, or legal action.",
    ],
  },
  {
    title: "Work Environment and Conduct",
    content: [
      "Employers must provide safe, legal, and respectful working conditions.",
      "Employers must provide basic facilities required for the type of work, wherever applicable.",
      "Harassment, abuse, exploitation, or discrimination against workers is strictly prohibited.",
    ],
  },
  {
    title: "Cooperation with Worker Service Agents",
    content: [
      "Employers must coordinate with assigned service agents for worker selection, onboarding, and issue resolution.",
      "Any concerns related to workers should first be communicated to the assigned Worker Service Agent.",
    ],
  },
  {
    title: "Cancellations and Job Changes",
    content: [
      "If a job needs to be cancelled or changed, employers must notify the service agent at the earliest possible stage.",
      "A valid reason for cancellation or change should be provided.",
      "Repeated, unfair, or last-minute cancellations may result in platform restrictions.",
      "All services are non-refundable.",
    ],
  },
  {
    title: "Responsibility and Liability",
    content: [
      "BookMyWorker acts only as a connecting platform and does not act as the direct employer of workers.",
      "BookMyWorker is not liable for work performance issues, financial loss, or injury during the course of work.",
      "In case of disputes between employers and workers, BookMyWorker may assist in communication and resolution, but final liability remains with the involved parties.",
    ],
  },
  {
    title: "Data Privacy",
    content: [
      "Employer information will be treated as confidential and used only for service-related, operational, and compliance purposes.",
      "Employers are also responsible for protecting and maintaining the privacy of workers’ information accessed through the platform.",
    ],
  },
  {
    title: "Termination or Suspension",
    content: [
      "Employer accounts may be suspended, restricted, or permanently removed for violating platform policies.",
      "This includes non-payment, misuse of services, fraud, false information, or unsafe and unethical treatment of workers.",
    ],
  },
  {
    title: "Legal Compliance",
    content: [
      "Employers agree to comply with all applicable labour laws, wage obligations, safety standards, and local employment regulations.",
      "Any dispute or legal matter related to platform usage shall be subject to the jurisdiction of Rewa, Madhya Pradesh.",
    ],
  },
  {
    title: "Updates to Terms",
    content: [
      "BookMyWorker may update or revise these Terms and Conditions at any time.",
      "Employers will be informed of major updates where applicable, and continued use of the platform shall be treated as acceptance of the revised terms.",
    ],
  },
];

const TermsAndConditionsSection: React.FC = () => {
  return (
    <section
      id="terms"
      className="bg-gradient-to-b from-slate-50 to-white py-16 lg:py-24"
    >
      <div className="container mx-auto max-w-[1100px] px-4">
        <div className="mx-auto mb-12 max-w-[900px] text-center">
          <span className="mb-4 inline-block rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
            Terms & Conditions
          </span>

          <h1 className="mb-5 text-3xl font-bold leading-tight text-midnight_text md:text-5xl">
            BookMyWorker Terms & Conditions
          </h1>

          <p className="text-base leading-8 text-gray-600 md:text-lg">
            These terms apply to all employers who register on BookMyWorker to
            hire skilled or unskilled workers through verified Worker Service
            Agents. By registering and using the platform, you agree to comply
            with the terms mentioned below.
          </p>

          <div className="mt-6 inline-flex rounded-full border border-blue-100 bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-sm">
            <span className="font-semibold text-midnight_text">
              Effective Date:
            </span>
            <span className="ml-2">01-05-2025</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
          <div className="border-b border-gray-100 bg-gradient-to-r from-midnight_text to-slate-800 px-6 py-8 md:px-10">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Platform Terms for Employers
            </h2>
            <p className="mt-3 max-w-[850px] text-sm leading-7 text-white/80 md:text-base">
              These conditions are intended to maintain transparency, fair
              business conduct, worker safety, and proper use of the
              BookMyWorker platform by employers, companies, and contractors.
            </p>
          </div>

          <div className="px-6 py-8 md:px-10 md:py-10">
            <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-5 md:px-6">
              <p className="text-sm leading-7 text-blue-900 md:text-base">
                <span className="font-bold">Platform:</span> BookMyWorker
                <br />
                <span className="font-bold">Managed By:</span> BookMyWorker
              </p>
            </div>

            <div className="space-y-8">
              {termsSections.map((section, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-100 bg-slate-50/70 p-5 md:p-6"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-midnight_text md:text-xl">
                      {section.title}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {section.content.map((point, pointIndex) => (
                      <div key={pointIndex} className="flex items-start gap-3">
                        <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-sm text-white">
                          ✓
                        </span>
                        <p className="text-sm leading-7 text-gray-700 md:text-base">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-5 md:px-6">
              <p className="text-sm font-medium leading-7 text-amber-900 md:text-base">
                <span className="font-bold">Important Notice:</span> By using
                BookMyWorker, employers confirm that they understand and accept
                these Terms & Conditions. Non-compliance with platform policies
                may lead to restriction, suspension, or permanent removal of
                access.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-blue-50 px-5 py-5 md:px-6">
              <h4 className="mb-2 text-lg font-semibold text-blue-900">
                Support & Queries
              </h4>
              <p className="text-sm leading-7 text-blue-800 md:text-base">
                For any questions related to these Terms & Conditions, please
                contact the BookMyWorker support team at{" "}
                <span className="font-semibold">
                  support@bookmyworkers.com
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsAndConditionsSection;