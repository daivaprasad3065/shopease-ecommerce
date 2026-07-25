// src/components/layout/Footer.js
"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 md:py-10 mt-10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* TOP GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4 md:gap-10">

          {/* 1. ABOUT SECTION */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-white text-sm md:text-lg font-semibold mb-3 md:mb-4">
              About Fashion Book
            </h3>
            <p className="text-[11px] md:text-sm leading-relaxed text-gray-400 md:text-gray-300">
              Fashion Book brings curated premium fashion to your doorstep.
              Shop trends, classics and everything in between.
            </p>
          </div>

          {/* 2. CUSTOMER SERVICE */}
          <div>
            <h3 className="text-white text-sm md:text-lg font-semibold mb-3 md:mb-4">
              Customer Service
            </h3>
            <ul className="space-y-2 text-xs md:text-sm">
              <li>
                <Link href="/account?view=support" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/account?view=shipping" className="hover:text-white transition-colors">
                  Returns & Exchange
                </Link>
              </li>
              <li>
                <Link href="/account?view=shipping" className="hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/account?view=support" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. LEGAL */}
          <div>
            <h3 className="text-white text-sm md:text-lg font-semibold mb-3 md:mb-4">
              Legal
            </h3>
            <ul className="space-y-2 text-xs md:text-sm">
              <li>
                <Link href="/account?view=privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/account?view=terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/account?view=privacy" className="hover:text-white transition-colors">
                  Cookies Policy
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <hr className="border-gray-700 my-6" />

        {/* BOTTOM ROW */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs md:text-sm space-y-4 md:space-y-0">
          <p className="text-gray-500 md:text-gray-300">© 2025 Fashion Book. All rights reserved.</p>

          <div className="flex space-x-4">
            <a href="https://www.instagram.com/satyas_fashion_book/" target="_blank" aria-label="Instagram" className="hover:text-white transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M7.9 2h8.2a6 6 0 016 6v8.2a6 6 0 01-6 6H7.9a6 6 0 01-6-6V8.2a6 6 0 016-6zm0 2a4 4 0 00-4 4v8.2a4 4 0 004 4h8.2a4 4 0 004-4V8.2a4 4 0 00-4-4H7.9zm4.1 2a4 4 0 110 8 4 4 0 010-8z"/></svg>
            </a>
            <a href="https://www.facebook.com/watch/?v=8560165130777460" target="_blank" aria-label="Facebook" className="hover:text-white transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M22 12a10 10 0 10-11.2 9.8v-6.9h-2.7v-2.9h2.7V9.4c0-2.7 1.6-4.2 4-4.2 1.2 0 2.4.2 2.4.2v2.6h-1.3c-1.3 0-1.7.8-1.7 1.6v1.9h2.9l-.5 2.9h-2.4v6.9A10 10 0 0022 12z"/></svg>
            </a>
            <a href="https://www.facebook.com/watch/?v=461640196541004" target="_blank" aria-label="Twitter" className="hover:text-white transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23 4.3c-.8.4-1.6.7-2.5.9.9-.5 1.6-1.4 2-2.4-.8.5-1.7.9-2.6 1.1-.8-.8-1.9-1.3-3.1-1.3-2.3 0-4.1 1.8-4.1 4 0 .3 0 .6.1.9-3.4-.2-6.5-1.7-8.6-4-1 .7-1.6 1.6-1.6 2.8 0 1.9 1 3.7 2.6 4.7-.7 0-1.4-.2-2-.7v.1c0 2.6 1.8 4.7 4.1 5.1-.4.1-.8.2-1.3.2-.3 0-.6 0-.9-.1.6 2 2.3 3.5 4.4 3.6-1.7 1.3-3.6 2.1-5.7 2.1H3c2 1.3 4.5 2 7.1 2 8.4 0 13-7 13-13v-.6c.9-.7 1.6-1.4 2.2-2.3z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}