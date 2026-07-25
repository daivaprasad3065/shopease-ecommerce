// src/pages/index.js
"use client";

import Layout from "@/components/layout/Layout"; 
import HeroSection from "@/components/homepage/HeroSection";
import TopCategories from "@/components/categories/TopCategories";
import DealOfTheDay from "@/components/promotions/DealOfTheDay";
import HomeProductDisplay from "@/components/homepage/HomeProductDisplay";

export default function HomePage() {

  return (
    <Layout>      
      <HeroSection />
      <TopCategories />
      <DealOfTheDay />
      <HomeProductDisplay />


    </Layout>
  );
}