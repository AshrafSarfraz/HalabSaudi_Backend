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
    PhoneNumber: string;
    longitude: string;
    latitude: string;
    address: string;
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
    pdfUrl: string;
  } | null;
}

const ServicesModal: React.FC<ServicesModalProps> = ({ isOpen, onClose, editData }) => {
  const [nameEng, setNameEng] = useState("");
  const [nameArabic, setNameArabic] = useState("");
  const [descriptionEng, setDescriptionEng] = useState("");
  const [descriptionArabic, setDescriptionArabic] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
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
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [status, setStatus] = useState("");
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
    setImageUpload(null);
    setImageUrl("");
    setPdfFile(null);
    setPdfUrl("");
  };

  useEffect(() => {
    if (editData) {
      setNameEng(editData.nameEng || "");
      setNameArabic(editData.nameArabic || "");
      setDescriptionEng(editData.descriptionEng || "");
      setDescriptionArabic(editData.descriptionArabic || "");
      setPhoneNumber(editData.PhoneNumber || "");
      setLongitude(editData.longitude || "");
      setLatitude(editData.latitude || "");
      setAddress(editData.address || "");
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

  const generatePin = () => {
    const randomPin = Math.floor(100000 + Math.random() * 900000);
    setPin(randomPin.toString());
  };

  const saveVenue = async () => {
    if (!nameEng || !descriptionEng || !longitude || !latitude || !selectedCategory || !selectedCity || (!imageUpload && !editData)) {
      return toast.error("All fields are required!");
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
        descriptionEng,
        descriptionArabic,
        PhoneNumber,
        address,
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
        img: uploadedImageUrl,
        pdfUrl: uploadedPdfUrl,
        time: Timestamp.now(),
      };

      if (editData) {
        await updateDoc(doc(fireDB, "Brands", editData.id), venueData);
        toast.success("Service updated successfully!");
      } else {
        await addDoc(collection(fireDB, "Brands"), venueData);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      {loading && <Loader />}
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-3xl h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-5">{editData ? "Edit Service" : "Add New Service"}</h2>

        <div className="grid grid-cols-3 gap-4">
          <input placeholder="Name in English" value={nameEng} onChange={e => setNameEng(e.target.value)} className="border p-3 rounded-lg text-sm" />
          <input placeholder="Name in Arabic" value={nameArabic} onChange={e => setNameArabic(e.target.value)} className="border p-3 rounded-lg text-sm" />
          <input placeholder="Discount" value={discount} onChange={e => setDiscount(e.target.value)} className="border p-3 rounded-lg text-sm" />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-3">
          <textarea placeholder="Description In English" value={descriptionEng} onChange={e => setDescriptionEng(e.target.value)} className="border p-3 rounded-lg h-28 text-sm" />
          <textarea placeholder="Description In Arabic" value={descriptionArabic} onChange={e => setDescriptionArabic(e.target.value)} className="border p-3 rounded-lg h-28 text-sm" />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-3">
          <input placeholder="Latitude" value={latitude} onChange={e => setLatitude(e.target.value)} className="border p-3 rounded-lg text-sm" />
          <input placeholder="Longitude" value={longitude} onChange={e => setLongitude(e.target.value)} className="border p-3 rounded-lg text-sm" />
          <input placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} className="border p-3 rounded-lg text-sm" />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-3">
          <input placeholder="Phone Number" value={PhoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="border p-3 rounded-lg text-sm" />
          <input value={pin} readOnly className="border p-3 rounded-lg text-sm text-center" placeholder="Generate Pin" />
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
          <select value={isVenue} onChange={e => setIsVenue(e.target.value)} className="border p-3 rounded-lg text-sm">
            <option value="">Is Venue</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <select value={status} onChange={e => setStatus(e.target.value)} className="border p-3 rounded-lg text-sm">
            <option value="">Status</option>
            <option value="Yes">Active</option>
            <option value="No">Inactive</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-3">
          <input type="date" value={startAt} onChange={e => setStartAt(e.target.value)} className="border p-2 rounded-lg text-sm" />
          <input type="date" value={endAt} onChange={e => setEndAt(e.target.value)} className="border p-2 rounded-lg text-sm" />
        </div>

        {isVenue === "Yes" && <div className="mt-3"><VenuDropdown selectedVenue={selectedVenue} onVenueChange={setSelectedVenue} /></div>}

        <div className="mt-5">
          {pdfFile || pdfUrl ? (
            <div className="mb-4 bg-gray-100 p-3 rounded-lg">
              <span>{pdfFile?.name || decodeURIComponent(pdfUrl.split("/").pop()?.split("?")[0] || "")}</span>
            </div>
          ) : null}

          <label htmlFor="pdf-upload" className="cursor-pointer bg-blue-500 text-white px-5 py-2 rounded-lg inline-block">Choose Menu PDF</label>
          <input type="file" id="pdf-upload" className="hidden" onChange={handlePdfChange} />
        </div>

        {imageUrl && <img src={imageUrl} alt="Preview" className="w-24 h-24 object-cover mt-4 rounded-lg" />}
        <div className="mt-3">
          <label htmlFor="image-upload" className="cursor-pointer bg-green-500 text-white px-5 py-2 rounded-lg inline-block">Choose Image</label>
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



// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import { fireDB, storage } from "../../firebase/FirebaseConfig";
// import { Timestamp, addDoc, collection, doc, updateDoc } from "firebase/firestore";
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// import Loader from "../loader/Loader";
// import VenuDropdown from "../dropdown/VenusDropDown";
// import CategoriesDropdown from "../dropdown/CategoriesDropDown";
// import CountriesDropdown from "../dropdown/CountryDropDown";
// import CitiesDropdown from "../dropdown/CityDropDown";

// interface ServicesModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   editData?: {
//     id: string;
//     nameEng: string;
//     nameArabic: string;
//     descriptionEng: string;
//     descriptionArabic: string;
//     PhoneNumber: string;
//     longitude: string;
//     latitude: string;
//     address:string;
//     discount: string;
//     startAt: string;
//     endAt: string;
//     pin: string;
//     isBestSeller: string;
//     isVenue: string;
//     selectedVenue: string;
//     selectedCategory: string;
//     selectedCity: string;
//     selectedCountry: string;
//     status: string;
//     img: string;
//     pdfUrl: string; // Add PDF URL
//   } | null;
// }

// const ServicesModal: React.FC<ServicesModalProps> = ({ isOpen, onClose, editData }) => {
//   const [nameEng, setNameEng] = useState("");
//   const [nameArabic, setNameArabic] = useState("");
//   const [descriptionEng, setDescriptionEng] = useState("");
//   const [descriptionArabic, setDescriptionArabic] = useState("");
//   const [PhoneNumber, setPhoneNumber] = useState("");
//   const [address, setAddress] = useState("");
//   const [longitude, setLongitude] = useState("");
//   const [latitude, setLatitude] = useState("");
//   const [discount, setDiscount] = useState("");
//   const [startAt, setStartAt] = useState("");
//   const [endAt, setEndAt] = useState("");
//   const [pin, setPin] = useState("");
//   const [isBestSeller, setIsBestSeller] = useState("");
//   const [isVenue, setIsVenue] = useState("");
//   const [selectedVenue, setSelectedVenue] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedCity, setSelectedCity] = useState("")
//   const [selectedCountry, setSelectedCountry] = useState(" ");
//   const [status, setStatus] = useState("");
//   const [imageUpload, setImageUpload] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [imageUrl, setImageUrl] = useState("");
//   const [pdfFile, setPdfFile] = useState<File | null>(null);
//   const [pdfUrl, setPdfUrl] = useState(editData?.pdfUrl || ""); // Set existing PDF URL if editing

//   const resetForm = () => {
//     setNameEng("");
//     setNameArabic("");
//     setDescriptionEng("");
//     setDescriptionArabic("");
//     setPhoneNumber("");
//     setLongitude("");
//     setLatitude("");
//     setAddress("");
//     setDiscount("");
//     setStartAt("");
//     setEndAt("");
//     setPin("");
//     setIsBestSeller("");
//     setIsVenue("");
//     setSelectedVenue("");
//     setSelectedCategory("");
//     setSelectedCity("");
//     setSelectedCountry("");
//     setStatus("");
//     setImageUrl("");
//     setPdfFile(null);
//     setPdfUrl(""); // Reset PDF URL when form is reset
//   };

//   useEffect(() => {
//     if (editData) {
//       setNameEng(editData.nameEng || "");
//       setNameArabic(editData.nameArabic || "");
//       setDescriptionEng(editData.descriptionEng || "");
//       setDescriptionArabic(editData.descriptionArabic || "");
//       setPhoneNumber(editData.PhoneNumber || "");
//       setLongitude(editData.longitude || "");
//       setLatitude(editData.latitude || "");
//       setAddress(editData.address || "");
//       setDiscount(editData.discount || "");
//       setStartAt(editData.startAt || "");
//       setEndAt(editData.endAt || "");
//       setPin(editData.pin || "");
//       setIsBestSeller(editData.isBestSeller || "");
//       setIsVenue(editData.isVenue || "");
//       setSelectedVenue(editData.selectedVenue || "");
//       setSelectedCategory(editData.selectedCategory || "");
//       setSelectedCity(editData.selectedCity || "");
//       setSelectedCountry(editData.selectedCountry || "");
//       setStatus(editData.status || "");
//       setImageUrl(editData.img || "");
//       setPdfUrl(editData.pdfUrl || ""); // Set existing PDF URL
//     } else {
//       resetForm();
//     }
//   }, [editData]);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setImageUpload(e.target.files[0]);
//       setImageUrl(URL.createObjectURL(e.target.files[0])); // Preview Image
//     }
//   };

//   const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setPdfFile(e.target.files[0]);
//     }
//   };

//   const saveVenue = async () => {
//     if (!nameEng || !descriptionEng || !longitude || !latitude || !selectedCategory || !selectedCity || (!imageUpload && !editData)) {
//       return toast.error("All fields are required!");
//     }

//     setLoading(true);
//     try {
//       let imageUrl = "";
//       let pdfUrl = editData?.pdfUrl || "";

//       // Upload image if new image is selected
//       if (imageUpload) {
//         const imageRef = ref(storage, `Brands/images/${imageUpload.name}`);
//         const snapshot = await uploadBytes(imageRef, imageUpload);
//         imageUrl = await getDownloadURL(snapshot.ref);
//       }

//       // Upload PDF if new PDF is selected
//       if (pdfFile) {
//         const pdfRef = ref(storage, `Brands/pdfs/${pdfFile.name}`);
//         const pdfSnapshot = await uploadBytes(pdfRef, pdfFile);
//         pdfUrl = await getDownloadURL(pdfSnapshot.ref);
//       }

//       const venueData = {
//         nameEng,
//         nameArabic,
//         descriptionEng,
//         descriptionArabic,
//         PhoneNumber,
//         address,
//         longitude,
//         latitude,
//         discount,
//         startAt,
//         endAt,
//         selectedCategory,
//         pin,
//         isBestSeller,
//         isVenue,
//         selectedCity,
//         selectedCountry,
//         selectedVenue,
//         status,
//         img: imageUrl,
//         pdfUrl, // Store the PDF URL
//         time: Timestamp.now(),
//       };

//       if (editData) {
//         await updateDoc(doc(fireDB, "Brands", editData.id), venueData);
//         toast.success("Venue updated successfully!");
//       } else {
//         await addDoc(collection(fireDB, "Brands"), venueData);
//         toast.success("Brand added successfully!");
//       }

//       resetForm();
//       onClose();
//     } catch (error) {
//       console.error(error);
//       toast.error("Error saving Brand");
//     } finally {
//       setLoading(false);
//     }
//   };
//     const generatePin = () => {
//     const randomPin = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit PIN
//     setPin(randomPin.toString());
//   };

//   return (
//           isOpen && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//               {loading && <Loader />}
//               <div className="bg-white p-6 rounded-lg w-[90%] max-w-3xl h-[80vh] overflow-y-auto">
//                 <h2 className="text-2xl font-semibold mb-5 text-gray-800">
//                   {editData ? "Edit Service" : "Add New Service"}
//                 </h2>
      
//                 <div className="grid grid-cols-3 gap-4">
//                   <input type="text" value={nameEng} onChange={(e) => setNameEng(e.target.value)} className="border p-3 rounded-lg placeholder:text-[13px] " placeholder="Name in English" />
//                   <input type="text" value={nameArabic} onChange={(e) => setNameArabic(e.target.value)} className="border p-3 rounded-lg placeholder:text-[13px]" placeholder="Name in Arabic" />
//                   <input type="text" value={discount} onChange={(e) => setDiscount(e.target.value)} className="border p-3 rounded-lg placeholder:text-[13px]" placeholder="Discount" />
              
//                 </div>
      
//                 <div className="grid grid-cols-2 gap-4 mt-3">
//                   <textarea value={descriptionEng} onChange={(e) => setDescriptionEng(e.target.value)} className="border p-3 rounded-lg h-28 placeholder:text-[13px] " placeholder="Description In English"></textarea>
//                   <textarea value={descriptionArabic} onChange={(e) => setDescriptionArabic(e.target.value)} className="border p-3 rounded-lg h-28 placeholder:text-[13px]" placeholder="Description In Arabic"></textarea>
//                 </div>
      
//                 <div className="grid grid-cols-3 gap-4 mt-3">
//                  <input type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="border p-3 rounded-lg placeholder:text-[13px] " placeholder="Latitude" />
//                  <input type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="border p-3 rounded-lg  placeholder:text-[13px]" placeholder="Longitude" />
//                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="border p-3 rounded-lg placeholder:text-[13px]" placeholder="Address" />
//                  </div>
      
//                 <div className="grid grid-cols-3 gap-4 mt-3">
//                 <input type="text" value={PhoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="border p-3 rounded-lg placeholder:text-[13px] " placeholder="e.g. +971501234567" /> 
//                         <input type="text"  value={pin} readOnly className="border p-2 rounded-lg w-[100%] text-center placeholder:text-[13px]" placeholder="Generate Pin"  />
//                         <button onClick={generatePin} className="bg-blue-500 text-white px-2 py-3 rounded-lg text-xs">Generate </button>
//                 </div>
      
//                 <div className="grid grid-cols-3 gap-4 mt-3">
//                 <CategoriesDropdown selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
//                 <CountriesDropdown selectedCountry={selectedCountry} onCountryChange={setSelectedCountry} />
//                 <CitiesDropdown selectedCity={selectedCity} onCityChange={setSelectedCity} />
//                 </div>
//                 <div className="grid grid-cols-3 gap-4 mt-3">
      
//                 <select value={isBestSeller}   onChange={(e) =>setIsBestSeller(e.target.value)}   className="border p-3 pr-8 w-full rounded-lg text-[13px] " >
//                        <option value="">Is Best Seller</option>
//                        <option value="Yes">Yes</option>
//                        <option value="No">No</option>
//                 </select>
//                 <select value={isVenue} onChange={(e) => setIsVenue(e.target.value)} className="border p-3 pr-8 w-full rounded-lg text-[13px] " >
//                        <option value="">Is Venue</option>
//                        <option value="Yes">Yes</option>
//                        <option value="No">No</option>
//                 </select>
//                 <select value={status} onChange={(e) => setStatus(e.target.value)} className="border p-3 pr-8 w-full rounded-lg text-[13px] " >
//                        <option value="">Is Status Active </option>
//                        <option value="Yes">Yes</option>
//                        <option value="No">No</option>
//                 </select> 
//                 </div>
      
//                 <div className="grid grid-cols-2 gap-4 mt-3">
//                <div>
//                <label className="block text-gray-700 text-sm font-bold mb-2  text-[13px]">Start Date:</label>
//                <input  type="date" value={startAt}  onChange={(e) => setStartAt(e.target.value)}  className="border p-2 rounded-lg w-full text-[13px] " />
//               </div>
//                <div>
//                <label className="block text-gray-700 text-sm font-bold mb-2 text-[13px] ">End Date:</label>
//              <input  type="date"  value={endAt}  onChange={(e) => setEndAt(e.target.value)}  className="border p-2 rounded-lg w-full text-[13px] "  />
//               </div>
//              </div>
//                <div className="mt-3 ">
//                         {isVenue === "Yes" && ( <VenuDropdown selectedVenue={selectedVenue} onVenueChange={setSelectedVenue} /> )}
//                </div>

               
//              <div className="  mt-5  ">
//              <div className="  mt-5  ">
//             {/* Custom Label for PDF Input */}
//             {(pdfFile || pdfUrl) && (  <div className="mb-5 mt-5 bg-gray-100 rounded-lg w-[100%] p-3">
//               <span>  {pdfFile && 'name' in pdfFile ? pdfFile.name: typeof pdfUrl === 'string'? decodeURIComponent(pdfUrl.split('/').pop()?.split('?')[0] || '').split('/').pop(): 'Unknown File'}
//               </span>
//             </div>)}
//             <label htmlFor="pdf-upload" className="cursor-pointer bg-blue-500 text-white px-11 py-3 rounded-lg">
//               Choose Menu PDF
//             </label> 
//             <input type="file" id="pdf-upload"  onChange={handlePdfChange} className="hidden"   />
//             </div>
//            {imageUrl && ( <img src={imageUrl} alt="Venue" className="w-24 h-24 object-cover mt-6  rounded-lg" />)}
//            <div className="mt-6">
//           <label htmlFor="image-upload" className="cursor-pointer bg-blue-500 text-white px-10 py-3 rounded-lg mt-3">
//            Choose Logo Image
//           </label>
//           <input  type="file" id="image-upload"onChange={handleImageChange}className="hidden"/>
//           </div>
//           </div>





//                 <div className="flex justify-end space-x-4 mt-5">
//                   <button onClick={()=>{resetForm(); onClose();}} className="px-5 py-2 bg-gray-300 rounded-lg">
//                     Cancel
//                   </button>
//                   <button onClick={saveVenue} className="px-5 py-2 bg-blue-600 text-white rounded-lg" disabled={loading}>
//                     {loading ? "Saving..." : editData ? "Update Venue" : "Save Venue"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )
//         );
//       };
      

// export default ServicesModal;


