import React, { useEffect, useMemo, useState } from "react";
import { citiesApi } from "../../backend/Api/citiesApi";

type CityRow = {
  id: string;
  cityName: string;
  countryName: string;
  countryCode: string;
};

interface CitiesDropdownProps {
  selectedCity: string;
  onCityChange: (cityName: string) => void;

  // ✅ OPTIONAL: country select ho to cities filter ho jaayen
  selectedCountry?: string;
}

const CitiesDropdown: React.FC<CitiesDropdownProps> = ({
  selectedCity,
  onCityChange,
  selectedCountry,
}) => {
  const [rows, setRows] = useState<CityRow[]>([]);
  const [loading, setLoading] = useState(false);

  const norm = (v: any) => String(v ?? "").trim().toLowerCase();

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      try {
        const data = await citiesApi.getAllCities();

        const mapped: CityRow[] = (Array.isArray(data) ? data : []).map((c: any) => ({
          id: String(c._id || c.id || ""),
          cityName: String(c.cityName || ""),
          countryName: String(c.countryName || ""),
          countryCode: String(c.countryCode || ""),
        }));

        setRows(mapped.filter(x => x.cityName));
      } catch (e) {
        console.error("Error fetching cities:", e);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const cityOptions = useMemo(() => {
    let list = rows;

    // ✅ if selectedCountry provided => filter cities by country
    if (selectedCountry && norm(selectedCountry)) {
      list = list.filter((c) => norm(c.countryName) === norm(selectedCountry));
    }

    // ✅ sort by cityName
    list = [...list].sort((a, b) => a.cityName.localeCompare(b.cityName));

    // ✅ unique by cityName
    const seen = new Set<string>();
    const unique = list.filter((c) => {
      const key = norm(c.cityName);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return unique.map((c) => c.cityName);
  }, [rows, selectedCountry]);

  return (
    <select
      value={selectedCity}
      onChange={(e) => onCityChange(e.target.value)}
      className="border p-3 w-full rounded-lg text-[13px]"
      disabled={loading}
    >
      <option value="">
        {loading ? "Loading cities..." : "Select City"}
      </option>

      {cityOptions.map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </select>
  );
};

export default CitiesDropdown;
