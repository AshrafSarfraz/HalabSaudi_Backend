import React, { useEffect, useMemo, useState } from "react";
import { citiesApi } from "../../backend/Api/citiesApi";

type CityRow = {
  id: string;
  cityName: string;
  countryName: string;
  countryCode: string;
};

interface CountriesDropdownProps {
  selectedCountry: string;
  onCountryChange: (countryName: string) => void;
}

const CountriesDropdown: React.FC<CountriesDropdownProps> = ({
  selectedCountry,
  onCountryChange,
}) => {
  const [rows, setRows] = useState<CityRow[]>([]);
  const [loading, setLoading] = useState(false);

  const norm = (v: any) => String(v ?? "").trim().toLowerCase();

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const data = await citiesApi.getAllCities();

        const mapped: CityRow[] = (Array.isArray(data) ? data : []).map((c: any) => ({
          id: String(c._id || c.id || ""),
          cityName: String(c.cityName || ""),
          countryName: String(c.countryName || ""),
          countryCode: String(c.countryCode || ""),
        }));

        setRows(mapped.filter(x => x.countryName));
      } catch (e) {
        console.error("Error fetching countries:", e);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const countryOptions = useMemo(() => {
    // ✅ unique country names
    const unique = Array.from(
      new Set(rows.map((r) => r.countryName).filter(Boolean))
    );

    // ✅ sort
    unique.sort((a, b) => a.localeCompare(b));

    // ✅ also de-dupe with normalize (extra safety)
    const seen = new Set<string>();
    return unique.filter((c) => {
      const key = norm(c);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [rows]);

  return (
    <select
      value={selectedCountry}
      onChange={(e) => onCountryChange(e.target.value)}
      className="border p-3 w-full rounded-lg text-[13px]"
      disabled={loading}
    >
      <option value="">
        {loading ? "Loading countries..." : "Select Country"}
      </option>

      {countryOptions.map((country) => (
        <option key={country} value={country}>
          {country}
        </option>
      ))}
    </select>
  );
};

export default CountriesDropdown;
