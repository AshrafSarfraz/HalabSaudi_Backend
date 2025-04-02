import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";

// Define Type for Country
interface Country {
  id: string;
  countryName: string;
}

// Define Props Type
interface CountriesDropdownProps {
  selectedCountry: Country | null;
  onCountryChange: (country: Country | null) => void;
}

const CountriesDropdown: React.FC<CountriesDropdownProps> = ({ selectedCountry, onCountryChange }) => {
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const snapshot = await getDocs(collection(fireDB, "Cities")); // Fixed collection name
        const countryList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Country[]; // Type assertion
        setCountries(countryList);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  return (
    <select
      value={selectedCountry?.id || ""}
      onChange={(e) => {
        const selected = countries.find((country) => country.id === e.target.value) || null;
        onCountryChange(selected); // Send full object
      }}
      className="border p-3 w-full rounded-lg"
    >
      <option value="">Select Country</option>
      {countries.map((country) => (
        <option key={country.id} value={country.id}>
          {country.countryName}
        </option>
      ))}
    </select>
  );
};

export default CountriesDropdown;
