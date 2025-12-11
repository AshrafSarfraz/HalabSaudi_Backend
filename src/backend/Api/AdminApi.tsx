// src/backend/Api/AdminApi.tsx

const BASE_URL = "https://hala-b-saudi.onrender.com/api/hbs/admins";
// 👆 backend route: app.use("/api/hbs/admins", adminRoutes);

export interface AdminPayload {
  [key: string]: any; // abhi loose rakha, baad me exact fields add kar sakte ho
}

export const adminApi = {
  // GET: saare admins
  async getAllAdmins() {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch admins");
    const data = await res.json();
    // Dono cases handle karo:
    // 1) { success: true, data: [...] }
    // 2) [ ... ]
    return data.data || data || [];
  },

  // POST: login admin
  async loginAdmin(payload: AdminPayload) {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Failed to login");
    }

    const data = await res.json();
    // backend se { success, data } aa raha hoga
    return data.data || data;
  },

  // GET: single admin
  async getAdminById(id: string | number) {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch admin");
    const data = await res.json();
    return data.data || data;
  },

  // POST: create admin (JSON body)
  async createAdmin(payload: AdminPayload) {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Failed to create admin");
    }

    const data = await res.json();
    return data.data || data;
  },

  // PUT: update admin (JSON body)
  async updateAdmin(id: string | number, payload: AdminPayload) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Failed to update admin");
    }

    const data = await res.json();
    return data.data || data;
  },

  // DELETE: delete admin
  async deleteAdmin(id: string | number) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Failed to delete admin");
    }

    const data = await res.json();
    return data; // { success: true, message: "...", data: {...} } ya kuch bhi
  },
};



// // src/api/adminApi.js

// const BASE_URL = "https://hala-b-saudi.onrender.com/api/hbs/admins";
// // 👆 backend route: app.use("/api/hbs/admins", adminRoutes);

// export const adminApi = {
//   // GET: saare admins
//   async getAllAdmins() {
//     const res = await fetch(BASE_URL);
//     if (!res.ok) throw new Error("Failed to fetch admins");
//     const data = await res.json();
//     // Dono cases handle karo:
//     // 1) { success: true, data: [...] }
//     // 2) [ ... ]
//     return data.data || data || [];
//   },

//   async loginAdmin(payload) {
//     const res = await fetch(`${BASE_URL}/login`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) {
//       const err = await res.json().catch(() => null);
//       throw new Error(err?.message || "Failed to login");
//     }

//     const data = await res.json();
//     // backend se { success, data } aa raha hoga
//     return data.data || data;
//   },


//   // GET: single admin
//   async getAdminById(id) {
//     const res = await fetch(`${BASE_URL}/${id}`);
//     if (!res.ok) throw new Error("Failed to fetch admin");
//     const data = await res.json();
//     return data.data || data;
//   },

//   // POST: create admin (JSON body)
//   async createAdmin(payload) {
//     const res = await fetch(BASE_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) {
//       const err = await res.json().catch(() => null);
//       throw new Error(err?.message || "Failed to create admin");
//     }

//     const data = await res.json();
//     return data.data || data;
//   },

//   // PUT: update admin (JSON body)
//   async updateAdmin(id, payload) {
//     const res = await fetch(`${BASE_URL}/${id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) {
//       const err = await res.json().catch(() => null);
//       throw new Error(err?.message || "Failed to update admin");
//     }

//     const data = await res.json();
//     return data.data || data;
//   },

//   // DELETE: delete admin
//   async deleteAdmin(id) {
//     const res = await fetch(`${BASE_URL}/${id}`, {
//       method: "DELETE",
//     });

//     if (!res.ok) {
//       const err = await res.json().catch(() => null);
//       throw new Error(err?.message || "Failed to delete admin");
//     }

//     const data = await res.json();
//     return data; // { success: true, message: "...", data: {...} } ya kuch bhi
//   },
// };
