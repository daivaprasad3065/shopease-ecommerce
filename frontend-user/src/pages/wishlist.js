// frontend-user/src/pages/wishlist.js

"use client";

import Layout from "@/components/layout/Layout";
import WishlistContainer from "@/components/wishlist/WishlistContainer";

export default function WishlistPage() {
  return (
    <Layout fullWidth={true}>
      <WishlistContainer />
    </Layout>
  );
}
