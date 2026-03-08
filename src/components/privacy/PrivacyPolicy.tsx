import React from "react";

const privacySections = [
  {
    title: "Information We Collect",
    content:
      "At BookMyWorker, we may collect personal and business-related information when you use our website or platform. This may include your name, mobile number, email address, Aadhaar details, PAN details, bank information, business details, job requirements, profile data, and other information shared during registration or platform usage. This information helps us create accounts, verify users, and support workforce connections across the platform.",
  },
  {
    title: "How We Use Your Information",
    content:
      "The information collected is used to connect employers, suppliers, contractors, and workers more effectively. It helps us manage user accounts, process onboarding, improve platform performance, facilitate communication, provide support, and strengthen the overall hiring and workforce discovery experience. We may also use certain information for operational analysis, fraud prevention, compliance, and service improvement.",
  },
  {
    title: "Sharing of Information",
    content:
      "BookMyWorker only shares information when it is necessary for platform operations and service delivery. This may include sharing relevant details with employers, suppliers, workers, service agents, or legal authorities where required. We do not sell personal data to third parties. Data sharing is limited to legitimate business, support, verification, and legal purposes.",
  },
  {
    title: "Data Security",
    content:
      "We take reasonable administrative, technical, and operational measures to protect the information stored on our platform. While we make every effort to secure user data, no online platform or digital transmission method can be guaranteed to be completely secure. Users are encouraged to keep their login credentials confidential and report any suspicious activity immediately.",
  },
  {
    title: "Cookies & Platform Usage Data",
    content:
      "BookMyWorker may use cookies, session tools, and related technologies to improve user experience, understand traffic patterns, remember preferences, and enhance platform performance. Users can modify cookie preferences through their browser settings, although disabling cookies may impact certain platform features and functionality.",
  },
  {
    title: "Third-Party Links",
    content:
      "Our website or platform may include links to third-party websites, services, or external resources for convenience or informational purposes. BookMyWorker is not responsible for the privacy practices, data handling methods, or content of those third-party platforms. Users are advised to review the privacy policies of such external websites independently.",
  },
  {
    title: "User Rights",
    content:
      "Users may request access to their information, correction of inaccurate records, or deletion of data where applicable under platform policies and legal requirements. Certain records may be retained where necessary for compliance, dispute handling, fraud prevention, or operational continuity. Requests may be reviewed before any action is taken.",
  },
  {
    title: "Policy Updates",
    content:
      "BookMyWorker may update or revise this Privacy Policy from time to time to reflect changes in platform functionality, legal requirements, or business practices. Continued use of the website or platform after any update means that the user accepts the revised policy. Users are encouraged to review this page periodically for the latest information.",
  },
];

const PrivacyPolicySection: React.FC = () => {
  return (
    <section
      id="privacy"
      className="bg-gradient-to-b from-slate-50 to-white py-16 lg:py-24"
    >
      <div className="container mx-auto max-w-[1100px] px-4">
        <div className="mx-auto mb-12 max-w-[850px] text-center">
          <span className="mb-4 inline-block rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
            Privacy Policy
          </span>

          <h1 className="mb-5 text-3xl font-bold leading-tight text-midnight_text md:text-5xl">
            Your Privacy Matters at BookMyWorker
          </h1>

          <p className="text-base leading-8 text-gray-600 md:text-lg">
            This Privacy Policy explains how BookMyWorker collects, uses,
            stores, and protects user information when you access our website,
            app, or services. We are committed to maintaining transparency and
            safeguarding your data responsibly.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
          <div className="border-b border-gray-100 bg-gradient-to-r from-midnight_text to-slate-800 px-6 py-8 md:px-10">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Privacy & Data Protection
            </h2>
            <p className="mt-3 max-w-[800px] text-sm leading-7 text-white/80 md:text-base">
              We value trust, transparency, and responsible data handling for
              every employer, supplier, contractor, and worker using the
              BookMyWorker platform.
            </p>
          </div>

          <div className="px-6 py-8 md:px-10 md:py-10">
            <div className="space-y-8">
              {privacySections.map((section, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-100 bg-slate-50/70 p-5 md:p-6"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
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
                <span className="font-bold">Important Note:</span> By using the
                BookMyWorker platform, website, or services, you agree to the
                collection and use of information in accordance with this
                Privacy Policy. Platform usage after policy updates will be
                treated as acceptance of the revised terms.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-blue-50 px-5 py-5 md:px-6">
              <h4 className="mb-2 text-lg font-semibold text-blue-900">
                Contact Us
              </h4>
              <p className="text-sm leading-7 text-blue-800 md:text-base">
                If you have any questions about this Privacy Policy or want to
                request access, correction, or deletion of your information,
                please contact us at{" "}
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

export default PrivacyPolicySection;