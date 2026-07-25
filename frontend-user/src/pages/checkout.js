// frontend-user/src/pages/checkout.js

"use client";

import Layout from '@/components/layout/Layout';
import CheckoutContainer from '@/components/checkout/CheckoutContainer';

export default function CheckoutPage() {
  return (
    <Layout fullWidth={true}>
      <CheckoutContainer />
    </Layout>
  );
}