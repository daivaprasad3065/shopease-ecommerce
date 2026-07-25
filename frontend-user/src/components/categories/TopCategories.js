// src/components/categories/TopCategories.js
"use client";

import Link from "next/link";
import Image from "next/image";

const categoriesData = [
  {
    name: "FORMALS",
    imageUrl:
      "https://media.istockphoto.com/id/1366393530/photo/unrecognizable-young-man-with-brown-belt.jpg?s=612x612&w=0&k=20&c=7YXfF9unsD-kRXohcBzdwWmZtj_9YsvewhCNrZiMKuQ=",
    href: "/products?category=Formals",
  },
  {
    name: "T-SHIRTS",
    imageUrl:
      "https://images.pexels.com/photos/2777719/pexels-photo-2777719.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    href: "/products?category=t-shirts",
  },
  {
    name: "SHIRTS",
    imageUrl:
      "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    href: "/products?category=Shirts",
  },
  {
    name: "SUITS & BLAZERS",
    imageUrl:
      "https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    href: "/products?category=Suits",
  },
  {
    name: "JEANS & TORNS",
    imageUrl:
      "https://images.pexels.com/photos/1082528/pexels-photo-1082528.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    href: "/products?category=Trousers",
  },
  {
    name: "ACCESSORIES",
    imageUrl:
      "https://images.pexels.com/photos/1460838/pexels-photo-1460838.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    href: "/products?category=Accessories",
  },
];

export default function TopCategories() {
  return (
    <section className="bg-white py-8 my-6 rounded-lg shadow">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          TOP CATEGORIES
        </h2>

        {/* FLEX WRAPPER → Horizontal scrolling on mobile */}
        <div className="flex items-center justify-start space-x-6 overflow-x-auto pb-4">

          {categoriesData.map((category) => (
            <Link
              href={category.href}
              key={category.name}
              className="flex-shrink-0"
            >
              <div className="flex flex-col items-center text-center group">

                {/* RESPONSIVE IMAGE CIRCLE */}
                <div
                  className="
                    rounded-full overflow-hidden border-2 border-gray-200 
                    group-hover:border-blue-500 transition-all duration-300

                    w-20 h-20          /* mobile */
                    sm:w-28 sm:h-28    /* tablets */
                    md:w-40 md:h-40    /* medium screens */
                    lg:w-50 lg:h-50    /* DESKTOP → original size */
                  "
                >
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* LABEL */}
                <span className="mt-2 text-sm sm:text-base font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                  {category.name}
                </span>

              </div>
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
}
