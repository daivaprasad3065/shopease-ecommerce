// src/contexts/UIContext.js
"use client";

import { createContext, useState, useContext } from "react";

const UIContext = createContext();

export function UIProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar is closed by default

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <UIContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  return useContext(UIContext);
}