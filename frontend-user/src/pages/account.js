// frontend-user/src/pages/account.js
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

import AccountLayout from "@/components/layout/AccountLayout";
import AccountSidebar from "@/components/account-hub/AccountSidebar";
import LoginRequired from "@/components/account-hub/LoginRequired";

import ProfileInformation from "@/components/account-hub/ProfileInformation";
import AddressManager from "@/components/account-hub/AddressManager";
import Notifications from "@/components/account-hub/Notifications";
import WishlistContainer from "@/components/wishlist/WishlistContainer";
import OrderContainer from "@/components/account-hub/orders/OrderContainer";
import Support from "@/components/account-hub/Support";
import Terms from "@/components/account-hub/Terms";
import Privacy from "@/components/account-hub/Privacy";
import ShippingReturns from "@/components/account-hub/ShippingReturns";

const PUBLIC_VIEWS = ["support", "terms", "privacy", "shipping"];
const PRIVATE_VIEWS = ["profile", "addresses", "orders", "notifications", "wishlist"];

export default function AccountPage() {
  const searchParams = useSearchParams();
  const { isLoggedIn, isLoading } = useAuth();

  const [activeView, setActiveView] = useState("profile");

  /* READ ?view= FROM URL */
  useEffect(() => {
    const view = searchParams.get("view");
    if (view) setActiveView(view);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[12px] sm:text-base">
        Loading account...
      </div>
    );
  }

  const isPublicView = PUBLIC_VIEWS.includes(activeView);
  const isPrivateView = PRIVATE_VIEWS.includes(activeView);

  return (
    <AccountLayout>
      <div className="container mx-auto px-[4px] sm:px-6 lg:px-8 py-2 sm:py-8">

        <div className="flex flex-row items-start gap-2 sm:gap-6 md:gap-8 min-h-[80vh]">

          {/* SIDEBAR */}
          <div className="w-[29%] sm:w-[26%] md:w-1/4 flex-shrink-0 min-w-[100px]">
            <AccountSidebar
              activeView={activeView}
              setActiveView={setActiveView}
            />
          </div>

          {/* CONTENT */}
          <div className="flex-1 min-w-0">
            <div className="text-[10px] sm:text-[14px] md:text-base">

              {/* PRIVATE SECTIONS */}
              {isPrivateView && !isLoggedIn && (
                <LoginRequired title="Login required to access this section" />
              )}

              {activeView === "profile" && isLoggedIn && <ProfileInformation />}
              {activeView === "addresses" && isLoggedIn && <AddressManager />}
              {activeView === "orders" && isLoggedIn && <OrderContainer />}
              {activeView === "notifications" && isLoggedIn && <Notifications />}

              {activeView === "wishlist" && isLoggedIn && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <WishlistContainer />
                </div>
              )}

              {/* PUBLIC SECTIONS */}
              {activeView === "support" && <Support />}
              {activeView === "terms" && <Terms />}
              {activeView === "privacy" && <Privacy />}
              {activeView === "shipping" && <ShippingReturns />}

            </div>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
