import React, { useState } from "react";

import CategoriesDropdown from "../../component/dropdown/CategoriesDropDown";
import CountriesDropdown from "../../component/dropdown/CountryDropDown";
import CitiesDropdown from "../../component/dropdown/CityDropDown";


const SomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  return (
    <div className="p-6">
      {/* <h2 className="text-xl font-semibold mb-4">Select a Venue</h2>
      
      <VenuDropdown selectedVenue={selectedVenue} onVenueChange={setSelectedVenue} />

      {selectedVenue && (
        <div className="mt-4 p-4 border rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Selected Venue:</h3>
          <p><strong>Name:</strong> {selectedVenue.venueName}</p>
        </div>
      )}   
      */}
<h2 className="text-xl font-semibold mb-4">Select a Category</h2>
      
      {/* Categories Dropdown */}
      <CategoriesDropdown selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

      {/* Display Selected Category */}
      {selectedCategory && (
        <div className="mt-4 p-4 border rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Selected Category:</h3>
          <p>{selectedCategory}</p>
        </div>
      )}

<div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Select Location</h2>

      {/* Country Dropdown */}
      <CountriesDropdown selectedCountry={selectedCountry} onCountryChange={setSelectedCountry} />

      {/* City Dropdown */}
      <CitiesDropdown selectedCity={selectedCity} onCityChange={setSelectedCity} />

      {/* Display Selected Values */}
      {selectedCity && (
        <div className="mt-4 p-4 border rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Selected Venue:</h3>
          <p><strong>Name:</strong> {selectedCity.cityName}</p>
        </div>
      )}

{selectedCountry&& (
        <div className="mt-4 p-4 border rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Selected Venue:</h3>
          <p><strong>Name:</strong> {selectedCountry.countryName}</p>
        </div>
      )}
    </div>
    
      
    </div>
  );
};

export default SomeScreen;
