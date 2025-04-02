import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";

// Define Type for City
interface City {
  id: string;
  cityName: string;
}

// Define Props Type
interface CitiesDropdownProps {
  selectedCity: City | null;
  onCityChange: (city: City | null) => void;
}

const CitiesDropdown: React.FC<CitiesDropdownProps> = ({ selectedCity, onCityChange }) => {
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const snapshot = await getDocs(collection(fireDB, "Cities"));
        const cityList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as City[]; // Type assertion
        setCities(cityList);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  return (
    <select
      value={selectedCity?.id || ""}
      onChange={(e) => {
        const selected = cities.find((city) => city.id === e.target.value) || null;
        onCityChange(selected); // Send full object
      }}
      className="border p-3 w-full rounded-lg"
    >
      <option value="">Select City</option>
      {cities.map((city) => (
        <option key={city.id} value={city.id}>
          {city.cityName}
        </option>
      ))}
    </select>
  );
};

export default CitiesDropdown;
