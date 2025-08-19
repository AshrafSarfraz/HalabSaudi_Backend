import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { fireDB, storage } from "../../firebase/FirebaseConfig";
import { Timestamp, addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Loader from "../loader/Loader";

interface VenusModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: {
    id: string;
    venueName: string;
    venueNameAr:string;
    city: string;
    country: string;
    img: string;
  } | null;
}

const AddVenusModal: React.FC<VenusModalProps> = ({ isOpen, onClose, editData }) => {
  const [venueName, setVenueName] = useState("");
  const [venueNameAr, setVenueNameAr] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (editData) {
      setVenueName(editData.venueName);
      setVenueNameAr(editData.venueNameAr);
      setCity(editData.city);
      setCountry(editData.country);
      setImageUrl(editData.img);
    } else {
      setVenueName("");
      setVenueNameAr("");
      setCity("");
      setCountry("");
      setImageUrl("");
    }
  }, [editData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageUpload(e.target.files[0]);
      setImageUrl(URL.createObjectURL(e.target.files[0])); // Show new preview
    }
  };

  const saveVenue = async () => {
    if (!venueName || !city || !country || (!imageUpload && !editData)) {
      return toast.error("All fields are required");
    }

    setLoading(true);

    try {
      let url = imageUrl;

      if (imageUpload) {
        const imageRef = ref(storage, `H-Venue/images/${imageUpload.name}`);
        const snapshot = await uploadBytes(imageRef, imageUpload);
        url = await getDownloadURL(snapshot.ref);
      }

      if (editData) {
        await updateDoc(doc(fireDB, "H-Venues", editData.id), { venueName, venueNameAr, city,country, img: url });
        toast.success("Venue updated successfully!");
      } else {
        await addDoc(collection(fireDB, "H-Venues"), {
          venueName,
          venueNameAr,
          city,
          country,
          img: url,
          time: Timestamp.now(),
        });
        toast.success("Venue added successfully!");
      }

      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error saving venue");
    } finally {
      setLoading(false);
    }
  };

  return (
    isOpen && (
      <div className="fixed  inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        {loading && <Loader />}
        <div className="bg-white p-6 rounded-lg w-[400px]">
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
          {imageUrl && (
            <img src={imageUrl} alt="Venue" className="w-24 h-24 object-cover mb-3 rounded" />
          )}

          <input
            type="file"
            onChange={handleImageChange}
            className="border p-3 w-full rounded-lg mb-3"
          />

         

          <div className="flex justify-end space-x-4">
            <button onClick={onClose} className="px-5 py-2 bg-gray-300 rounded-lg">
              Cancel
            </button>
            <button onClick={saveVenue} className="px-5 py-2 bg-blue-600 text-white rounded-lg" disabled={loading}>
              {loading ? "Saving..." : editData ? "Update Venue" : "Save Venue"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AddVenusModal;
