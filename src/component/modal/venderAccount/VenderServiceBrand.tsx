import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { fireDB, storage } from "../../../firebase/FirebaseConfig";
import { Timestamp, addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Loader from "../../loader/Loader";
import VenuDropdown from "../../dropdown/VenusDropDown";
import CategoriesDropdown from "../../dropdown/CategoriesDropDown";
import CountriesDropdown from "../../dropdown/CountryDropDown";
import CitiesDropdown from "../../dropdown/CityDropDown";

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: any;
}

// —————— UI helpers ——————
const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

// Add explicit children typing for React 18+
interface LabelProps {
  htmlFor: string;
  required?: boolean;
  hint?: string;
  children?: React.ReactNode;
}
const Label: React.FC<LabelProps> = ({ htmlFor, required, hint, children }) => (
  <div className="mb-1 flex items-end justify-between">
    <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
    {hint && <span className="text-[11px] text-gray-400">{hint}</span>}
  </div>
);

interface FieldProps {
  label: string;
  id: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children?: React.ReactNode;
}
const Field: React.FC<FieldProps> = ({ label, id, required, hint, className, children }) => (
  <div className={cx("w-full", className)}>
    <Label htmlFor={id} required={required} hint={hint}>{label}</Label>
    {children}
  </div>
);

const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className={cx("w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200", props.className)} />
);

const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea {...props} className={cx("w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 min-h-[110px]", props.className)} />
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <select {...props} className={cx("w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200", props.className)} />
);

interface SectionProps {
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
}
const Section: React.FC<SectionProps> = ({ title, subtitle, className, children }) => (
  <section className={cx("rounded-2xl border border-gray-100 bg-white p-4 md:p-6 shadow-sm", className)}>
    <div className="mb-4">
      <h3 className="text-base md:text-lg font-semibold text-gray-800">{title}</h3>
      {subtitle && <p className="mt-1 text-xs md:text-sm text-gray-500">{subtitle}</p>}
    </div>
    {children}
  </section>
);

// —————— Component ——————
const VenderServicesModal: React.FC<ServicesModalProps> = ({ isOpen, onClose, editData }) => {
  const [nameEng, setNameEng] = useState("");
  const [nameArabic, setNameArabic] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountArabic, setDiscountArabic] = useState("");
  const [descriptionEng, setDescriptionEng] = useState("");
  const [descriptionArabic, setDescriptionArabic] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [address, setAddress] = useState("");
  const [menuUrl, setMenuUrl] = useState("");
  const [timings, setTimings] = useState({ monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", saturday: "", sunday: "" });

  const [pin, setPin] = useState("");
  const [isVenue, setIsVenue] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [status, setStatus] = useState("No");
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [multiImages, setMultiImages] = useState<File[]>([]);
  const [multiImageUrls, setMultiImageUrls] = useState<string[]>(editData?.multiImageUrls || []);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState(editData?.pdfUrl || "");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setNameEng(""); setNameArabic(""); setDescriptionEng(""); setDescriptionArabic(""); setPhoneNumber("");
    setLongitude(""); setLatitude(""); setAddress(""); setDiscount("");
    setMenuUrl(""); setTimings({ monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", saturday: "", sunday: "" });
      setPin(""); setIsVenue("");
    setSelectedVenue(""); setSelectedCategory(""); setSelectedCity(""); setSelectedCountry("");
    setStatus("No"); setImageUpload(null); setImageUrl(""); setPdfFile(null); setPdfUrl("");
    setMultiImages([]); setMultiImageUrls([]);
  };

  useEffect(() => {
    if (editData) {
      setNameEng(editData.nameEng || "");
      setNameArabic(editData.nameArabic || "");
      setDiscount(editData.discount || "");
      setDiscountArabic(editData.discountArabic || "");
      setDescriptionEng(editData.descriptionEng || "");
      setDescriptionArabic(editData.descriptionArabic || "");
      setPhoneNumber(editData.PhoneNumber || "");
      setLongitude(editData.longitude || "");
      setLatitude(editData.latitude || "");
      setAddress(editData.address || "");
      setMenuUrl(editData.menuUrl || "");
      setTimings(editData.timings || { monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", saturday: "", sunday: "" });
      setPin(editData.pin || "");
      setIsVenue(editData.isVenue || "");
      setSelectedVenue(editData.selectedVenue || "");
      setSelectedCategory(editData.selectedCategory || "");
      setSelectedCity(editData.selectedCity || "");
      setSelectedCountry(editData.selectedCountry || "");
      setStatus(editData.status || "");
      setImageUrl(editData.img || "");
      setMultiImageUrls(editData.multiImageUrls || []);
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

  const handleMultiImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setMultiImages(prev => [...prev, ...filesArray]);
      const urls = filesArray.map(file => URL.createObjectURL(file));
      setMultiImageUrls(prev => [...prev, ...urls]);
    }
  };

  const removeMultiImage = (index: number) => {
    setMultiImages(prev => prev.filter((_, i) => i !== index));
    setMultiImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleTimingChange = (day: string, value: string) => {
    setTimings(prev => ({ ...prev, [day]: value }));
  };

  const generatePin = () => {
    const randomPin = Math.floor(100000 + Math.random() * 900000);
    setPin(randomPin.toString());
  };

  const saveVenue = async () => {
    if (!nameEng || !nameArabic || !descriptionEng || !descriptionArabic || !longitude || !latitude || !address || !PhoneNumber || !selectedCategory || !selectedCity || (!imageUpload && !editData)) {
      return toast.error("All fields are required!");
    }

    setLoading(true);
    try {
      let uploadedImageUrl = imageUrl;
      let uploadedPdfUrl = pdfUrl;
      let uploadedMultiImageUrls = [...multiImageUrls];

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

      if (multiImages.length > 0) {
        uploadedMultiImageUrls = [];
        for (const file of multiImages) {
          const imgRef = ref(storage, `H-Brands/multiImages/${file.name}`);
          const snapshot = await uploadBytes(imgRef, file);
          const url = await getDownloadURL(snapshot.ref);
          uploadedMultiImageUrls.push(url);
        }
      }

      const venueData = {
        nameEng, nameArabic, discount, discountArabic, descriptionEng, descriptionArabic,
        PhoneNumber, longitude, latitude, address,
        menuUrl, timings, selectedCategory, pin, isVenue, selectedCity, selectedCountry, selectedVenue,
        status, img: uploadedImageUrl, pdfUrl: uploadedPdfUrl, multiImageUrls: uploadedMultiImageUrls,
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
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 md:p-10">
      {loading && <Loader />}
      <div className="relative w-full max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-b from-white to-gray-50 shadow-2xl ring-1 ring-black/5">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/80 px-6 py-4 backdrop-blur-sm">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">
              {editData ? "Edit Brand Details" : "Add New Brand"}
            </h2>
            <p className="text-xs md:text-sm text-gray-500">Fill all required fields. Arabic inputs are RTL-enabled.</p>
          </div>
          <button onClick={onClose} className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">Close</button>
        </div>

        {/* Body */}
        <div className="h-[78vh] overflow-y-auto px-6 py-6 md:px-8 md:py-8 space-y-6">
          <Section title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Field label="Brand Name (En)" id="nameEng" required>
                <TextInput id="name (En)" placeholder="e.g., Coffee Cloud" value={nameEng} onChange={(e) => setNameEng(e.target.value)} />
              </Field>
              <Field label="Name (Arabic)" id="nameArabic" required>
                <TextInput id="nameArabic" dir="rtl" placeholder="مثال: كوفي كلاود" value={nameArabic} onChange={(e) => setNameArabic(e.target.value)} />
              </Field>
              <Field label="Discount" id="discount">
                <TextInput id="discount" placeholder="e.g., 20% off" value={discount} onChange={(e) => setDiscount(e.target.value)} />
              </Field>
              <Field label="Discount (Arabic)" id="discountArabic">
                <TextInput id="discountArabic" dir="rtl" placeholder="خصم ٢٠٪" value={discountArabic} onChange={(e) => setDiscountArabic(e.target.value)} />
              </Field>
            </div>
          </Section>

          <Section title="Contact & Location">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Field label="Phone Number" id="phone" required>
                <TextInput id="phone" placeholder="e.g., +974 5555 5555" value={PhoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </Field>
              <Field label="Address" id="address" required className="md:col-span-2">
                <TextInput id="address" placeholder="Street, Area" value={address} onChange={(e) => setAddress(e.target.value)} />
              </Field>
              <Field label="Menu URL (optional)" id="menuUrl">
                <TextInput id="menuUrl" placeholder="https://..." value={menuUrl} onChange={(e) => setMenuUrl(e.target.value)} />
              </Field>
              <Field label="Latitude" id="lat" required>
                <TextInput id="lat" placeholder="e.g., 25.286106" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
              </Field>
              <Field label="Longitude" id="lng" required>
                <TextInput id="lng" placeholder="e.g., 51.534817" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
              </Field>
            </div>
          </Section>

          <Section title="Classification">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Field label="Category" id="category" required>
                <CategoriesDropdown selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
              </Field>
              <Field label="Country" id="country" required>
                <CountriesDropdown selectedCountry={selectedCountry} onCountryChange={setSelectedCountry} />
              </Field>
              <Field label="City" id="city" required>
                <CitiesDropdown selectedCity={selectedCity} onCityChange={setSelectedCity} />
              </Field>
            
              <Field label="Status" id="status">
                <Select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="">Select</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Active">Active</option>
                </Select>
              </Field>
              <Field label="Is Venue" id="isVenue">
                <Select id="isVenue" value={isVenue} onChange={(e) => setIsVenue(e.target.value)}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Select>
              </Field>
              {isVenue === "Yes" && (
                <Field label="Select Venue" id="venue" className="md:col-span-1">
                  <VenuDropdown selectedVenue={selectedVenue} onVenueChange={setSelectedVenue} />
                </Field>
              )}
            </div>
          </Section>

          <Section title="Descriptions">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Description (English)" id="descEn" required>
                <TextArea id="descEn" placeholder="Write a brief description..." value={descriptionEng} onChange={(e) => setDescriptionEng(e.target.value)} />
              </Field>
              <Field label="Description (Arabic)" id="descAr" required>
                <TextArea id="descAr" dir="rtl" placeholder="اكتب وصفًا مختصرًا..." value={descriptionArabic} onChange={(e) => setDescriptionArabic(e.target.value)} />
              </Field>
            </div>
          </Section>

          <Section title="Contract & Access">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            
            
              <Field label="PIN" id="pin" hint="Auto-generated">
                <div className="flex gap-2">
                  <TextInput id="pin" value={pin} readOnly className="w-full" placeholder="— — — — — —" />
                  <button type="button" onClick={generatePin} className="whitespace-nowrap rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">Generate</button>
                </div>
              </Field>
            </div>
          </Section>

          <Section title="Timings" subtitle="Use format like 10:00 AM - 9:00 PM">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(timings).map(([day, value]) => (
                <Field key={day} label={day.charAt(0).toUpperCase() + day.slice(1)} id={`tm-${day}`}>
                  <TextInput id={`tm-${day}`} placeholder="e.g., 10:00 AM - 9:00 PM" value={value} onChange={(e) => handleTimingChange(day, e.target.value)} />
                </Field>
              ))}
            </div>
          </Section>

          <Section title="Assets">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* PDF */}
              <div>
                <Label htmlFor="pdf-upload">Menu PDF</Label>
                {pdfFile || pdfUrl ? (
                  <div className="mb-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                    <span>{pdfFile?.name || decodeURIComponent(pdfUrl.split("/").pop()?.split("?")[0] || "")}</span>
                  </div>
                ) : null}
                <label htmlFor="pdf-upload" className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Choose Menu PDF</label>
                <input id="pdf-upload" type="file" className="hidden" onChange={handlePdfChange} />
              </div>

              {/* Logo */}
              <div>
                <Label htmlFor="image-upload">Brand Logo</Label>
                {imageUrl && <img src={imageUrl} alt="Preview" className="mb-2 h-24 w-24 rounded-xl object-cover ring-1 ring-gray-200" />}
                <label htmlFor="image-upload" className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Choose Logo Image</label>
                <input id="image-upload" type="file" className="hidden" onChange={handleImageChange} />
              </div>

              {/* Gallery */}
              <div>
                <Label htmlFor="multi-image-upload">Gallery Images</Label>
                <label htmlFor="multi-image-upload" className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Choose Multiple Images</label>
                <input id="multi-image-upload" type="file" className="hidden" multiple onChange={handleMultiImageChange} />
                <div className="mt-3 flex flex-wrap gap-2">
                  {multiImageUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img src={url} alt={`Preview ${index}`} className="h-20 w-20 rounded-xl object-cover ring-1 ring-gray-200" />
                      <button type="button" onClick={() => removeMultiImage(index)} className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-md">×</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-gray-100 bg-white/80 px-6 py-4 backdrop-blur-sm">
          <button onClick={onClose} className="rounded-xl border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={saveVenue} className="rounded-xl bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
            {editData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenderServicesModal;

