import React, { useState } from "react";
import CityModal from "../../component/modal/CitiesModal";
import Layout from "../../component/layout/Layout";

interface City {
  id: string;
  name: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

const CityManagementScreen: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState<City | null>(null);

  const openModal = () => {
    setIsModalOpen(true);
    setCurrentCity(null); // Reset current city for adding new city
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCity(null);
  };

  const handleAddOrUpdateCity = (city: City) => {
    if (currentCity) {
      // Update city
      setCities(cities.map((c) => (c.id === currentCity.id ? { ...c, ...city, updatedAt: new Date().toISOString() } : c)));
    } else {
      // Add new city with the current timestamp for createdAt and updatedAt
      setCities([
        ...cities,
        { ...city, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ]);
    }
  };

  const handleEditCity = (city: City) => {
    setCurrentCity(city);
    setIsModalOpen(true);
  };

  const handleDeleteCity = (id: string) => {
    setCities(cities.filter((city) => city.id !== id));
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-semibold mb-6">City Management</h1>
        {/* Add City Button */}
        <button
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-5"
        >
          Add New City
        </button>

        {/* Cities Table */}
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border">City Name</th>
              <th className="px-4 py-2 border">Country Name</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Updated At</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city) => (
              <tr key={city.id}>
                <td className="px-4 py-2 border">{city.name}</td>
                <td className="px-4 py-2 border">{city.country}</td>
                <td className="px-4 py-2 border">{new Date(city.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2 border">{new Date(city.updatedAt).toLocaleString()}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleEditCity(city)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCity(city.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* CityModal Component */}
        <CityModal
          isOpen={isModalOpen}
          currentCity={currentCity}
          onClose={closeModal}
          onSave={handleAddOrUpdateCity}
        />
      </div>
    </Layout>
  );
};

export default CityManagementScreen;
