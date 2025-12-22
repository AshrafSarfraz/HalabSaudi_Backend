// src/backend/redeemApi.tsx

const BASE_URL = "https://hala-b-saudi.onrender.com/api/hbs/redeem";
// backend: app.use("/api/hbs/redeem", halaredeem);

export const redeemApi = {
  // GET: saare redeemed coupons
  async getAll() {
    const res = await fetch(BASE_URL);

    if (!res.ok) {
      throw new Error("Failed to fetch redeemed coupons");
    }

    const data = await res.json();
    // controller returns: { success: true, data: [ ... ] }
    const raw = data.data || data || [];
    const arr = Array.isArray(raw) ? raw : [raw];

    // normalize id field (so frontend pe item.id available ho)
    return arr.map((item: any) => ({
      id: item._id || item.id,
      ...item,
    }));
  },

  // optional: GET single redeem by id
  async getById(id: string | number) {
    const res = await fetch(`${BASE_URL}/${id}`);

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Failed to fetch redeemed coupon");
    }

    const data = await res.json();
    const item = data.data || data;
    return {
      id: item._id || item.id,
      ...item,
    };
  },
};