import React, { useState, useEffect, ChangeEvent } from "react";
import Layout from "../../component/layout/Layout";
import AddVenusModal from "../../component/modal/VenusModal";
import { venueApi } from "../../backend/Api/venueApi";


interface VenusEntry {
  id: string;           // Node ka _id
  img: string;
  venueName: string;
  venueNameAr: string;
  city: string;
  country: string;
  status?: "Active" | "Inactive";
  time?: string;
}

const Venus: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [venusList, setVenusList] = useState<VenusEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState<VenusEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const openModal = (venue?: VenusEntry) => {
    setEditData(venue || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  // 🔥 Node API se venues fetch
  const fetchVenues = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await venueApi.getAllVenues(); // JS helper → any[]

      const mapped: VenusEntry[] = data.map((v: any) => ({
        id: v._id,
        img: v.img || "",
        venueName: v.venueName || "",
        venueNameAr: v.venueNameAr || "",
        city: v.city || "",
        country: v.country || "",
        time: v.time,
      }));

      setVenusList(mapped);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load venues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  // delete data (Node API)
  const handleDeleteVenus = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this venue?")) return;
    try {
      await venueApi.deleteVenue(id);
      alert("Deleted successfully");
      setVenusList((prev) => prev.filter((v) => v.id !== id));
    } catch (error) {
      console.error("Error deleting venue:", error);
      alert("Failed to delete");
    }
  };

  // search Item
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  const filteredVenusList = venusList.filter((v) =>
    (v.venueName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Venues Management
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
            + Add Venue
          </button>
        </div>

        {error && (
          <div className="mb-4 text-red-600 bg-red-100 px-4 py-2 rounded">
            {error}
          </div>
        )}

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
                  <th className="border p-3 text-center">Venue Name</th>
                  <th className="border p-3 text-center">Venue Name (Ar)</th>
                  <th className="border p-3 text-center">City</th>
                  <th className="border p-3 text-center">Country</th>
                  <th className="border p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVenusList.length > 0 ? (
                  filteredVenusList.map((venue) => (
                    <tr key={venue.id} className="hover:bg-gray-100 transition">
                      <td className="border p-3">
                        {venue.img ? (
                          <img
                            src={venue.img}
                            alt={venue.venueName}
                            className="w-12 h-12 object-cover rounded-full"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-full" />
                        )}
                      </td>
                      <td className="border p-3 text-gray-800 text-center">
                        {venue.venueName}
                      </td>
                      <td className="border p-3 text-gray-800 text-center">
                        {venue.venueNameAr}
                      </td>
                      <td className="border p-3 text-gray-800 text-center">
                        {venue.city}
                      </td>
                      <td className="border p-3 text-gray-800 text-center">
                        {venue.country}
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
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-5 text-gray-500"
                    >
                      No venues found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddVenusModal
        isOpen={isModalOpen}
        onClose={closeModal}
        editData={editData}
        onSaved={fetchVenues} // 👈 yahan typo tha, ab sahi function name
      />
    </Layout>
  );
};

export default Venus;
