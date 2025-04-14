import React, { useState } from "react";

import Layout from "../../component/layout/Layout";

interface Country {
  id: string;
  name: string;
  country: string;
  createdAt?: string;
  updatedAt?: string;
}

const Countries: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);

  const openModal = () => {
    setIsModalOpen(true);
    setCurrentCountry(null); // Reset current country for adding new country
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCountry(null);
  };

  const handleAddOrUpdateCountry = (country: Country) => {
    const now = new Date().toISOString(); // Current timestamp

    if (currentCountry) {
      // Update country
      setCountries(countries.map((c) => 
        c.id === currentCountry.id 
        ? { ...c, ...country, updatedAt: now }  // Update updatedAt when editing
        : c
      ));
    } else {
      // Add new country
      setCountries([
        ...countries, 
        { ...country, id: Date.now().toString(), createdAt: now, updatedAt: now } // Set both createdAt and updatedAt for new country
      ]);
    }
  };

  const handleEditCountry = (country: Country) => {
    setCurrentCountry(country);
    setIsModalOpen(true);
  };

  const handleDeleteCountry = (id: string) => {
    setCountries(countries.filter((country) => country.id !== id));
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-semibold mb-6">Country Management</h1>
        
        {/* Add Country Button */}
        <button
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-5"
        >
          Add New Country
        </button>

        {/* Countries Table */}
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Country Name</th>
              <th className="px-4 py-2 border">Country Code</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Updated At</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((country) => (
              <tr key={country.id}>
                <td className="px-4 py-2 border">{country.name}</td>
                <td className="px-4 py-2 border">{country.country}</td>
                <td className="px-4 py-2 border">{new Date(country.createdAt!).toLocaleString()}</td>
                <td className="px-4 py-2 border">{new Date(country.updatedAt!).toLocaleString()}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleEditCountry(country)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCountry(country.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* CountryModal Component */}
      
      </div>
    </Layout>
  );
};

export default Countries;
