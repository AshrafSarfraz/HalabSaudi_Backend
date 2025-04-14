import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";



// Define Props Type
interface CountriesDropdownProps {
  selectedCountry: string ;  // Now it's just the countryName as a string
  onCountryChange: (countryName: string ) => void;  // On change, we send only the countryName
}

const CountriesDropdown: React.FC<CountriesDropdownProps> = ({ selectedCountry, onCountryChange }) => {
  const [countries, setCountries] = useState<string[]>([]);  // We now only store country names as strings

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const snapshot = await getDocs(collection(fireDB, "Cities")); // Use the correct collection name
        const countryList = snapshot.docs.map((doc) => doc.data().countryName) as string[]; // Only store country names
        setCountries(countryList);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  return (
    <select
      value={selectedCountry }
      onChange={(e) => onCountryChange(e.target.value )} // Pass only the countryName
      className="border p-3 w-full rounded-lg  text-[13px] "
    >
      <option value="">Select Country</option>
      {countries.map((country) => (
        <option key={country} value={country}>
          {country}
        </option>
      ))}
    </select>
  );
};

export default CountriesDropdown;
