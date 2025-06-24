import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fireDB, storage } from "../../firebase/FirebaseConfig";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import CategoriesDropdown from "../../component/dropdown/CategoriesDropDown";
import Back from '../../assets/icon/Back.png'



declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}



const AddBrandScreen: React.FC = () => {
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
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTimings, setShowTimings] = useState(false);

  useEffect(() => {
    if (showTimings === true) {
      window.ReactNativeWebView?.postMessage("HIDE_HEADER");
    } else {
      window.ReactNativeWebView?.postMessage("SHOW_HEADER");
    }
  }, [showTimings]);
  // Modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const handleTimingChange = (day: string, value: string) => {
    setTimings((prev) => ({ ...prev, [day]: value }));
  };

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

  const saveVenue = async () => {
    if (
      !nameEng ||
      !descriptionEng ||
      !discount||
      !address ||
      !PhoneNumber ||
      !selectedCategory ||
      !imageUpload
    ) {
      return toast.error("All required fields must be filled!");
    }

    setLoading(true);
    try {
      let uploadedImageUrl = imageUrl;
      let uploadedPdfUrl = pdfUrl;

      if (imageUpload) {
        const imageRef = ref(storage, `Brands/images/${imageUpload.name}`);
        const snapshot = await uploadBytes(imageRef, imageUpload);
        uploadedImageUrl = await getDownloadURL(snapshot.ref);
      }

      if (pdfFile) {
        const pdfRef = ref(storage, `Brands/pdfs/${pdfFile.name}`);
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

      await addDoc(collection(fireDB, "Brands"), venueData);
      toast.success("Service added successfully!");

      resetForm();

      setShowSuccessModal(true); // Show modal after success

    } catch (error) {
      console.error(error);
      toast.error("Error saving service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-7 px-1 bg-white mx-auto relative">
      {loading && (
        <div className="fixed inset-0  flex justify-center items-center text-white text-xl z-40">
        <span   className="animate-spin rounded-full h-12 w-12 border-green-800 border-4 border-t-transparent"></span>
        </div>
      )}
     {
     showTimings === false ? (
      <div>
        {/* Brand Info */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Brand Name (En)</label>
            <input className="border p-3 rounded-lg placeholder:text-[13px] w-[100%] "
             placeholder="e.g. West Walk" value={nameEng} onChange={(e) => setNameEng(e.target.value)} />
          </div>
    
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Brand Name (Ar)</label>
            <input        className="border p-3 rounded-lg placeholder:text-[13px] w-[100%]"
              placeholder="مثال: ويست ووك"  value={nameArabic}   onChange={(e) => setNameArabic(e.target.value)} />
          </div>
    
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Discount (%)</label>
            <input
              placeholder="e.g. 15"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="border p-3 rounded-lg placeholder:text-[13px] w-[100%] "
            />
          </div>
        </div>
    
        {/* Descriptions */}
        <div className="grid grid-cols-1 gap-4 mt-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Description (En)</label>
            <textarea
              placeholder="e.g. A fine dining restaurant offering Italian and Arabic food"
              value={descriptionEng}
              onChange={(e) => setDescriptionEng(e.target.value)}
              className="border p-3 rounded-lg placeholder:text-[13px] w-[100%] "
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Description (Ar)</label>
            <textarea
              placeholder="مثال: مطعم فاخر يقدم المأكولات الإيطالية والعربية"
              value={descriptionArabic}
              onChange={(e) => setDescriptionArabic(e.target.value)}
              className="border p-3 rounded-lg placeholder:text-[13px] w-[100%]  "
            />
          </div>
        </div>
    
        {/* Contact + Location */}
        <div className="grid grid-cols-1 gap-4 mt-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
            <input
              placeholder="Phone Number"
              value={PhoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border p-3 rounded-lg placeholder:text-[13px] w-[100%] "
            />
          </div>
    
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Address</label>
            <input
              placeholder="e.g. West Walk, Al Sadd Street, Doha"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border p-3 rounded-lg placeholder:text-[13px] w-[100%] "
            />
          </div>
    
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Latitude (optional)</label>
            <input
              placeholder="e.g. 25.276987"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="border p-3 rounded-lg placeholder:text-[13px] w-[100%] "
            />
          </div>
    
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Longitude (optional) </label>
            <input
              placeholder="e.g. 25.276987"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="border p-3 rounded-lg placeholder:text-[13px] w-[100%] "
            />
          </div>
        </div>
    
        {/* Dropdown */}

      <div className="h-12 grid grid-cols-1 gap-4 mt-4">
        <CategoriesDropdown
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      <div className="mt-5">
        {pdfFile || pdfUrl ? (
          <div className="mb-4 bg-gray-100 p-3 rounded-lg">
            <span>
              {pdfFile?.name ||
                decodeURIComponent(pdfUrl.split("/").pop()?.split("?")[0] || "")}
            </span>
          </div>
        ) : null}

        <label
       
          htmlFor="pdf-upload"
          className="cursor-pointer text-center bg-blue-500 text-white bg-green-600  font-bold   px-6 py-2.5 w-[100%] rounded-lg inline-block"
        >
          Choose Menu ( PDF )
        </label>
        <input
          type="file"
          id="pdf-upload"
          className="hidden"
          onChange={handlePdfChange}
        />
      </div>


      {imageUrl && (
        <img
          src={imageUrl}
          alt="Preview"
          className="w-24 h-24 object-cover mt-4 rounded-lg"
        />
      )}
      <div className="mt-3">
        <label
          htmlFor="image-upload"
          className="cursor-pointer bg-blue-500 text-center text-white  font-bold bg-green-600   px-5 py-2.5 w-[100%] rounded-lg inline-block"
        >
          Choose Brand Logo
        </label>
        <input
          type="file"
          id="image-upload"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
      <button
        style={{ backgroundColor: "#005029" }}
        onClick={()=>setShowTimings(true)}
        className="w-[100%] mt-5 mb-10 bg-blue-600 text-white   font-bold   px-6 py-2.5 rounded-lg"
      >
        Continue
      </button>
        
        </div>
      ):
      (
        <div>
      <div className="grid grid-cols-1 gap-4 mt-1">
        <p className="text-lg font-semibold flex items-center gap-2">
        <button  onClick={() => setShowTimings(false)}  className="p-1 rounded hover:bg-gray-200" > <img src={Back} alt="Back"className="w-5 h-5"/> </button>
        Working Hours
        </p>

  {Object.entries(timings).map(([day, value]) => (
    <div key={day}>
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {day.charAt(0).toUpperCase() + day.slice(1)}
      </label>
      <input
        placeholder={`e.g. 10:00 AM - 9:00 PM`}
        value={value}
        onChange={(e) => handleTimingChange(day, e.target.value)}
        className="border p-3 rounded-lg w-full placeholder:text-[13px]"
      />
    </div>
  ))}
      </div>
      <button
        style={{ backgroundColor: "#005029" }}
        onClick={saveVenue}
        className="w-[100%] mt-5 bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        Submit
      </button>

        </div>
      )
    
     }



      

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto text-center">
            <h2 className="text-xl font-semibold mb-4">Data Added Successfully!</h2>
            <p className="mb-6">Our company will contact you soon.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-green-800 text-white px-8 py-3 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBrandScreen;
