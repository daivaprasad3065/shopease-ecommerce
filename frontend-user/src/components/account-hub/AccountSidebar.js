// frontend-user/src/components/account-hub/AccountSidebar.js

"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function AccountSidebar({ activeView, setActiveView }) {
  const { logout } = useAuth();

  // --- STYLES ---
  // Mobile: text-[9px], tight padding (p-1.5), tight gap.
  // Desktop: text-base, normal padding (p-3), normal gap.
  const navButtonBase = "w-full text-left rounded-md transition-colors flex items-center gap-1.5 md:gap-3 p-1.5 md:p-3 text-[9px] xs:text-[10px] sm:text-xs md:text-base";
  
  const activeClasses = "bg-blue-100 text-blue-700 font-bold shadow-sm ring-1 ring-blue-200";
  const inactiveClasses = "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

  return (
    <div className="bg-white p-2 md:p-4 rounded-lg shadow-sm border border-gray-100 h-full flex flex-col justify-between">
      
      <div>
        {/* Title: Hidden on small mobile to save space, visible on slightly larger screens */}
        <h3 className="font-bold text-gray-400 uppercase text-[9px] md:text-sm mb-2 md:mb-4 px-1 md:px-3 tracking-wider hidden xs:block">
          Menu
        </h3>
        
        <nav className="space-y-1">
          
          <button 
            onClick={() => setActiveView('profile')}
            className={`${navButtonBase} ${activeView === 'profile' ? activeClasses : inactiveClasses}`}
          >
            <span className="text-sm md:text-lg">👤</span>
            <span className="truncate">
              Profile <span className="hidden md:inline">Information</span>
            </span>
          </button>
          
          <button 
            onClick={() => setActiveView('addresses')}
            className={`${navButtonBase} ${activeView === 'addresses' ? activeClasses : inactiveClasses}`}
          >
            <span className="text-sm md:text-lg">📍</span>
            <span className="truncate">
              <span className="md:hidden">Addresses</span>
              <span className="hidden md:inline">Manage Addresses</span>
            </span>
          </button>
          
          <button 
            onClick={() => setActiveView('orders')}
            className={`${navButtonBase} ${activeView === 'orders' ? activeClasses : inactiveClasses}`}
          >
            <span className="text-sm md:text-lg">📦</span>
            <span className="truncate">
              <span className="md:hidden">Orders</span>
              <span className="hidden md:inline">My Orders</span>
            </span>
          </button>
          
          <button 
            onClick={() => setActiveView('notifications')}
            className={`${navButtonBase} ${activeView === 'notifications' ? activeClasses : inactiveClasses}`}
          >
            <span className="text-sm md:text-lg">🔔</span>
            <span className="truncate">
              <span className="md:hidden">Notify</span>
              <span className="hidden md:inline">Notifications</span>
            </span>
          </button>

          <button 
            onClick={() => setActiveView('wishlist')}
            className={`${navButtonBase} ${activeView === 'wishlist' ? activeClasses : inactiveClasses}`}
          >
            <span className="text-sm md:text-lg">❤️</span>
            <span className="truncate">
              <span className="md:hidden">Wishlist</span>
              <span className="hidden md:inline">My Wishlist</span>
            </span>
          </button>
                    
          <div className="my-1.5 border-t border-gray-100"></div>

          <button 
            onClick={() => setActiveView('support')} 
            className={`${navButtonBase} ${activeView === 'support' ? activeClasses : inactiveClasses}`}
          >
            <span className="text-sm md:text-lg">🎧</span>
            <span className="truncate">
              <span className="md:hidden">Support</span>
              <span className="hidden md:inline">Customer Support</span>
            </span>
          </button>
          
          <button 
            onClick={() => setActiveView('terms')} 
            className={`${navButtonBase} ${activeView === 'terms' ? activeClasses : inactiveClasses}`}
          >
            <span className="text-sm md:text-lg">📜</span>
            <span className="truncate">
              <span className="md:hidden">T&C</span>
              <span className="hidden md:inline">Terms & Conditions</span>
            </span>
          </button>

          <button 
            onClick={() => setActiveView('privacy')} 
            className={`${navButtonBase} ${activeView === 'privacy' ? activeClasses : inactiveClasses}`}
          >
            <span className="text-sm md:text-lg">🔒</span>
            <span className="truncate">
              <span className="md:hidden">Privacy</span>
              <span className="hidden md:inline">Privacy & Cookies</span>
            </span>
          </button>

          <button 
            onClick={() => setActiveView('shipping')} 
            className={`${navButtonBase} ${activeView === 'shipping' ? activeClasses : inactiveClasses}`}
          >
            <span className="text-sm md:text-lg">🚚</span>
            <span className="truncate">
              <span className="md:hidden">Ship & Return</span>
              <span className="hidden md:inline">Shipping, Returns & Exchanges</span>
            </span>
          </button>

        </nav>
      </div>

      {/* SIGN OUT */}
      <div className="mt-2 pt-2 border-t border-gray-100">
        <button 
          onClick={logout}
          className={`${navButtonBase} text-red-600 hover:bg-red-50 font-semibold`}
        >
          <svg className="w-3.5 h-3.5 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          <span className="truncate">Sign Out</span>
        </button>
      </div>

    </div>
  );
}