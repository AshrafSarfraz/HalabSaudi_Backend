import React, { useState, useEffect, ChangeEvent } from "react";
import Layout from "../../component/layout/Layout";
import CityModal from "../../component/modal/CitiesModal";
import { toast } from "react-toastify";
import { citiesApi } from "../../backend/Api/citiesApi";


interface CityEntry {
  id: string;
  cityName: string;
  countryName: string;
  countryCode: string;
}

const Cities: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [citiesList, setCitiesList] = useState<CityEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState<CityEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const openModal = (city?: CityEntry) => {
    setEditData(city || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  // 🔥 Node API se data fetch
  const fetchCities = async () => {
    try {
      setLoading(true);
      const data = await citiesApi.getAllCities();

      console.log("Cities API response:", data); // debug ke liye

      const mapped: CityEntry[] = data.map((c: any) => ({
        id: c._id,
        cityName: c.cityName || "",
        countryName: c.countryName || "",
        countryCode: c.countryCode || "",
      }));

      setCitiesList(mapped);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to load cities");
    } finally {
      setLoading(false);
    }
  };

  // Mount pe load
  useEffect(() => {
    fetchCities();
  }, []);

  // Delete Data (Node API)
  const handleDeleteCity = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this city?")) return;
    try {
      await citiesApi.deleteCity(id);
      toast.success("City deleted successfully!");
      setCitiesList((prev) => prev.filter((city) => city.id !== id));
    } catch (error: any) {
      console.error("Error deleting city:", error);
      toast.error(error?.message || "Failed to delete city");
    }
  };

  // Search Item
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  const filteredCitiesList = citiesList.filter((c) =>
    c.cityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          City and Country Management
        </h1>

        <div className="flex flex-col md:flex-row md:justify-between items-center mb-6 gap-3">
          <input
            type="text"
            placeholder="Search City by Name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border px-4 py-2 rounded-md w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition duration-200 shadow-md"
          >
            + Add City
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
                  <th className="border p-3 text-center">City Name</th>
                  <th className="border p-3 text-center">Country Name</th>
                  <th className="border p-3 text-center">Country Code</th>
                  <th className="border p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCitiesList.length > 0 ? (
                  filteredCitiesList.map((city) => (
                    <tr key={city.id} className="hover:bg-gray-100 transition">
                      <td className="border p-3 text-center text-gray-800">
                        {city.cityName}
                      </td>
                      <td className="border p-3 text-center text-gray-800">
                        {city.countryName}
                      </td>
                      <td className="border p-3 text-center text-gray-800">
                        {city.countryCode}
                      </td>
                      <td className="border p-3 text-center space-x-2">
                        <button
                          onClick={() => openModal(city)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCity(city.id)}
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
                      colSpan={4}
                      className="text-center py-5 text-gray-500"
                    >
                      No cities found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CityModal
        isOpen={isModalOpen}
        onClose={closeModal}
        editData={editData}
        onSaved={fetchCities} // ✅ create/update ke baad refresh
      />
    </Layout>
  );
};

export default Cities;
