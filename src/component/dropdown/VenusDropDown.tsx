import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";

// Define Type for Venue
interface Venue {
  id: string;
  venueName: string;
}

// Define Props Type
interface VenueDropdownProps {
  selectedVenue: Venue | null;
  onVenueChange: (venue: Venue | null) => void;
}

const VenuDropdown: React.FC<VenueDropdownProps> = ({ selectedVenue, onVenueChange }) => {
  const [venues, setVenues] = useState<Venue[]>([]);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const snapshot = await getDocs(collection(fireDB, "Venues"));
        const venueList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Venue[]; // Cast data to Venue type
        setVenues(venueList);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };

    fetchVenues();
  }, []);

  return (
    <select
      value={selectedVenue?.id || ""}
      onChange={(e) => {
        const selected = venues.find((venue) => venue.id === e.target.value) || null;
        onVenueChange(selected); // Send full object
      }}
      className="border p-3 pr-8 w-full rounded-lg"
    >
      <option value="">Select Venue</option>
      {venues.map((venue) => (
        <option key={venue.id} value={venue.id}>
          {venue.venueName}
        </option>
      ))}
    </select>
  );
};

export default VenuDropdown;
