import React, { useEffect, useState } from "react";
import { venueApi } from "../../backend/Api/venueApi";

interface VenueDropdownProps {
  selectedVenue: string;
  onVenueChange: (venueName: string) => void;
}

const VenueDropdown: React.FC<VenueDropdownProps> = ({
  selectedVenue,
  onVenueChange,
}) => {
  const [venues, setVenues] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      try {
        const data = await venueApi.getAllVenues(); // API se list
        // backend se object array aata hoga: [{ venueName: "...", ... }]
        const venueList = (data || [])
          .map((v: any) => v.venueName)
          .filter(Boolean) as string[];

        setVenues(venueList);
      } catch (error) {
        console.error("Error fetching venues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  return (
    <select
      value={selectedVenue}
      onChange={(e) => onVenueChange(e.target.value)}
      className="border p-3 w-full rounded-lg"
      disabled={loading}
    >
      <option value="">{loading ? "Loading venues..." : "Select Venue"}</option>
      {venues.map((venue) => (
        <option key={venue} value={venue}>
          {venue}
        </option>
      ))}
    </select>
  );
};

export default VenueDropdown;
