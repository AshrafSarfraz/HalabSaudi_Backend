import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { fireDB} from "../../firebase/FirebaseConfig";
import { Timestamp, addDoc, collection, doc, updateDoc } from "firebase/firestore";
import Loader from "../loader/Loader";

interface CityModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: {
    id: string;
    cityName: string;
    countryName: string;
    countryCode: string;
  } | null;
}

const CityModal: React.FC<CityModalProps> = ({ isOpen, onClose, editData }) => {
  const [cityName, setCityName] = useState("");
  const [countryName, setCountryName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setCityName(editData.cityName);
      setCountryName(editData.countryName);
      setCountryCode(editData.countryCode);
    } else {
      setCityName("");
      setCountryName("");
      setCountryCode("");
    }
  }, [editData]);

// add Data
  const saveVenue = async () => {
    if (!cityName || !countryName || !countryCode) {
      return toast.error("All fields are required");
    }
    setLoading(true);
    try {
      if (editData) {
        await updateDoc(doc(fireDB, "Cities", editData.id), { cityName, countryName, countryCode });
        toast.success("City updated successfully!");
      } else {
        await addDoc(collection(fireDB, "Cities"), {
          cityName,
          countryName,
          countryCode,
          time: Timestamp.now(),
        });
        toast.success("City added successfully!");
      }

      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error saving City");
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
            {editData ? "Edit Cities" : "Add Cities"}
          </h2>

          <input
            type="text"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            className="border p-3 w-full rounded-lg mb-3"
            placeholder="City Name"
          />
           <input
            type="text"
            value={countryName}
            onChange={(e) => setCountryName(e.target.value)}
            className="border p-3 w-full rounded-lg mb-3"
            placeholder="Country Name"
          />

<input
            type="text"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="border p-3 w-full rounded-lg mb-3"
            placeholder="Country Code"
          />

       
   

          <div className="flex justify-end space-x-4">
            <button onClick={onClose} className="px-5 py-2 bg-gray-300 rounded-lg">
              Cancel
            </button>
            <button onClick={saveVenue} className="px-5 py-2 bg-blue-600 text-white rounded-lg" disabled={loading}>
              {loading ? "Saving..." : editData ? "Update City" : "Save City" }
              </button>
          </div>
        </div>
      </div>
    )
  );
};

export default CityModal;
