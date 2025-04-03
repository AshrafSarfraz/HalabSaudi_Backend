import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";

// Define Props Type
interface VenueDropdownProps {
  selectedVenue: string;
  onVenueChange: (venueName: string) => void;
}

const VenueDropdown: React.FC<VenueDropdownProps> = ({ selectedVenue, onVenueChange }) => {
  const [venues, setVenues] = useState<string[]>([]);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const snapshot = await getDocs(collection(fireDB, "Venues")); // Correct collection name (Venues, not Venus)
        const venueList = snapshot.docs.map((doc) => doc.data().venueName) as string[]; // Only store venue names
        setVenues(venueList);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };

    fetchVenues();
  }, []);

  return (
    <select
      value={selectedVenue}
      onChange={(e) => onVenueChange(e.target.value)} // Pass only the venueName
      className="border p-3 w-full rounded-lg"
    >
      <option value="">Select Venue</option>
      {venues.map((venue) => (
        <option key={venue} value={venue}>
          {venue}
        </option>
      ))}
    </select>
  );
};

export default VenueDropdown;
