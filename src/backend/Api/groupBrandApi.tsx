// src/backend/Api/groupBrandApi.tsx

const BASE_URL = "https://hala-b-saudi.onrender.com/api/hbs/groupBrands";
// 👆 backend route: app.use("/api/group-brands", groupBrandRoutes);

export interface GroupBrandPayload {
  [key: string]: any;
}

export const groupBrandApi = {
  // GET: saare brands
  async getAll() {
    const res = await fetch(BASE_URL);

    if (!res.ok) throw new Error("Failed to fetch group brands");

    const data = await res.json();

    // Backend returns: [ ... ]
    return data.data || data || [];
  },

  // GET: single brand by ID
  async getById(id: string | number) {
    const res = await fetch(`${BASE_URL}/${id}`);

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Failed to fetch group brand");
    }

    const data = await res.json();
    return data.data || data;
  },

  // POST: create new brand
  async create(payload: GroupBrandPayload) {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Failed to create brand");
    }

    const data = await res.json();
    return data.data || data;
  },

  // PUT: update brand
  async update(id: string | number, payload: GroupBrandPayload) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Failed to update brand");
    }

    const data = await res.json();
    return data.data || data;
  },

  // DELETE: delete brand
  async remove(id: string | number) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Failed to delete brand");
    }

    const data = await res.json();
    return data; // { message: "Brand deleted successfully" }
  },
};
