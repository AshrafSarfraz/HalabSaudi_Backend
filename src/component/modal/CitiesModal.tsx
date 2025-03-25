import React, { useState, useEffect } from "react";

interface City {
  id: string;
  name: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

interface CityModalProps {
  isOpen: boolean;
  currentCity: City | null;
  onClose: () => void;
  onSave: (city: City) => void;
}

const CityModal: React.FC<CityModalProps> = ({ isOpen, currentCity, onClose, onSave }) => {
  const [cityName, setCityName] = useState("");
  const [countryName, setCountryName] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  useEffect(() => {
    if (currentCity) {
      setCityName(currentCity.name);
      setCountryName(currentCity.country);
      setCreatedAt(currentCity.createdAt);
      setUpdatedAt(currentCity.updatedAt);
    } else {
      setCityName("");
      setCountryName("");
      setCreatedAt(new Date().toISOString()); // Set createdAt for new cities
      setUpdatedAt(new Date().toISOString()); // Set updatedAt for new cities
    }
  }, [currentCity]);

  const handleSave = () => {
    if (cityName && countryName) {
      const cityData = {
        id: currentCity ? currentCity.id : Date.now().toString(),
        name: cityName,
        country: countryName,
        createdAt: currentCity ? createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(), // Always update the updatedAt field
      };
      onSave(cityData);
      onClose(); // Close modal after saving
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg w-[500px]">
          <h2 className="text-2xl font-semibold mb-5 text-gray-800">
            {currentCity ? "Edit City" : "Add New City"}
          </h2>

          {/* City Name */}
          <input
            type="text"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="City Name"
          />

          {/* Country Name */}
          <input
            type="text"
            value={countryName}
            onChange={(e) => setCountryName(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Country Name"
          />

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-5 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md"
            >
              {currentCity ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default CityModal;
