import React, { useState, useEffect, ChangeEvent } from "react";
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import Layout from "../../component/layout/Layout";
import CityModal from "../../component/modal/CitiesModal";
import { toast } from "react-toastify";

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

  // Fetch Data
  useEffect(() => {
    setLoading(true);
    const q = query(collection(fireDB, "H-Cities"), orderBy("time"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const citiesArray: CityEntry[] = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as CityEntry[];
      setCitiesList(citiesArray);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Delete Data
  const handleDeleteCity = async (id: string) => {
    if (!confirm("Are you sure you want to delete this city?")) return;
    try {
      await deleteDoc(doc(fireDB, "H-Cities", id)); // Fixed collection name from "Cities" to "Venues"
      toast.success("City deleted successfully!");
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete city");
    }
  };

  // Search Item
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);
  const filteredCitiesList = citiesList.filter((c) =>
    c.cityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">City and Country Management</h1>

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
                      <td className="border p-3 text-center text-gray-800">{city.cityName}</td>
                      <td className="border p-3 text-center text-gray-800">{city.countryName}</td>
                      <td className="border p-3 text-center text-gray-800">{city.countryCode}</td>
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
                    <td colSpan={4} className="text-center py-5 text-gray-500">
                      No cities found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CityModal isOpen={isModalOpen} onClose={closeModal} editData={editData} />
    </Layout>
  );
};

export default Cities;



