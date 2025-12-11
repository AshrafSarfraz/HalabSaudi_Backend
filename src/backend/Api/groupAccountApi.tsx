// src/backend/Api/groupAccountApi.tsx

const BASE_URL = "https://hala-b-saudi.onrender.com/api/hbs/groupAccount";
// 👆 backend route: app.use("/api/group-accounts", groupAccountRoutes);

export interface GroupAccountPayload {
  [key: string]: any;
}

export const groupAccountApi = {
  // GET: saare accounts
  async getAll() {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch group accounts");
    const data = await res.json();

    // Handle both cases:
    // 1) { success: true, data: [...] }
    // 2) [ ... ]
    return data.data || data || [];
  },

  // GET: single account by ID
  async getById(id: string | number) {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch group account");
    const data = await res.json();

    return data.data || data;
  },

  // POST: create account
  async create(payload: GroupAccountPayload) {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Failed to create group account");
    }

    const data = await res.json();
    return data.data || data;
  },

  // PUT: update account
  async update(id: string | number, payload: GroupAccountPayload) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Failed to update group account");
    }

    const data = await res.json();
    return data.data || data;
  },

  // DELETE: delete account
  async remove(id: string | number) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Failed to delete group account");
    }

    const data = await res.json();
    return data;
  },
};
