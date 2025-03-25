import React, { useState, useEffect } from "react";

interface Country {
  id: string;
  name: string;
  country: string; // Renamed from "city" to "country"
  createdAt?: string; // Optional createdAt field
  updatedAt?: string; // Optional updatedAt field
}

interface CountryModalProps {
  isOpen: boolean;
  currentCountry: Country | null;
  onClose: () => void;
  onSave: (country: Country) => void;
}

const CountryModal: React.FC<CountryModalProps> = ({ isOpen, currentCountry, onClose, onSave }) => {
  const [countryName, setCountryName] = useState("");
  const [countryCode, setCountryCode] = useState(""); // Renamed from "countryLocation" to "countryCode"

  useEffect(() => {
    if (currentCountry) {
      setCountryName(currentCountry.name);
      setCountryCode(currentCountry.country); // Updated to reflect the change in the interface
    } else {
      setCountryName("");
      setCountryCode("");
    }
  }, [currentCountry]);

  const handleSave = () => {
    if (countryName && countryCode) { // Updated validation to check for "countryCode"
      const now = new Date().toISOString(); // Get the current timestamp

      onSave({
        id: currentCountry ? currentCountry.id : Date.now().toString(),
        name: countryName,
        country: countryCode, // Updated property to reflect the change in the interface
        createdAt: currentCountry ? currentCountry.createdAt : now, // If editing, keep the createdAt
        updatedAt: now, // Always update the updatedAt
      });

      onClose(); // Close modal after saving
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg w-[500px]">
          <h2 className="text-2xl font-semibold mb-5 text-gray-800">
            {currentCountry ? "Edit Country" : "Add New Country"}
          </h2>

          {/* Country Name */}
          <input
            type="text"
            value={countryName}
            onChange={(e) => setCountryName(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Country Name"
          />

          {/* Country Code (previously countryLocation) */}
          <input
            type="text"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Country Code"
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
              {currentCountry ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default CountryModal;
