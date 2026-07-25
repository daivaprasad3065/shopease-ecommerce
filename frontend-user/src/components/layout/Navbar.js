// src/components/layout/Navbar.js
"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const timeoutRef = useRef(null);

  const navLinks = [
    { label: "Home", href: "/" },
    {
      label: "Products",
      href: "/products",
      dropdownItems: [
        { label: "Shirts", href: "/products?category=Shirts" },
        { label: "Trousers", href: "/products?category=Trousers" },
        { label: "Jackets", href: "/products?category=Jackets" },
      ],
    },
    { label: "New Arrivals", href: "/products?sortBy=newest" },
    { label: "Categories", href: "/products" },
    { label: "Accessories", href: "/products?category=Accessories" },
  ];

  const openDropdown = (i) => {
    clearTimeout(timeoutRef.current);
    setDropdownOpen(i);
  };

  const closeDropdown = () => {
    timeoutRef.current = setTimeout(() => setDropdownOpen(null), 250);
  };

  return (
    <nav className="hidden md:flex space-x-8">
      {navLinks.map((item, i) => (
        <div
          key={item.label}
          className="relative"
          onMouseEnter={() => openDropdown(i)}
          onMouseLeave={closeDropdown}
        >
          <Link
            href={item.href}
            className="text-gray-700 hover:text-blue-600 font-medium transition cursor-pointer"
          >
            {item.label}
          </Link>

          {item.dropdownItems && dropdownOpen === i && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded shadow-lg min-w-max z-50">
              <ul className="py-2">
                {item.dropdownItems.map((d) => (
                  <li key={d.label}>
                    <Link
                      href={d.href}
                      className="block px-6 py-2 hover:bg-blue-50 hover:text-blue-600 whitespace-nowrap"
                    >
                      {d.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
