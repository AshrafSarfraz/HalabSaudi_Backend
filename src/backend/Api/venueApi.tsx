// src/backend/Api/venueApi.tsx

const BASE_URL = "https://hala-b-saudi.onrender.com/api/hbs/venues";
// 👆 backend route: app.use("/api/hbs/venues", venueRoutes);

export const venueApi = {
  // GET: saare venues
  async getAllVenues() {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch venues");
    const data = await res.json();
    return data.data || [];
  },

  // GET: single venue
  async getVenueById(id: string | number) {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch venue");
    const data = await res.json();
    return data.data;
  },

  // POST: create venue (formData use hoga kyunki image bhi ja rahi hai)
  async createVenue(formData: FormData) {
    const res = await fetch(BASE_URL, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Failed to create venue");
    }

    const data = await res.json();
    return data.data;
  },

  // PUT: update venue (formData, optional new image)
  async updateVenue(id: string | number, formData: FormData) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Failed to update venue");
    }

    const data = await res.json();
    return data.data;
  },

  // DELETE: delete venue
  async deleteVenue(id: string | number) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Failed to delete venue");
    }

    const data = await res.json();
    return data;
  },
};
