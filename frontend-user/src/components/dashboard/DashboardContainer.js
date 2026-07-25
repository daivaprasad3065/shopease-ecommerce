// frontend-user/src/components/dashboard/DashboardContainer.js
"use client";

import WelcomeCard from "./WelcomeCard";
import HeroSection from "@/components/homepage/HeroSection";
import HomeProductDisplay from "@/components/homepage/HomeProductDisplay";
import TopCategories from "@/components/categories/TopCategories";
import DealOfTheDay from "@/components/promotions/DealOfTheDay";

export default function DashboardContainer() {
  return (
    <div className="space-y-6">
      <WelcomeCard />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <HeroSection />
      </div>

      <TopCategories />
      <DealOfTheDay />

      <section className="mt-4 sm:mt-6">
        <HomeProductDisplay />
      </section>
    </div>
  );
}
