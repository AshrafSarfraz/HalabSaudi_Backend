import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";

// Define Props Type
interface CitiesDropdownProps {
  selectedCity: string ;
  onCityChange: (cityName: string ) => void;
}

const CitiesDropdown: React.FC<CitiesDropdownProps> = ({ selectedCity, onCityChange }) => {
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const snapshot = await getDocs(collection(fireDB, "H-Cities"));
        const cityList = snapshot.docs.map((doc) => doc.data().cityName) as string[]; // Now it's a string array
        setCities(cityList);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  return (
    <select
      value={selectedCity}
      onChange={(e) => onCityChange(e.target.value)} // Pass just cityName
      className="border p-3 w-full rounded-lg text-[13px] "
    >
      <option value="">Select City</option>
      {cities.map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </select>
  );
};

export default CitiesDropdown;
