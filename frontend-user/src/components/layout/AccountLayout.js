// src/components/layout/AccountLayout.js
"use client";

import Header from "./Header";

export default function AccountLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header showSidebarToggle={false} />
      
      {/* This main content area is where your account page will be rendered */}
      <main>
        {children}
      </main>
    </div>
  );
}