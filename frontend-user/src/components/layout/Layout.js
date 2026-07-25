// src/components/layout/Layout.js
"use client";

import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useUI } from "@/contexts/UIContext";

export default function Layout({ children, fullWidth = false }) {
  const { isSidebarOpen } = useUI();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header showSidebarToggle={true} />
      <Sidebar />

      <div
        className={`transition-all duration-300 ease-in-out flex flex-col flex-1
          ${isSidebarOpen ? "md:ml-64" : "md:ml-0"}`}
      >
        <main className="px-2 sm:px-4 md:px-6 flex-grow">
          {fullWidth ? children : <div className="max-w-[90rem] mx-auto">{children}</div>}
        </main>

        <Footer />
      </div>
    </div>
  );
}
