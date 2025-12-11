// src/backend/Api/venderAccountApi.tsx

const BASE_URL =
  "https://hala-b-saudi.onrender.com/api/hbs/H-Vender_Account";
// 👆 backend route comment ke mutabiq

export interface VendorPayload {
  [key: string]: any;
}

export const vendorApi = {
  // GET: saare vendors
  async getAllVendors() {
    const res = await fetch(BASE_URL);

    if (!res.ok) throw new Error("Failed to fetch vendors");

    // getAllVendors backend se direct array aa raha hai
    // res.json() => [ {..vendor}, {..vendor}, ... ]
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  },

  // GET: single vendor by ID
  async getVendorById(id: string | number) {
    const res = await fetch(`${BASE_URL}/${id}`);

    if (!res.ok) throw new Error("Failed to fetch vendor");

    // getVendor backend se single object return kar raha hai
    // res.json() => {..vendor}
    const data = await res.json();
    return data;
  },

  // POST: create vendor
  // body example: { name, email, password, role? }
  async createVendor(payload: VendorPayload) {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Failed to create vendor");
    }

    // controller: { message: "Vendor created", data: saved }
    const data = await res.json();
    return data.data; // saved vendor
  },

  // PUT: update vendor
  async updateVendor(id: string | number, payload: VendorPayload) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Failed to update vendor");
    }

    // controller: { message: "Vendor updated", data: updated }
    const data = await res.json();
    return data.data; // updated vendor
  },

  // DELETE: delete vendor
  async deleteVendor(id: string | number) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Failed to delete vendor");
    }

    // controller: { message: "Vendor deleted", data: deleted }
    const data = await res.json();
    return data;
  },

  // POST: login vendor
  async loginVendor(email: string, password: string) {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Login failed");
    }

    // controller: { message: "Login successful", vendor }
    const data = await res.json();
    return data; // { message, vendor }
  },
};
