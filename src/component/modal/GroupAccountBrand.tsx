import React, { useState, useEffect, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { fireDB, storage } from "../../firebase/FirebaseConfig";
import { addDoc, collection, doc, updateDoc, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Loader from "../loader/Loader";

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: any;
  groupId: string; // Pass from BrandList
}

const BrandListModal: React.FC<ServicesModalProps> = ({ isOpen, onClose, editData, groupId }) => {
  const [brandName, setBrandName] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [discount, setDiscount] = useState("");
  const [subscription, setSubscription] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState<any | null>(null);
  const [country, setCountry] = useState<any | null>(null);
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Fill form on edit
  useEffect(() => {
    if (editData) {
      setBrandName(editData.brandName || "");
      setPhoneNumber(editData.PhoneNumber || "");
      setAddress(editData.address || "");
      setDiscount(editData.discount || "");
      setSubscription(editData.subscription || "");
      setStartAt(editData.startAt || "");
      setEndAt(editData.endAt || "");
      setCategory(editData.category || "");
      setCity(editData.city || null);
      setCountry(editData.country || null);
      setImageUrl(editData.img || "");
      setPdfUrl(editData.pdfUrl || "");
    } else {
      resetForm();
    }
  }, [editData]);

  const resetForm = () => {
    setBrandName("");
    setPhoneNumber("");
    setAddress("");
    setDiscount("");
    setSubscription("");
    setStartAt("");
    setEndAt("");
    setCategory("");
    setCity(null);
    setCountry(null);
    setImageUpload(null);
    setImageUrl("");
    setPdfFile(null);
    setPdfUrl("");
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageUpload(e.target.files[0]);
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handlePdfChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const saveBrand = async () => {
    if (!brandName || !PhoneNumber || !address || !discount || !category) {
      return toast.error("Please fill all required fields!");
    }

    setLoading(true);
    try {
      let uploadedImageUrl = imageUrl;
      let uploadedPdfUrl = pdfUrl;

      if (imageUpload) {
        const imageRef = ref(storage, `H-GROUP_Brands/images/${imageUpload.name}`);
        const snapshot = await uploadBytes(imageRef, imageUpload);
        uploadedImageUrl = await getDownloadURL(snapshot.ref);
      }

      if (pdfFile) {
        const pdfRef = ref(storage, `H-GROUP_Brands/pdfs/${pdfFile.name}`);
        const pdfSnapshot = await uploadBytes(pdfRef, pdfFile);
        uploadedPdfUrl = await getDownloadURL(pdfSnapshot.ref);
      }

      const brandData = {
        brandName,
        PhoneNumber,
        address,
        discount,
        subscription,
        startAt,
        endAt,
        category,
        city,
        country,
        img: uploadedImageUrl,
        pdfUrl: uploadedPdfUrl,
        groupId,
        time: Timestamp.now(),
      };

      if (editData) {
        await updateDoc(doc(fireDB, "H-GROUP_Brands", editData.id), brandData);
        toast.success("Brand updated successfully!");
      } else {
        await addDoc(collection(fireDB, "H-GROUP_Brands"), brandData);
        toast.success("Brand added successfully!");
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save brand!");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      {loading && <Loader />}
      <div className="bg-white p-6 rounded-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-semibold mb-4">{editData ? "Edit Brand" : "Add Brand"}</h2>

        <div className="grid grid-cols-2 gap-4">
  <input
    placeholder="Brand Name"
    value={brandName}
    onChange={e => setBrandName(e.target.value)}
    className="border p-2 rounded-lg"
  />
  <input
    placeholder="Phone Number"
    value={PhoneNumber}
    onChange={e => setPhoneNumber(e.target.value)}
    className="border p-2 rounded-lg"
  />
  <input
    placeholder="Address"
    value={address}
    onChange={e => setAddress(e.target.value)}
    className="border p-2 rounded-lg"
  />
  <input
    placeholder="Discount"
    value={discount}
    onChange={e => setDiscount(e.target.value)}
    className="border p-2 rounded-lg"
  />
  <input
    placeholder="Payment"
    value={subscription}
    onChange={e => setSubscription(e.target.value)}
    className="border p-2 rounded-lg"
  />
  <input
    placeholder="Category"
    value={category}
    onChange={e => setCategory(e.target.value)}
    className="border p-2 rounded-lg"
  />
  <input
    placeholder="City"
    value={city}
    onChange={e => setCity(e.target.value)}
    className="border p-2 rounded-lg"
  />
  <input
    placeholder="Country"
    value={country}
    onChange={e => setCountry(e.target.value)}
    className="border p-2 rounded-lg"
  />

  {/* Start and End Dates */}
  <div className="flex flex-col">
    <label className="text-gray-700 mb-1 font-medium">Subscription Start Date</label>
    <input
      type="date"
      value={startAt}
      onChange={e => setStartAt(e.target.value)}
      className="border p-2 rounded-lg"
    />
  </div>

  <div className="flex flex-col">
    <label className="text-gray-700 mb-1 font-medium">Subscription End Date</label>
    <input
      type="date"
      value={endAt}
      onChange={e => setEndAt(e.target.value)}
      className="border p-2 rounded-lg"
    />
  </div>
</div>
    {/* PDF Upload */}
    <div className="mt-4 flex gap-4 items-center">
          <label htmlFor="pdf-upload" className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded-lg">Choose PDF</label>
          <input id="pdf-upload" type="file" accept="application/pdf" className="hidden" onChange={handlePdfChange} />
          {pdfFile || pdfUrl ? (
            <span>{pdfFile?.name || decodeURIComponent(pdfUrl.split("/").pop()?.split("?")[0] || "")}</span>
          ) : null}
        </div>

        {/* Image Upload */}
        <div className="mt-4 flex gap-4 items-center">
          <label htmlFor="image-upload" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg">Choose Logo</label>
          <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          {imageUrl && <img src={imageUrl} alt="Logo" className="w-16 h-16 object-cover rounded-lg" />}
        </div>

    

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => { resetForm(); onClose(); }} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Cancel</button>
          <button onClick={saveBrand} className="bg-blue-600 text-white px-6 py-2 rounded-lg">{editData ? "Update" : "Save"}</button>
        </div>
      </div>
    </div>
  );
};

export default BrandListModal;
