// frontend-user/src/components/account-hub/Terms.js

"use client";

export default function Terms() {
  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-gray-100
                    text-[10px] sm:text-sm leading-relaxed animate-fadeIn">

      {/* HEADER */}
      <h2 className="text-[14px] sm:text-2xl font-bold text-gray-800 mb-1">
        Terms & Conditions
      </h2>

      <p className="text-[9px] sm:text-sm text-gray-500 mb-4">
        Last Updated: December 2025
      </p>

      {/* SCROLLABLE CONTENT */}
      <div className="max-w-none h-[520px] sm:h-[620px] overflow-y-auto pr-2 sm:pr-4
                      custom-scrollbar text-gray-700 space-y-4">

        {/* 1 */}
        <section>
          <h3 className="text-[12px] sm:text-lg font-bold text-gray-800">
            1. Introduction
          </h3>
          <p>
            Welcome to <strong>Satya&apos;s Fashion Book</strong>. By accessing or using
            our website and services, you agree to be bound by these Terms & Conditions.
            If you do not agree, please do not use the platform.
          </p>
        </section>

        {/* 2 */}
        <section>
          <h3 className="text-[12px] sm:text-lg font-bold text-gray-800">
            2. Account Registration
          </h3>
          <p>
            To place orders, you must create an account with accurate information.
            You are responsible for maintaining the confidentiality of your login
            credentials and all activities performed under your account.
          </p>
        </section>

        {/* 3 */}
        <section>
          <h3 className="text-[12px] sm:text-lg font-bold text-gray-800">
            3. User Responsibilities
          </h3>
          <ul className="list-disc pl-4 space-y-1">
            <li>Do not misuse the platform or attempt unauthorized access.</li>
            <li>Do not submit false orders or fake cancellation requests.</li>
            <li>Respect store policies and customer support decisions.</li>
          </ul>
        </section>

        {/* 4 */}
        <section>
          <h3 className="text-[12px] sm:text-lg font-bold text-gray-800">
            4. Product Information
          </h3>
          <p>
            We strive to display accurate product descriptions and images. However,
            colors and details may vary slightly due to device display settings.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h3 className="text-[12px] sm:text-lg font-bold text-gray-800">
            5. Pricing & Payments
          </h3>
          <p>
            All prices are listed in INR and include applicable taxes unless stated.
            Prices may change without prior notice. Currently, we support
            <strong> Cash on Delivery (COD)</strong>.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h3 className="text-[12px] sm:text-lg font-bold text-gray-800">
            6. Shipping & Delivery
          </h3>
          <p>
            Delivery timelines are estimates and may vary due to logistics,
            weather conditions, or regional restrictions. Ownership of products
            transfers once handed over to the courier partner.
          </p>
        </section>

        {/* 7 */}
        <section>
          <h3 className="text-[12px] sm:text-lg font-bold text-gray-800">
            7. Cancellations, Returns & Refunds
          </h3>
          <ul className="list-disc pl-4 space-y-1">
            <li>Instant cancellation for <strong>Pending</strong> orders.</li>
            <li>Admin approval required for <strong>Processing</strong> orders.</li>
            <li>No cancellation once an order is <strong>Shipped</strong>.</li>
            <li>Returns accepted only for damaged or incorrect items.</li>
          </ul>
        </section>

        {/* 8 */}
        <section>
          <h3 className="text-[12px] sm:text-lg font-bold text-gray-800">
            8. Account Suspension
          </h3>
          <p>
            We reserve the right to suspend or terminate accounts that violate
            policies, misuse services, or engage in fraudulent activity.
          </p>
        </section>

        {/* 9 */}
        <section>
          <h3 className="text-[12px] sm:text-lg font-bold text-gray-800">
            9. Limitation of Liability
          </h3>
          <p>
            Satya&apos;s Fashion Book shall not be liable for indirect, incidental,
            or consequential damages arising from the use of this platform.
          </p>
        </section>

        {/* 10 */}
        <section>
          <h3 className="text-[12px] sm:text-lg font-bold text-gray-800">
            10. Force Majeure
          </h3>
          <p>
            We are not responsible for delays or failures caused by events beyond
            our reasonable control, including natural disasters, strikes, or
            government actions.
          </p>
        </section>

        {/* 11 */}
        <section>
          <h3 className="text-[12px] sm:text-lg font-bold text-gray-800">
            11. Changes to Terms
          </h3>
          <p>
            These terms may be updated periodically. Continued use of the website
            indicates acceptance of the revised terms.
          </p>
        </section>

        {/* 12 */}
        <section>
          <h3 className="text-[12px] sm:text-lg font-bold text-gray-800">
            12. Governing Law
          </h3>
          <p>
            These terms are governed by Indian law. Any disputes shall be subject
            to the jurisdiction of courts in Rajahmundry, Andhra Pradesh.
          </p>
        </section>

        {/* 13 */}
        <section>
          <h3 className="text-[12px] sm:text-lg font-bold text-gray-800">
            13. Contact Information
          </h3>
          <p>
            <strong>Ravi Boddapati</strong><br />
            Phone: 9010076453<br />
            Tadithota Jeevan Junction, Rajahmundry
          </p>
        </section>

        <div className="h-6"></div>
      </div>
    </div>
  );
}
