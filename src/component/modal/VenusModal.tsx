import React, { useState } from "react";
import { toast } from "react-toastify";
import { fireDB, storage } from "../../firebase/FirebaseConfig"; // Import storage
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Loader from "../loader/Loader";

interface VenusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddVenusModal: React.FC<VenusModalProps> = ({ isOpen, onClose }) => {
  const [venueName, setVenueName] = useState("");
  const [status, setStatus] = useState("Active");
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Image change handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageUpload(e.target.files[0]);
    }
  };

  // Function to save venue
  const saveVenue = async () => {
    if (!venueName || !imageUpload || !status) {
      return toast.error("All fields are required");
    }

    setLoading(true);
    try {
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `Venue/images/${imageUpload.name}`);
      const snapshot = await uploadBytes(imageRef, imageUpload);
      const url = await getDownloadURL(snapshot.ref);

      // Save venue data with image URL
      const venue = {
        venueName,
        status,
        img: url, // Image URL stored in Firestore
        time: Timestamp.now(),
      };

      await addDoc(collection(fireDB, "Venues"), venue);

      toast.success("Successfully added!");
      setVenueName("");
      setImageUpload(null);
      setStatus("Active");
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        {loading && <Loader />}
        <div className="bg-white p-6 rounded-lg w-[400px]">
          <h2 className="text-2xl font-semibold mb-5 text-gray-800">Add Venue</h2>
          <input
            type="text"
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
            className="border p-3 w-full rounded-lg mb-3"
            placeholder="Name"
          />
          <input
            type="file"
            onChange={handleImageChange}
            className="border p-3 w-full rounded-lg mb-3"
          />

          {/* Status Dropdown */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-3 w-full rounded-lg mb-3"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={saveVenue}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Venue"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AddVenusModal;
