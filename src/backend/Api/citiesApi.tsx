// src/backend/Api/citiesApi.tsx

const BASE_URL = "https://hala-b-saudi.onrender.com/api/hbs/cities";
// 👆 backend route: app.use("/api/hbs/cities", cityRoutes);

export interface CityPayload {
  [key: string]: any; // baad me exact shape define kar sakte ho
}

export const citiesApi = {
  // GET: saari cities
  async getAllCities() {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch cities");
    const data = await res.json();
    // Dono cases handle:
    // 1) { success: true, data: [...] }
    // 2) [ ... ]
    return data.data || data || [];
  },

  // GET: single city
  async getCityById(id: string | number) {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch city");
    const data = await res.json();
    return data.data || data;
  },

  // POST: create city (JSON body)
  async createCity(payload: CityPayload) {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Failed to create city");
    }

    const data = await res.json();
    return data.data || data;
  },

  // PUT: update city (JSON body)
  async updateCity(id: string | number, payload: CityPayload) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Failed to update city");
    }

    const data = await res.json();
    return data.data || data;
  },

  // DELETE: delete city
  async deleteCity(id: string | number) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Failed to delete city");
    }

    const data = await res.json();
    return data; // { success: true, message: "...", ... }
  },
};



// // src/api/citiesApi.js

// const BASE_URL = "https://hala-b-saudi.onrender.com/api/hbs/cities";
// // 👆 backend route: app.use("/api/hbs/cities", cityRoutes);

// export const citiesApi = {
//   // GET: saari cities
//   async getAllCities() {
//     const res = await fetch(BASE_URL);
//     if (!res.ok) throw new Error("Failed to fetch cities");
//     const data = await res.json();
//     // Dono cases handle:
//     // 1) { success: true, data: [...] }
//     // 2) [ ... ]
//     return data.data || data || [];
//   },

//   // GET: single city
//   async getCityById(id) {
//     const res = await fetch(`${BASE_URL}/${id}`);
//     if (!res.ok) throw new Error("Failed to fetch city");
//     const data = await res.json();
//     return data.data || data;
//   },

//   // POST: create city (JSON body)
//   async createCity(payload) {
//     const res = await fetch(BASE_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) {
//       const err = await res.json().catch(() => null);
//       throw new Error(err?.message || "Failed to create city");
//     }

//     const data = await res.json();
//     return data.data || data;
//   },

//   // PUT: update city (JSON body)
//   async updateCity(id, payload) {
//     const res = await fetch(`${BASE_URL}/${id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) {
//       const err = await res.json().catch(() => null);
//       throw new Error(err?.message || "Failed to update city");
//     }

//     const data = await res.json();
//     return data.data || data;
//   },

//   // DELETE: delete city
//   async deleteCity(id) {
//     const res = await fetch(`${BASE_URL}/${id}`, {
//       method: "DELETE",
//     });

//     if (!res.ok) {
//       const err = await res.json().catch(() => null);
//       throw new Error(err?.message || "Failed to delete city");
//     }

//     const data = await res.json();
//     return data; // { success: true, message: "...", ... }
//   },
// };
