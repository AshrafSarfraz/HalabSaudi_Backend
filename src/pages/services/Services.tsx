import React, { useState, useEffect, ChangeEvent } from "react";
import Layout from "../../component/layout/Layout";
import ServicesModal from "../../component/modal/ServiceModal";
import { deleteBrand, getBrands } from "../../backend/Api/brandApi";

interface BrandDiscount {
  value: number;
  descriptionEng: string;
  descriptionArabic?: string;
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

  // legacy single discount (Firestore waala)
  discount?: string;
  discountArabic?: string;

  // NEW multiple discounts
  discounts?: BrandDiscount[];
  discountUsageMode?: "one-per-day" | "all-per-day";
  vendorGroupId?: string;
  isFlatOffer?: boolean;

  timings?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  startAt?: string;
  endAt?: string;
  pin?: string;
  isBestSeller?: boolean;
  isVenue?: boolean;
  selectedVenue?: string | null;
  selectedCategory?: string;
  selectedCity?: string | null;
  selectedCountry?: string | null;
  status?: string;

  menuUrl?: string;

  // images / pdf
  img?: string;              // Firebase logo url (naya)
  pdfUrl?: string;           // Firebase pdf url
  multiImageUrls?: string[]; // gallery images
  heroImage?: string;        // hero image url

  // super-legacy node fields (agar kahin use hue hon)
  nodeImg?: string;
  nodePdfUrl?: string;

  imageUrl?: string;
}

// ✅ Backend base URL helper
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const makeImageUrl = (raw?: string) => {
  if (!raw) return "";
  const url = raw.trim();

  // already full URL ya blob/data URL ho to as-is use karo
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("blob:") ||
    url.startsWith("data:")
  ) {
    return url;
  }

  // backend base + normalized path
  const base = API_BASE_URL.replace(/\/+$/, ""); // trailing / hatao
  const path = url.startsWith("/") ? url : `/${url}`; // leading / ensure
  return `${base}${path}`;
};

// Helper: discount display text
const getDisplayDiscount = (v: VenusEntry) => {
  if (v.discount && v.discount.trim() !== "") {
    return v.discount;
  }

  if (v.discounts && v.discounts.length > 0) {
    const first = v.discounts[0];
    if (!first) return "-";
    const valueStr =
      typeof first.value === "number" && !Number.isNaN(first.value)
        ? `${first.value}%`
        : "";
    if (valueStr && first.descriptionEng) {
      return `${valueStr} - ${first.descriptionEng}`;
    }
    return first.descriptionEng || valueStr || "-";
  }

  return "-";
};

const Services: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [venusList, setVenusList] = useState<VenusEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState<VenusEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const openModal = (venue?: VenusEntry) => {
    setEditData(venue || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
    // refresh list after close (create/update)
    fetchVenues();
  };

  // ✅ API se data fetch
  const fetchVenues = async () => {
    try {
      setLoading(true);
      const data = await getBrands();

      const mapped: VenusEntry[] = (data || []).map((item: any) => ({
        ...item,
        id: item._id || item.id, // Mongo _id se normalize
      }));

      setVenusList(mapped);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  // ✅ delete brand via API
  const handleDeleteVenus = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;

    try {
      await deleteBrand(id);
      setVenusList((prev) => prev.filter((v) => v.id !== id));
      alert("Deleted successfully");
    } catch (error) {
      console.error("Error deleting brand:", error);
      alert("Failed to delete");
    }
  };

  // ✅ search
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredVenusList = venusList.filter((v) =>
    v.nameEng?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ pagination logic
  const totalItems = filteredVenusList.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageList = filteredVenusList.slice(startIndex, endIndex);

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-xl font-bold mb-6 text-gray-800">
          Services Management
        </h1>

        <div className="flex flex-col md:flex-row md:justify-between items-center mb-6 gap-3">
          <input
            type="text"
            placeholder="Search Brand by name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border px-4 py-2 rounded-md w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition duration-200 shadow-md"
          >
            + Add Brand
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <span className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                    <th className="border p-3 text-center">Logo</th>
                    <th className="border p-3 text-center">Brand Name</th>
                    <th className="border p-3 text-center">Address</th>
                    <th className="border p-3 text-center">Discount</th>
                    <th className="border p-3 text-center">City</th>
                    <th className="border p-3 text-center">Status</th>
                    <th className="border p-3 text-center">Pin</th>
                    <th className="border p-3 text-center">Contract End At</th>
                    <th className="border p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageList.length > 0 ? (
                    currentPageList.map((venue) => {
                      // logo priority: new Firebase img -> legacy nodeImg
                      const logoSrc = makeImageUrl(venue.img || venue.nodeImg);

                      // end date: just show raw or formatted
                      const endAtDisplay = venue.endAt
                        ? new Date(venue.endAt).toLocaleDateString()
                        : "-";

                      return (
                        <tr
                          key={venue.id}
                          className="hover:bg-gray-100 transition"
                        >
                          <td className="border p-1 text-center">
                            {logoSrc ? (
                              <img
                                src={logoSrc}
                                alt={venue.nameEng}
                                className="w-10 h-10 object-cover rounded text-xs mx-auto"
                              />
                            ) : (
                              <span className="text-xs text-gray-400">
                                No Image
                              </span>
                            )}
                          </td>
                          <td className="border p-1 text-gray-800 text-center text-xs">
                            {venue.nameEng}
                          </td>
                          <td className="border p-1 text-gray-800 text-center text-xs">
                            {venue.address}
                          </td>
                          <td className="border p-2 text-gray-800 text-center text-xs">
                            {getDisplayDiscount(venue)}
                          </td>
                          <td className="border p-2 text-gray-800 text-center text-xs">
                            {venue.selectedCity || "-"}
                          </td>
                          <td
                            className={`border p-2 text-center text-xs ${
                              venue.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {venue.status || "Inactive"}
                          </td>
                          <td className="border p-2 text-gray-800 text-center text-xs">
                            {venue.pin || "-"}
                          </td>
                          <td className="border p-2 text-gray-800 text-center text-xs">
                            {endAtDisplay}
                          </td>

                          <td className="border p-2 text-center space-x-2">
                            <button
                              onClick={() => openModal(venue)}
                              className="bg-yellow-500 text-xs hover:bg-yellow-600 text-white px-3 py-1 rounded transition duration-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteVenus(venue.id)}
                              className="bg-red-500 hover:bg-red-600 text-xs text-white px-3 py-1 mt-2 rounded transition duration-200"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={12}
                        className="text-center py-5 text-gray-500"
                      >
                        No Data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 🔽 Pagination */}
            {totalItems > pageSize && (
              <div className="flex justify-center items-center mt-4 gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded border ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal for Add/Edit */}
      <ServicesModal
        isOpen={isModalOpen}
        onClose={closeModal}
        editData={editData}
      />
    </Layout>
  );
};

export default Services;
