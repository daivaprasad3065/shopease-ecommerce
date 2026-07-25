// frontend-user/src/pages/cart.js

"use client";

import Layout from '@/components/layout/Layout';
import CartContainer from '@/components/cart/CartContainer';

export default function CartPage() {
  return (
    <Layout fullWidth={true}>
      <CartContainer />
    </Layout>
  );
}
