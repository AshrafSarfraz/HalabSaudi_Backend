import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { fireDB, storage } from "../../firebase/FirebaseConfig";
import { Timestamp, addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Loader from "../loader/Loader";
import VenuDropdown from "../dropdown/VenusDropDown";
import CategoriesDropdown from "../dropdown/CategoriesDropDown";
import CountriesDropdown from "../dropdown/CountryDropDown";
import CitiesDropdown from "../dropdown/CityDropDown";

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: {
    id: string;
    nameEng: string;
    nameArabic: string;
    descriptionEng: string;
    descriptionArabic: string;
    longitude: string;
    latitude: string;
    discount: string;
    startAt: string;
    endAt: string;
    pin: string;
    isBestSeller: string;
    isVenue: string;
    selectedVenue: string;
    selectedCategory: string;
    selectedCity: string;
    selectedCountry: string;
    status: string;
    img: string;
  } | null;
}

const ServicesModal: React.FC<ServicesModalProps> = ({ isOpen, onClose, editData }) => {
  const [nameEng, setNameEng] = useState("");
  const [nameArabic, setNameArabic] = useState("");
  const [descriptionEng, setDescriptionEng] = useState("");
  const [descriptionArabic, setDescriptionArabic] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [discount, setDiscount] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [pin, setPin] = useState("");
  const [isBestSeller, setIsBestSeller] = useState("");
  const [isVenue, setIsVenue] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedCountry, setSelectedCountry] = useState(" ");
  const [status, setStatus] = useState("");
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");



  const resetForm = () => {
    setNameEng("");
    setNameArabic("");
    setDescriptionEng("");
    setDescriptionArabic("");
    setLongitude("");
    setLatitude("");
    setDiscount("");
    setStartAt("");
    setEndAt("");
    setPin("");
    setIsBestSeller("");
    setIsVenue("");
    setSelectedVenue("");
    setSelectedCategory("");
    setSelectedCity("");
    setSelectedCountry("");
    setStatus("");
    setImageUrl("");
  };

  // Populate form fields if editing
  useEffect(() => {
    if (editData) {
      setNameEng(editData.nameEng || "");
      setNameArabic(editData.nameArabic || "");
      setDescriptionEng(editData.descriptionEng || "");
      setDescriptionArabic(editData.descriptionArabic || "");
      setLongitude(editData.longitude || "");
      setLatitude(editData.latitude || "");
      setDiscount(editData.discount || "");
      setStartAt(editData.startAt || "");
      setEndAt(editData.endAt || "");
      setPin(editData.pin || "");
      setIsBestSeller(editData.isBestSeller || "");
      setIsVenue(editData.isVenue || "");
      setSelectedVenue(editData.selectedVenue || "");
      setSelectedCategory(editData.selectedCategory || "");
      setSelectedCity(editData.selectedCity || "");
      setSelectedCountry(editData.selectedCountry || "");
      setStatus(editData.status || "");
      setImageUrl(editData.img || "");
    } else {
      resetForm()
    }
  }, [editData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageUpload(e.target.files[0]);
      setImageUrl(URL.createObjectURL(e.target.files[0])); // Preview Image
    }
  };

  const saveVenue = async () => {
    if (!nameEng || !descriptionEng || !longitude || !latitude || !selectedCategory || !selectedCity ||  (!imageUpload && !editData)) {
      return toast.error("All fields are required!");
    }

    setLoading(true);
    try {
      let url = imageUrl;

      if (imageUpload) {
        const imageRef = ref(storage, `Brands/images/${imageUpload.name}`);
        const snapshot = await uploadBytes(imageRef, imageUpload);
        url = await getDownloadURL(snapshot.ref);
      }

      const venueData = {
        nameEng,
        nameArabic,
        descriptionEng,
        descriptionArabic,
        longitude,
        latitude,
        discount,
        startAt,
        endAt,
        selectedCategory,
        pin,
        isBestSeller,
        isVenue,
        selectedCity,
        selectedCountry,
        selectedVenue,
        status,
        img: url,
        time: Timestamp.now(),
      };

      if (editData) {
        // Update existing data
        await updateDoc(doc(fireDB, "Brands", editData.id), venueData);
        toast.success("Venue updated successfully!");
      } else {
        // Add new data
        await addDoc(collection(fireDB, "Brands"), venueData);
        toast.success("Brand added successfully!");
      }
      resetForm();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error saving Brand");
    } finally {
      setLoading(false);
    }
  };

  const generatePin = () => {
    const randomPin = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit PIN
    setPin(randomPin.toString());
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        {loading && <Loader />}
        <div className="bg-white p-6 rounded-lg w-[90%] max-w-3xl h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-5 text-gray-800">
            {editData ? "Edit Service" : "Add New Service"}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <input type="text" value={nameEng} onChange={(e) => setNameEng(e.target.value)} className="border p-3 rounded-lg" placeholder="Name in English" />
            <input type="text" value={nameArabic} onChange={(e) => setNameArabic(e.target.value)} className="border p-3 rounded-lg" placeholder="Name in Arabic" />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <textarea value={descriptionEng} onChange={(e) => setDescriptionEng(e.target.value)} className="border p-3 rounded-lg h-28" placeholder="Description In English"></textarea>
            <textarea value={descriptionArabic} onChange={(e) => setDescriptionArabic(e.target.value)} className="border p-3 rounded-lg h-28" placeholder="Description In Arabic"></textarea>
          </div>

        <div className="grid grid-cols-2 gap-4 mt-3">
         <div>
         <label className="block text-gray-700 text-sm font-bold mb-2">Start Date:</label>
         <input  type="date" value={startAt}  onChange={(e) => setStartAt(e.target.value)}  className="border p-2 rounded-lg w-full" />
        </div>
         <div>
         <label className="block text-gray-700 text-sm font-bold mb-2">End Date:</label>
       <input  type="date"  value={endAt}  onChange={(e) => setEndAt(e.target.value)}  className="border p-2 rounded-lg w-full"  />
        </div>
       </div>

          <div className="grid grid-cols-3 gap-4 mt-3">
            <input type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="border p-3 rounded-lg" placeholder="Longitude" />
            <input type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="border p-3 rounded-lg" placeholder="Latitude" />
            <input type="text" value={discount} onChange={(e) => setDiscount(e.target.value)} className="border p-3 rounded-lg" placeholder="Discount" />
          </div>

 
  

          <div className="grid grid-cols-3 gap-4 mt-3">
          <CategoriesDropdown selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
          <CountriesDropdown selectedCountry={selectedCountry} onCountryChange={setSelectedCountry} />
          <CitiesDropdown selectedCity={selectedCity} onCityChange={setSelectedCity} />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-3">

          <select value={isBestSeller}   onChange={(e) =>setIsBestSeller(e.target.value)}   className="border p-3 pr-8 w-full rounded-lg" >
                 <option value="">Is Best Seller</option>
                 <option value="Yes">Yes</option>
                 <option value="No">No</option>
          </select>
          <select value={isVenue} onChange={(e) => setIsVenue(e.target.value)} className="border p-3 pr-8 w-full rounded-lg" >
                 <option value="">Is Venue</option>
                 <option value="Yes">Yes</option>
                 <option value="No">No</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="border p-3 pr-8 w-full rounded-lg" >
                 <option value="">Status</option>
                 <option value="Yes">Yes</option>
                 <option value="No">No</option>
          </select>
          <div className="flex items-center space-x-2">
                  <input type="text"  value={pin} readOnly className="border p-2 rounded-lg w-[80%] text-center" />
                  <button onClick={generatePin} className="bg-blue-500 text-white px-2 py-3 rounded-lg text-xs">Generate </button>
          </div>
          </div>
         <div className="mt-3 ">
                  {isVenue === "Yes" && ( <VenuDropdown selectedVenue={selectedVenue} onVenueChange={setSelectedVenue} /> )}
         </div>
 

          {imageUrl && <img src={imageUrl} alt="Venue" className="w-24 h-24 object-cover mt-3 rounded-lg" />}
          <input type="file" onChange={handleImageChange} className="border p-3 w-full rounded-lg mt-3" />
          <div className="flex justify-end space-x-4 mt-5">
            <button onClick={()=>{resetForm(); onClose();}} className="px-5 py-2 bg-gray-300 rounded-lg">
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

export default ServicesModal;

