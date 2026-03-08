"use client";

import React, { useState } from "react";
import Image from "next/image";

type FormDataType = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

const ContactForm = () => {
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/email/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data?.success) {
        setSuccess("Your message has been sent successfully. Our team will contact you soon.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        setError("Failed to send your message. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong while sending your message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-b from-white to-slate-50 py-16 lg:py-24 dark:from-dark dark:to-dark">
      <div className="container mx-auto max-w-[1280px] px-4">
        <div className="mx-auto mb-12 max-w-[820px] text-center">
          <span className="mb-4 inline-block rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-primary">
            Contact BookMyWorker
          </span>

          <h2 className="mb-4 text-3xl font-bold leading-tight text-midnight_text dark:text-white md:text-5xl">
            Let’s Connect for Your Workforce Needs
          </h2>

          <p className="text-base leading-8 text-muted dark:text-white/70 md:text-lg">
            Share your hiring requirement, workforce need, or business query with us.
            Our team will help you with the right solution as quickly as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* Left Info */}
          <div className="lg:col-span-5">
            <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)] dark:border-dark_border dark:bg-darkmode md:p-8">
              <div className="relative mb-8 h-[260px] w-full overflow-hidden rounded-2xl">
                <Image
                  src="/images/contact-page/contact.jpg"
                  alt="Contact BookMyWorker"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <h3 className="mb-4 text-2xl font-bold text-midnight_text dark:text-white">
                Get in Touch
              </h3>

              <p className="mb-8 text-sm leading-7 text-muted dark:text-white/70">
                Whether you are an employer, contractor, company, or workforce supplier,
                BookMyWorker is here to support your hiring journey with speed,
                transparency, and reliability.
              </p>

              <div className="space-y-5">
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-dark">
                  <p className="mb-1 text-sm font-semibold text-midnight_text dark:text-white">
                    Office Address
                  </p>
                  <p className="text-sm leading-6 text-muted dark:text-white/70">
                    KHASARA NO 34/1/33, Karahiya, Rewa, Madhya Pradesh 486001, India
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-dark">
                  <p className="mb-1 text-sm font-semibold text-midnight_text dark:text-white">
                    Phone Number
                  </p>
                  <a
                    href="tel:+917389791873"
                    className="text-sm text-primary hover:underline"
                  >
                    +91 7389791873
                  </a>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-dark">
                  <p className="mb-1 text-sm font-semibold text-midnight_text dark:text-white">
                    Email Address
                  </p>
                  <div className="flex flex-col gap-1">
                    <a
                      href="mailto:support@bookmyworkers.com"
                      className="text-sm text-primary hover:underline"
                    >
                      support@bookmyworkers.com
                    </a>
                    <a
                      href="mailto:business@bookmyworkers.com"
                      className="text-sm text-primary hover:underline"
                    >
                      business@bookmyworkers.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)] dark:border-dark_border dark:bg-darkmode md:p-8">
              <div className="mb-8">
                <h3 className="mb-2 text-2xl font-bold text-midnight_text dark:text-white">
                  Send Us a Message
                </h3>
                <p className="text-sm leading-7 text-muted dark:text-white/70">
                  Fill in the form below and our team will get back to you with the right assistance.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 inline-block text-sm font-medium text-midnight_text dark:text-white"
                    >
                      Your Name*
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-midnight_text outline-none transition focus:border-primary dark:border-dark_border dark:bg-dark dark:text-white"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 inline-block text-sm font-medium text-midnight_text dark:text-white"
                    >
                      Email Address*
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-midnight_text outline-none transition focus:border-primary dark:border-dark_border dark:bg-dark dark:text-white"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 inline-block text-sm font-medium text-midnight_text dark:text-white"
                    >
                      Phone Number*
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-midnight_text outline-none transition focus:border-primary dark:border-dark_border dark:bg-dark dark:text-white"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-2 inline-block text-sm font-medium text-midnight_text dark:text-white"
                    >
                      Subject*
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-midnight_text outline-none transition focus:border-primary dark:border-dark_border dark:bg-dark dark:text-white"
                      placeholder="Enter subject"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 inline-block text-sm font-medium text-midnight_text dark:text-white"
                  >
                    Message*
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-midnight_text outline-none transition focus:border-primary dark:border-dark_border dark:bg-dark dark:text-white"
                    placeholder="Write your query or requirement here..."
                  />
                </div>

                {success && (
                  <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {success}
                  </div>
                )}

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-linear-to-r from-primary to-secondary px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;