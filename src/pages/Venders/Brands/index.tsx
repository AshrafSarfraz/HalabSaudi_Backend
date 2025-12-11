// src/pages/Venders/Brands.tsx
import React, { useState, useEffect, ChangeEvent } from "react";

import VenderServicesModal from "../../../component/modal/venderAccount/VenderServiceBrand";
import { deleteBrand, getBrands } from "../../../backend/Api/brandApi";

// Optional type if backend sends discounts array
interface DiscountItem {
  value: number;
  descriptionEng: string;
  descriptionArabic: string;
}

interface VenusEntry {
  id: string;
  nameEng: string;
  nameArabic: string;
  descriptionEng: string;
  descriptionArabic: string;
  PhoneNumber: string;
  longitude: string;
  latitude: string;
  address: string;

  timings: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  startAt: string;
  endAt: string;
  pin: string;
  isBestSeller: string;
  isVenue: string;
  selectedVenue: any | null;
  selectedCategory: string;
  selectedCity: any | null;
  selectedCountry: any | null;
  status: string;

  img: string;
  multiImageUrls: string[];
  pdfUrl: string;
  menuUrl: string;

  discount?: string;
  discounts?: DiscountItem[];

  imageUrl?: string;
  _id?: string;
}

const VenderBrands: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [venusList, setVenusList] = useState<VenusEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState<VenusEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [venderName, setVenderName] = useState<string>("");

  const openModal = (venue?: VenusEntry) => {
    setEditData(venue || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  // Fetch brands
  useEffect(() => {
    const raw = localStorage.getItem("currentVender");
    if (raw) {
      const vendorData = JSON.parse(raw);
      setVenderName(vendorData.name || "");
    }

    const fetchBrands = async () => {
      try {
        setLoading(true);
        const brands = await getBrands();

        const normalized = (brands || []).map((b: any) => ({
          ...b,
          id: b.id || b._id,
        }));

        setVenusList(normalized);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleDeleteVenus = async (id: string) => {
    if (!confirm("Are you sure you want to delete this venue?")) return;

    try {
      await deleteBrand(id);
      alert("Deleted successfully");
      setVenusList((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting brand:", error);
      alert("Failed to delete");
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  const filteredVenusList = venusList
    .filter((item) =>
      venderName
        ? item.nameEng?.toLowerCase() === venderName.toLowerCase()
        : true
    )
    .filter((v) =>
      v.nameEng?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Services Management
      </h1>

      <div className="flex flex-col md:flex-row md:justify-between items-center mb-6 gap-3">
        <input
          type="text"
          placeholder="Search Venue by name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="border px-4 py-2 rounded-md w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition duration-200 shadow-md"
        >
          + Add Branch
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <span className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                <th className="border p-3 text-center">Logo</th>
                <th className="border p-3 text-center">Brand Name</th>
                <th className="border p-3 text-center">Venue</th>
                {/* 🔴 Discount column removed */}
                <th className="border p-3 text-center">City</th>
                <th className="border p-3 text-center">Status</th>
                <th className="border p-3 text-center">Pin</th>
                <th className="border p-3 text-center">Contract End At</th>
                <th className="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVenusList.length > 0 ? (
                filteredVenusList.map((venue) => (
                  <tr key={venue.id} className="hover:bg-gray-100 transition">
                    <td className="border p-3">
                      <img
                        src={venue.img}
                        alt={venue.nameEng}
                        className="w-12 h-12 object-cover rounded-full"
                      />
                    </td>
                    <td className="border p-3 text-gray-800 text-center">
                      {venue.nameEng}
                    </td>
                    <td className="border p-3 text-gray-800 text-center">
                      {venue.address}
                    </td>
                    {/* 🔴 Discount cell removed */}
                    <td className="border p-3 text-gray-800 text-center">
                      {String(venue.selectedCity || "")}
                    </td>
                    <td
                      className={`border p-3 text-gray-800 text-center ${
                        venue.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {venue.status}
                    </td>
                    <td className="border p-3 text-gray-800 text-center">
                      {venue.pin}
                    </td>
                    <td className="border p-3 text-gray-800 text-center">
                      {venue.endAt}
                    </td>
                    <td className="border p-3 text-center space-x-2">
                      <button
                        onClick={() => openModal(venue)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteVenus(venue.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 mt-2 rounded transition duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12} className="text-center py-5 text-gray-500">
                    No Data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <VenderServicesModal
        isOpen={isModalOpen}
        onClose={closeModal}
        editData={editData}
      />
    </div>
  );
};

export default VenderBrands;
