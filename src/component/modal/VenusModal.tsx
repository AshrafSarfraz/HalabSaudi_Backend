import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../loader/Loader";
import { venueApi } from "../../backend/Api/venueApi";

interface VenusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void; // create/update ke baad parent ko bolne ke liye
  editData?: {
    id: string;
    venueName: string;
    venueNameAr: string;
    city: string;
    country: string;
    img: string;
    longitude?: number;
    latitude?: number;
  } | null;
}

const AddVenusModal: React.FC<VenusModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  editData,
}) => {
  const [venueName, setVenueName] = useState("");
  const [venueNameAr, setVenueNameAr] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(""); // preview ke liye
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");

  useEffect(() => {
    if (editData) {
      setVenueName(editData.venueName || "");
      setVenueNameAr(editData.venueNameAr || "");
      setCity(editData.city || "");
      setCountry(editData.country || "");
      setLongitude(editData.longitude?.toString() || "");
      setLatitude(editData.latitude?.toString() || "");
      setImageUrl(editData.img || "");
      setImageUpload(null);
    } else {
      setVenueName("");
      setVenueNameAr("");
      setCity("");
      setCountry("");
      setLongitude("");
      setLatitude("");
      setImageUrl("");
      setImageUpload(null);
    }
  }, [editData, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImageUpload(file);
      setImageUrl(URL.createObjectURL(file)); // preview
    }
  };

  const saveVenue = async () => {
    if (
      !venueName ||
      !city ||
      !country ||
      !longitude ||
      !latitude ||
      (!imageUpload && !editData)
    ) {
      return toast.error("All fields are required");
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("venueName", venueName);
      formData.append("venueNameAr", venueNameAr);
      formData.append("city", city);
      formData.append("country", country);
      formData.append("longitude", longitude);
      formData.append("latitude", latitude);

      if (imageUpload) {
        formData.append("img", imageUpload); // backend: multer.single("img")
      }

      if (editData) {
        await venueApi.updateVenue(editData.id, formData);
        toast.success("Venue updated successfully!");
      } else {
        await venueApi.createVenue(formData);
        toast.success("Venue added successfully!");
      }

      onSaved(); // parent list refresh
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Error saving venue");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      {loading && <Loader />}
      <div className="bg-white p-6 rounded-lg w-[400px] relative">
        <h2 className="text-2xl font-semibold mb-5 text-gray-800">
          {editData ? "Edit Venue" : "Add Venue"}
        </h2>

        <input
          type="text"
          value={venueName}
          onChange={(e) => setVenueName(e.target.value)}
          className="border p-3 w-full rounded-lg mb-3"
          placeholder="Venue Name"
        />
        <input
          type="text"
          value={venueNameAr}
          onChange={(e) => setVenueNameAr(e.target.value)}
          className="border p-3 w-full rounded-lg mb-3"
          placeholder="Venue Name (Arabic)"
        />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border p-3 w-full rounded-lg mb-3"
          placeholder="City"
        />
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="border p-3 w-full rounded-lg mb-3"
          placeholder="Country"
        />
        <input
          type="number"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          className="border p-3 w-full rounded-lg mb-3"
          placeholder="Longitude"
        />

        <input
          type="number"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          className="border p-3 w-full rounded-lg mb-3"
          placeholder="Latitude"
        />

        {imageUrl && (
          <img
            src={imageUrl}
            alt="Venue"
            className="w-24 h-24 object-cover mb-3 rounded"
          />
        )}

        <input
          type="file"
          onChange={handleImageChange}
          className="border p-3 w-full rounded-lg mb-3"
          accept="image/*"
        />

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-300 rounded-lg"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={saveVenue}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg"
            disabled={loading}
          >
            {loading ? "Saving..." : editData ? "Update Venue" : "Save Venue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVenusModal;
