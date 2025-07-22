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
  editData?: any;
}

const ServicesModal: React.FC<ServicesModalProps> = ({ isOpen, onClose, editData }) => {
  const [nameEng, setNameEng] = useState("");
  const [nameArabic, setNameArabic] = useState("");
  const [discount, setDiscount] = useState("");
  const [descriptionEng, setDescriptionEng] = useState("");
  const [descriptionArabic, setDescriptionArabic] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [address, setAddress] = useState("");

  const [timings, setTimings] = useState({
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
  });

  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [pin, setPin] = useState("");
  const [isBestSeller, setIsBestSeller] = useState("");
  const [isVenue, setIsVenue] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [status, setStatus] = useState("No");
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState(editData?.pdfUrl || "");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setNameEng("");
    setNameArabic("");
    setDescriptionEng("");
    setDescriptionArabic("");
    setPhoneNumber("");
    setLongitude("");
    setLatitude("");
    setAddress("");
    setDiscount("");
    setTimings({
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    });
    setStartAt("");
    setEndAt("");
    setPin("");
    setIsBestSeller("");
    setIsVenue("");
    setSelectedVenue("");
    setSelectedCategory("");
    setSelectedCity("");
    setSelectedCountry("");
    setStatus("No");
    setImageUpload(null);
    setImageUrl("");
    setPdfFile(null);
    setPdfUrl("");
  };

  useEffect(() => {
    if (editData) {
      setNameEng(editData.nameEng || "");
      setNameArabic(editData.nameArabic || "");
      setDiscount(editData.discount || "");
      setDescriptionEng(editData.descriptionEng || "");
      setDescriptionArabic(editData.descriptionArabic || "");
      setPhoneNumber(editData.PhoneNumber || "");
      setLongitude(editData.longitude || "");
      setLatitude(editData.latitude || "");
      setAddress(editData.address || "");
      setTimings(editData.timings || {
        monday: "",
        tuesday: "",
        wednesday: "",
        thursday: "",
        friday: "",
        saturday: "",
        sunday: "",
      });
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
      setPdfUrl(editData.pdfUrl || "");
    } else {
      resetForm();
    }
  }, [editData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageUpload(e.target.files[0]);
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleTimingChange = (day: string, value: string) => {
    setTimings((prev) => ({ ...prev, [day]: value }));
  };

  const generatePin = () => {
    const randomPin = Math.floor(100000 + Math.random() * 900000);
    setPin(randomPin.toString());
  };

  const saveVenue = async () => {
    if (!nameEng || !nameArabic || !descriptionEng || !descriptionArabic || !longitude || !latitude ||
      !address || !PhoneNumber || !selectedCategory || !selectedCity || (!imageUpload && !editData)) {
      return toast.error("All fields are required!");
    }

    setLoading(true);
    try {
      let uploadedImageUrl = imageUrl;
      let uploadedPdfUrl = pdfUrl;

      if (imageUpload) {
        const imageRef = ref(storage, `H-Brands/images/${imageUpload.name}`);
        const snapshot = await uploadBytes(imageRef, imageUpload);
        uploadedImageUrl = await getDownloadURL(snapshot.ref);
      }

      if (pdfFile) {
        const pdfRef = ref(storage, `H-Brands/pdfs/${pdfFile.name}`);
        const pdfSnapshot = await uploadBytes(pdfRef, pdfFile);
        uploadedPdfUrl = await getDownloadURL(pdfSnapshot.ref);
      }

      const venueData = {
        nameEng,
        nameArabic,
        discount,
        descriptionEng,
        descriptionArabic,
        PhoneNumber,
        longitude,
        latitude,
        address,
           // new
        timings,
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
        img: uploadedImageUrl,
        pdfUrl: uploadedPdfUrl,
        time: Timestamp.now(),
      };

      if (editData) {
        await updateDoc(doc(fireDB, "H-Brands", editData.id), venueData);
        toast.success("Service updated successfully!");
      } else {
        await addDoc(collection(fireDB, "H-Brands"), venueData);
        toast.success("Service added successfully!");
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error saving service");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center pt-10 z-50">
      {loading && <Loader />}
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-5xl h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-5">{editData ? "Edit Brand Details" : "Add New Brand"}</h2>

        <div className="grid grid-cols-3 gap-4">
          <input placeholder="Name in English" value={nameEng} onChange={e => setNameEng(e.target.value)} className="border p-3 rounded-lg" />
          <input placeholder="Name in Arabic" value={nameArabic} onChange={e => setNameArabic(e.target.value)} className="border p-3 rounded-lg" />
          <input placeholder="Discount" value={discount} onChange={e => setDiscount(e.target.value)} className="border p-3 rounded-lg" />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-3">
          <textarea placeholder="Description In English" value={descriptionEng} onChange={e => setDescriptionEng(e.target.value)} className="border p-3 rounded-lg" />
          <textarea placeholder="Description In Arabic" value={descriptionArabic} onChange={e => setDescriptionArabic(e.target.value)} className="border p-3 rounded-lg" />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-3">
          <input placeholder="Phone Number" value={PhoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="border p-3 rounded-lg" />
          <input placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} className="border p-3 rounded-lg" />
          <input placeholder="Latitude" value={latitude} onChange={e => setLatitude(e.target.value)} className="border p-3 rounded-lg" />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-3">
          <input placeholder="Longitude" value={longitude} onChange={e => setLongitude(e.target.value)} className="border p-3 rounded-lg" />
          <input value={pin} readOnly className="border p-3 rounded-lg" placeholder="Generate Pin" />
          <button onClick={generatePin} className="bg-blue-600 text-white py-3 rounded-lg text-sm">Generate</button>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-3">
          <CategoriesDropdown selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
          <CountriesDropdown selectedCountry={selectedCountry} onCountryChange={setSelectedCountry} />
          <CitiesDropdown selectedCity={selectedCity} onCityChange={setSelectedCity} />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-3">
          <select value={isBestSeller} onChange={e => setIsBestSeller(e.target.value)} className="border p-3 rounded-lg text-sm">
            <option value="">Is Best Seller</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <select value={status} onChange={e => setStatus(e.target.value)} className="border p-3 rounded-lg text-sm">
            <option value="">Status</option>
            <option value="Inactive">Inactive</option>
            <option value="Active">Active</option>
          </select>
          <select value={isVenue} onChange={e => setIsVenue(e.target.value)} className="border p-3 rounded-lg text-sm">
            <option value="">Is Venue</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {isVenue === "Yes" && <div className="mt-3"><VenuDropdown selectedVenue={selectedVenue} onVenueChange={setSelectedVenue} /></div>}

        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <label className="text-sm">Contract Start Date</label>
            <input type="date" value={startAt} onChange={e => setStartAt(e.target.value)} className="border p-2 rounded-lg w-full" />
          </div>
          <div>
            <label className="text-sm">Contract End Date</label>
            <input type="date" value={endAt} onChange={e => setEndAt(e.target.value)} className="border p-2 rounded-lg w-full" />
          </div>
        </div>

        {/* Timings input */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {Object.entries(timings).map(([day, value]) => (
            <div key={day}>
              <label className="text-sm capitalize">{day}</label>
              <input
                placeholder="e.g. 10:00 AM - 9:00 PM"
                value={value}
                onChange={(e) => handleTimingChange(day, e.target.value)}
                className="border p-2 rounded-lg w-full text-sm"
              />
            </div>
          ))}
        </div>

        {/* PDF and Image Upload */}
        <div className="mt-5">
          {pdfFile || pdfUrl ? (
            <div className="mb-4 bg-gray-100 p-3 rounded-lg">
              <span>{pdfFile?.name || decodeURIComponent(pdfUrl.split("/").pop()?.split("?")[0] || "")}</span>
            </div>
          ) : null}
          <label htmlFor="pdf-upload" className="cursor-pointer bg-blue-500 text-white px-6 py-2 rounded-lg inline-block">Choose Menu PDF</label>
          <input type="file" id="pdf-upload" className="hidden" onChange={handlePdfChange} />
        </div>

        {imageUrl && <img src={imageUrl} alt="Preview" className="w-24 h-24 object-cover mt-4 rounded-lg" />}
        <div className="mt-3">
          <label htmlFor="image-upload" className="cursor-pointer bg-blue-500 text-white px-5 py-2 rounded-lg inline-block">Choose Logo Image</label>
          <input type="file" id="image-upload" className="hidden" onChange={handleImageChange} />
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-3">Cancel</button>
          <button onClick={saveVenue} className="bg-blue-600 text-white px-6 py-2 rounded-lg">{editData ? "Update" : "Save"}</button>
        </div>
      </div>
    </div>
  );
};

export default ServicesModal;
