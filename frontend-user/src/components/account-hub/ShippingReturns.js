// frontend-user/src/components/account-hub/ShippingReturns.js

"use client";

import Link from "next/link";

export default function ShippingReturns() {
  return (
    <div className="bg-white p-3 sm:p-5 md:p-6 rounded-lg shadow-sm border border-gray-100
                    text-[10px] sm:text-sm animate-fadeIn leading-relaxed">

      {/* TITLE */}
      <h2 className="text-[14px] sm:text-xl md:text-2xl font-bold text-gray-800 mb-4">
        Shipping, Returns & Exchanges
      </h2>

      {/* INFO BANNER */}
      <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-5 flex gap-2 text-blue-800">
        <span className="text-[14px] sm:text-lg">ℹ️</span>
        <p>
          This section explains how your orders are shipped, when returns or exchanges
          are allowed, and how refunds are processed.
        </p>
      </div>

      {/* SHIPPING */}
      <section className="mb-6">
        <h3 className="font-bold text-gray-900 mb-2">🚚 Shipping Policy</h3>

        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Orders are processed within <strong>24–48 hours</strong> after confirmation.</li>
          <li>Delivery usually takes <strong>3–7 business days</strong>, depending on location.</li>
          <li>We currently ship across <strong>India</strong>.</li>
          <li>Shipping charges (if applicable) are shown at checkout.</li>
          <li>Delays may occur during festivals, sales, or unforeseen logistics issues.</li>
        </ul>
      </section>

      {/* RETURNS */}
      <section className="mb-6">
        <h3 className="font-bold text-gray-900 mb-2">🔄 Returns Policy</h3>

        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Returns are accepted within <strong>7 days</strong> of delivery.</li>
          <li>Products must be unused, unwashed, and with original tags intact.</li>
          <li>Innerwear, accessories, and discounted items may not be eligible.</li>
          <li>Return pickup will be arranged after approval.</li>
        </ul>
      </section>

      {/* EXCHANGE */}
      <section className="mb-6">
        <h3 className="font-bold text-gray-900 mb-2">🔁 Exchange Policy</h3>

        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Exchanges are subject to stock availability.</li>
          <li>You may request a different size or color of the same product.</li>
          <li>If the requested item is unavailable, a refund will be initiated.</li>
        </ul>
      </section>

      {/* REFUND */}
      <section className="mb-6">
        <h3 className="font-bold text-gray-900 mb-2">💰 Refunds</h3>

        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Refunds are processed after quality inspection.</li>
          <li>Refund amount is credited to the original payment method.</li>
          <li>It may take <strong>5–10 business days</strong> to reflect in your account.</li>
        </ul>
      </section>

      {/* HELP */}
      <div className="bg-blue-50 border border-blue-100 p-3 rounded-md text-blue-800">
        Need help? Visit the <Link href="/account?view=support"><strong>Customer Support</strong></Link> section for assistance.
      </div>
    </div>
  );
}
