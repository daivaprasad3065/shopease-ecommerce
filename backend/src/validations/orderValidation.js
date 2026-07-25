exports.validateOrderRequest = (body) => {
    const { products, deliveryAddress } = body;
    if (!products || products.length === 0) {
        return "No products in the order";
    }
    if (!deliveryAddress || !deliveryAddress.line1 || !deliveryAddress.city || !deliveryAddress.pincode || !deliveryAddress.phone) {
        return "Missing required address fields";
    }
    return null;
};
