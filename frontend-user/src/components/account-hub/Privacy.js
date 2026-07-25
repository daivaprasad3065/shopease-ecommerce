// frontend-user/src/components/account-hub/Privacy.js

"use client";

export default function Privacy() {
  return (
    <div className="bg-white p-3 sm:p-5 md:p-6 rounded-lg shadow-sm border border-gray-100
                    text-[10px] sm:text-sm animate-fadeIn leading-relaxed">

      {/* TITLE */}
      <h2 className="text-[14px] sm:text-xl md:text-2xl font-bold text-gray-800 mb-4">
        Privacy & Cookies Policy
      </h2>

      {/* INTRO */}
      <p className="text-gray-600 mb-4">
        We value your privacy and are committed to protecting your personal information.
        This policy explains how your data is collected, used, and safeguarded.
      </p>

      {/* DATA COLLECTION */}
      <section className="mb-5">
        <h3 className="font-bold text-gray-900 mb-2">🔐 Information We Collect</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Name, email, phone number, and delivery address</li>
          <li>Order history and payment transaction details</li>
          <li>Device and browser data for security and analytics</li>
        </ul>
      </section>

      {/* DATA USAGE */}
      <section className="mb-5">
        <h3 className="font-bold text-gray-900 mb-2">📊 How We Use Your Data</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>To process orders and deliver products</li>
          <li>To provide customer support and order updates</li>
          <li>To improve website performance and user experience</li>
        </ul>
      </section>

      {/* COOKIES */}
      <section className="mb-5">
        <h3 className="font-bold text-gray-900 mb-2">🍪 Cookies Policy</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Cookies help maintain login sessions</li>
          <li>Used for cart persistence and preferences</li>
          <li>Analytics cookies help us improve the platform</li>
        </ul>
      </section>

      {/* SECURITY */}
      <section className="mb-5">
        <h3 className="font-bold text-gray-900 mb-2">🛡️ Data Security</h3>
        <p className="text-gray-600">
          We implement industry-standard security practices to protect your data.
          Sensitive information is encrypted and access is strictly controlled.
        </p>
      </section>

      {/* NOTE */}
      <div className="bg-blue-50 border border-blue-100 rounded-md p-3 text-blue-800">
        By using our platform, you agree to the terms outlined in this policy.
      </div>

    </div>
  );
}
