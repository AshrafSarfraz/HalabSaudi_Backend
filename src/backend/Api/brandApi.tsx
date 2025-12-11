// src/backend/Api/brandApi.tsx
import axios from "axios";

// TypeScript type for payload (baad me strong typing bhi kar sakte ho)
export interface BrandPayload {
  [key: string]: any;
}

// Yahan apna base URL daal lo:
const API = axios.create({
  // Backend me router "/api/hbs/brands" pe mounted hai
  baseURL: "https://hala-b-saudi.onrender.com/api/hbs/brands",
});

// Helper: object -> FormData
const toFormData = (data: BrandPayload): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    // ---------- FILE FIELDS MAPPING ----------

    // nodeImg / img  => backend field: "img"
    if ((key === "nodeImg" || key === "img") && value instanceof File) {
      formData.append("img", value);
      return;
    }

    // heroImage (agar alag se bhejna ho)
    if (key === "heroImage" && value instanceof File) {
      formData.append("heroImage", value);
      return;
    }

    // nodePdf / pdf => backend field: "pdf"
    if ((key === "nodePdf" || key === "pdf") && value instanceof File) {
      formData.append("pdf", value);
      return;
    }

    // multiImages / gallery => backend field: "gallery"
    if (
      (key === "multiImages" || key === "gallery") &&
      Array.isArray(value)
    ) {
      value.forEach((file) => {
        if (file instanceof File) {
          formData.append("gallery", file);
        }
      });
      return;
    }

    // ---------- OBJECTS / ARRAYS (JSON) ----------
    if (
      typeof value === "object" &&
      !(value instanceof File) &&
      !(value instanceof Blob)
    ) {
      // e.g. discounts, timings, etc.
      formData.append(key, JSON.stringify(value));
      return;
    }

    // ---------- PRIMITIVE VALUES ----------
    // yahan TypeScript ko clear kar do ke string bhej rahe ho
    formData.append(key, String(value));
  });

  return formData;
};

export const createBrand = async (payload: BrandPayload) => {
  const formData = toFormData(payload);

  const res = await API.post("/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // Backend agar { success, data } bhej raha ho:
  if (Array.isArray(res.data)) return res.data;
  if (res.data && Array.isArray(res.data.data)) return res.data.data;

  return res.data;
};

export const updateBrand = async (id: string | number, payload: BrandPayload) => {
  const formData = toFormData(payload);

  const res = await API.put(`/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (Array.isArray(res.data)) return res.data;
  if (res.data && Array.isArray(res.data.data)) return res.data.data;

  return res.data;
};

export const getBrands = async () => {
  const res = await API.get("/");

  // Normalize: hamesha array return kare
  if (Array.isArray(res.data)) return res.data;
  if (res.data && Array.isArray(res.data.data)) return res.data.data;

  // agar kuch unexpected aaye:
  console.warn("Unexpected getBrands response:", res.data);
  return [];
};

export const deleteBrand = async (id: string | number) => {
  const res = await API.delete(`/${id}`);
  return res.data;
};


// // src/backend/brand/brandApi.js
// import axios from "axios";

// // Yahan apna base URL daal lo:
// const API = axios.create({
//   // Backend me router "/api/hbs/brands" pe mounted hai
//   baseURL: "https://hala-b-saudi.onrender.com/api/hbs/brands",
// });

// // Helper: object -> FormData
// const toFormData = (data) => {
//   const formData = new FormData();

//   Object.entries(data).forEach(([key, value]) => {
//     if (value === undefined || value === null) return;

//     // ---------- FILE FIELDS MAPPING ----------

//     // nodeImg / img  => backend field: "img"
//     if ((key === "nodeImg" || key === "img") && value instanceof File) {
//       formData.append("img", value);
//       return;
//     }

//     // heroImage (agar alag se bhejna ho)
//     if (key === "heroImage" && value instanceof File) {
//       formData.append("heroImage", value);
//       return;
//     }

//     // nodePdf / pdf => backend field: "pdf"
//     if ((key === "nodePdf" || key === "pdf") && value instanceof File) {
//       formData.append("pdf", value);
//       return;
//     }

//     // multiImages / gallery => backend field: "gallery"
//     if (
//       (key === "multiImages" || key === "gallery") &&
//       Array.isArray(value)
//     ) {
//       value.forEach((file) => {
//         if (file instanceof File) {
//           formData.append("gallery", file);
//         }
//       });
//       return;
//     }

//     // ---------- OBJECTS / ARRAYS (JSON) ----------
//     if (
//       typeof value === "object" &&
//       !(value instanceof File) &&
//       !(value instanceof Blob)
//     ) {
//       // e.g. discounts, timings, etc.
//       formData.append(key, JSON.stringify(value));
//       return;
//     }

//     // ---------- PRIMITIVE VALUES ----------
//     formData.append(key, value);
//   });

//   return formData;
// };

// export const createBrand = async (payload) => {
//   const formData = toFormData(payload);

//   const res = await API.post("/", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });

//   // Backend agar { success, data } bhej raha ho:
//   if (Array.isArray(res.data)) return res.data;
//   if (res.data && Array.isArray(res.data.data)) return res.data.data;

//   return res.data;
// };

// export const updateBrand = async (id, payload) => {
//   const formData = toFormData(payload);

//   const res = await API.put(`/${id}`, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });

//   if (Array.isArray(res.data)) return res.data;
//   if (res.data && Array.isArray(res.data.data)) return res.data.data;

//   return res.data;
// };

// export const getBrands = async () => {
//   const res = await API.get("/");

//   // Normalize: hamesha array return kare
//   if (Array.isArray(res.data)) return res.data;
//   if (res.data && Array.isArray(res.data.data)) return res.data.data;

//   // agar kuch unexpected aaye:
//   console.warn("Unexpected getBrands response:", res.data);
//   return [];
// };

// export const deleteBrand = async (id) => {
//   const res = await API.delete(`/${id}`);
//   return res.data;
// };
