// src/component/modal/venderAccount/VenderServiceBrand.tsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../../loader/Loader";
import CitiesDropdown from "../../dropdown/CityDropDown";
import CountriesDropdown from "../../dropdown/CountryDropDown";
import CategoriesDropdown from "../../dropdown/CategoriesDropDown";
import VenueDropdown from "../../dropdown/VenusDropDown";
import { createBrand, updateBrand } from "../../../backend/Api/brandApi";

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: any;
}

// ---------- UI helpers ----------
const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

interface LabelProps {
  htmlFor: string;
  required?: boolean;
  hint?: string;
  children?: React.ReactNode;
}
const Label: React.FC<LabelProps> = ({
  htmlFor,
  required,
  hint,
  children,
}) => (
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
const Field: React.FC<FieldProps> = ({
  label,
  id,
  required,
  hint,
  className,
  children,
}) => (
  <div className={cx("w-full", className)}>
    <Label htmlFor={id} required={required} hint={hint}>
      {label}
    </Label>
    {children}
  </div>
);

const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => (
  <input
    {...props}
    className={cx(
      "w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
      props.className
    )}
  />
);

const TextArea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = (props) => (
  <textarea
    {...props}
    className={cx(
      "w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 min-h-[110px]",
      props.className
    )}
  />
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (
  props
) => (
  <select
    {...props}
    className={cx(
      "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
      props.className
    )}
  />
);

interface SectionProps {
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
}
const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  className,
  children,
}) => (
  <section
    className={cx(
      "rounded-2xl border border-gray-100 bg-white p-4 md:p-6 shadow-sm",
      className
    )}
  >
    <div className="mb-4">
      <h3 className="text-base md:text-lg font-semibold text-gray-800">
        {title}
      </h3>
      {subtitle && (
        <p className="mt-1 text-xs md:text-sm text-gray-500">{subtitle}</p>
      )}
    </div>
    {children}
  </section>
);

// ✅ Backend base URL helper
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const makeImageUrl = (raw?: string) => {
  if (!raw) return "";
  const url = raw.trim();

  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("blob:") ||
    url.startsWith("data:")
  ) {
    return url;
  }

  const base = API_BASE_URL.replace(/\/+$/, "");
  const path = url.startsWith("/") ? url : `/${url}`;

  return `${base}${path}`;
};

const getImageSourceLabel = (url?: string) => {
  if (!url) return "";
  if (
    url.startsWith("http") &&
    url.toLowerCase().includes("firebasestorage.googleapis.com")
  ) {
    return "Firebase";
  }
  return "Node.js";
};

// ---------- type for discounts in form ----------
interface DiscountFormItem {
  value: string;
  descriptionEng: string;
  descriptionArabic: string;
}

// ---------- Component ----------
const VenderServicesModal: React.FC<ServicesModalProps> = ({
  isOpen,
  onClose,
  editData,
}) => {
  const [nameEng, setNameEng] = useState("");
  const [nameArabic, setNameArabic] = useState("");

  const [discounts, setDiscounts] = useState<DiscountFormItem[]>([
    { value: "", descriptionEng: "", descriptionArabic: "" },
  ]);
  const [discountUsageMode, setDiscountUsageMode] = useState<
    "one-per-day" | "all-per-day"
  >("one-per-day");
  const [vendorGroupId, setVendorGroupId] = useState("");
  const [isFlatOffer, setIsFlatOffer] = useState<"Yes" | "No">("No");

  const [descriptionEng, setDescriptionEng] = useState("");
  const [descriptionArabic, setDescriptionArabic] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [address, setAddress] = useState("");
  const [menuUrl, setMenuUrl] = useState("");
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
  const [isBestSeller, setIsBestSeller] = useState<"Yes" | "No" | "">("");
  const [isVenue, setIsVenue] = useState<"Yes" | "No" | "">("");
  const [selectedVenue, setSelectedVenue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [status, setStatus] = useState("Active");

  const [nodeImg, setNodeImg] = useState<File | null>(null);
  const [nodeImgPreview, setNodeImgPreview] = useState("");
  const [nodePdf, setNodePdf] = useState<File | null>(null);
  const [heroImage, setHeroImage] = useState<File | null>(null);

  const [multiImages, setMultiImages] = useState<File[]>([]);
  // const [multiImageUrls, setMultiImageUrls] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setNameEng("");
    setNameArabic("");

    setDiscounts([{ value: "", descriptionEng: "", descriptionArabic: "" }]);
    setDiscountUsageMode("one-per-day");
    setVendorGroupId("");
    setIsFlatOffer("No");

    setDescriptionEng("");
    setDescriptionArabic("");
    setPhoneNumber("");
    setLongitude("");
    setLatitude("");
    setAddress("");
    setMenuUrl("");
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
    setStatus("Active");

    setNodeImg(null);
    setNodeImgPreview("");
    setNodePdf(null);

    setHeroImage(null);

    setMultiImages([]);

  };

  useEffect(() => {
    if (editData) {
      setNameEng(editData.nameEng || "");
      setNameArabic(editData.nameArabic || "");

      if (Array.isArray(editData.discounts) && editData.discounts.length > 0) {
        setDiscounts(
          editData.discounts.map((d: any) => ({
            value: d.value?.toString() || "",
            descriptionEng: d.descriptionEng || "",
            descriptionArabic: d.descriptionArabic || "",
          }))
        );
      } else {
        setDiscounts([
          { value: "", descriptionEng: "", descriptionArabic: "" },
        ]);
      }

      setDiscountUsageMode(
        editData.discountUsageMode === "all-per-day"
          ? "all-per-day"
          : "one-per-day"
      );
      setVendorGroupId(editData.vendorGroupId || "");
      setIsFlatOffer(editData.isFlatOffer ? "Yes" : "No");

      setDescriptionEng(editData.descriptionEng || "");
      setDescriptionArabic(editData.descriptionArabic || "");
      setPhoneNumber(editData.PhoneNumber || "");
      setLongitude(editData.longitude || "");
      setLatitude(editData.latitude || "");
      setAddress(editData.address || "");
      setMenuUrl(editData.menuUrl || "");

      if (editData.timings) {
        setTimings(editData.timings);
      }

      setStartAt(editData.startAt ? editData.startAt.substring(0, 10) : "");
      setEndAt(editData.endAt ? editData.endAt.substring(0, 10) : "");
      setPin(editData.pin || "");
      setIsBestSeller(editData.isBestSeller ? "Yes" : "No");
      setIsVenue(editData.isVenue ? "Yes" : "No");
      setSelectedVenue(editData.selectedVenue || "");
      setSelectedCategory(editData.selectedCategory || "");
      setSelectedCity(editData.selectedCity || "");
      setSelectedCountry(editData.selectedCountry || "");
      setStatus(editData.status || "Active");

      if (editData.img) {
        setNodeImgPreview(editData.img);
      } else if (editData.nodeImg) {
        setNodeImgPreview(editData.nodeImg);
      }
    } else {
      resetForm();
    }
  }, [editData]);

  const handleNodeImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNodeImg(file);
      setNodeImgPreview(URL.createObjectURL(file));
    }
  };

  const handleTimingChange = (day: string, value: string) => {
    setTimings((prev) => ({ ...prev, [day]: value }));
  };

  const generatePin = () => {
    const randomPin = Math.floor(100000 + Math.random() * 900000);
    setPin(randomPin.toString());
  };

  const handleDiscountChange = (
    index: number,
    field: keyof DiscountFormItem,
    value: string
  ) => {
    setDiscounts((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addDiscountRow = () => {
    setDiscounts((prev) => [
      ...prev,
      { value: "", descriptionEng: "", descriptionArabic: "" },
    ]);
  };

  const removeDiscountRow = (index: number) => {
    setDiscounts((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  const saveVenue = async () => {
    if (
      !nameEng ||
      !nameArabic ||
      !descriptionEng ||
      !descriptionArabic ||
      !longitude ||
      !latitude ||
      !address ||
      !PhoneNumber ||
      !selectedCategory ||
      !selectedCity
    ) {
      return toast.error("All fields are required!");
    }

    // ✅ Discount optional now
    const validDiscounts = discounts.filter(
      (d) => d.value.trim() !== "" && d.descriptionEng.trim() !== ""
    );

    const discountsForApi = validDiscounts.map((d) => ({
      value: Number(d.value),
      descriptionEng: d.descriptionEng,
      descriptionArabic: d.descriptionArabic || "",
    }));

    setLoading(true);
    try {
      const payload: any = {
        nameEng,
        nameArabic,
        discounts: discountsForApi,
        discountUsageMode,
        vendorGroupId,
        isFlatOffer,
        descriptionEng,
        descriptionArabic,
        PhoneNumber,
        longitude,
        latitude,
        address,
        menuUrl,
        timings,
        startAt,
        endAt,
        selectedCategory,
        pin,
        selectedCity,
        selectedCountry,
        selectedVenue,
        status,
        isBestSeller,
        isVenue,
        nodeImg,
        nodePdf,
        multiImages,
        heroImage,
      };

      if (editData) {
        await updateBrand(editData.id || editData._id, payload);
        toast.success("Service updated successfully!");
      } else {
        await createBrand(payload);
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
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 ">
      {loading && <Loader />}
      <div className="relative w-full h-full max-w-full overflow-hidden  bg-gradient-to-b from-white to-gray-50 shadow-2xl ring-1 ring-black/5">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/80 px-6 py-4 backdrop-blur-sm">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">
              {editData ? "Edit Brand Details" : "Add New Brand"}
            </h2>
            <p className="text-xs md:text-sm text-gray-500">
              Fill all required fields. Arabic inputs are RTL-enabled.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Close
          </button>
        </div>

        {/* Body */}
        <div className="h-[78vh] overflow-y-auto px-6 py-6 md:px-8 md:py-8 space-y-6">
          {/* Basic Information */}
          <Section title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Field label="Name (English)" id="nameEng" required>
                <TextInput
                  id="nameEng"
                  placeholder="e.g., Coffee Cloud"
                  value={nameEng}
                  onChange={(e) => setNameEng(e.target.value)}
                />
              </Field>
              <Field label="Name (Arabic)" id="nameArabic" required>
                <TextInput
                  id="nameArabic"
                  dir="rtl"
                  placeholder="مثال: كوفي كلاود"
                  value={nameArabic}
                  onChange={(e) => setNameArabic(e.target.value)}
                />
              </Field>
            </div>
          </Section>

          {/* Discounts Section (optional) */}
          <Section
            title="Discounts"
            subtitle="Add one or more discounts for this brand (optional)."
          >
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Usage Mode" id="discountUsageMode">
                <Select
                  id="discountUsageMode"
                  value={discountUsageMode}
                  onChange={(e) =>
                    setDiscountUsageMode(
                      e.target.value === "all-per-day"
                        ? "all-per-day"
                        : "one-per-day"
                    )
                  }
                >
                  <option value="one-per-day">One discount per day</option>
                  <option value="all-per-day">
                    Allow all discounts per day
                  </option>
                </Select>
              </Field>
            </div>

            <div className="space-y-4">
              {discounts.map((d, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end border border-gray-100 rounded-2xl p-3"
                >
                  <Field
                    label="Discount Value (%)"
                    id={`disc-val-${index}`}
                    hint="e.g., 15"
                  >
                    <TextInput
                      id={`disc-val-${index}`}
                      type="number"
                      min={0}
                      placeholder="15"
                      value={d.value}
                      onChange={(e) =>
                        handleDiscountChange(index, "value", e.target.value)
                      }
                    />
                  </Field>
                  <Field
                    label="Description (English)"
                    id={`disc-en-${index}`}
                  >
                    <TextInput
                      id={`disc-en-${index}`}
                      placeholder="15% Discount on Final Bill"
                      value={d.descriptionEng}
                      onChange={(e) =>
                        handleDiscountChange(
                          index,
                          "descriptionEng",
                          e.target.value
                        )
                      }
                    />
                  </Field>
                  <Field label="Description (Arabic)" id={`disc-ar-${index}`}>
                    <TextInput
                      id={`disc-ar-${index}`}
                      dir="rtl"
                      placeholder="خصم ١٥٪ على الفاتورة النهائية"
                      value={d.descriptionArabic}
                      onChange={(e) =>
                        handleDiscountChange(
                          index,
                          "descriptionArabic",
                          e.target.value
                        )
                      }
                    />
                  </Field>
                  <div className="flex gap-2 justify-end md:justify-start">
                    <button
                      type="button"
                      onClick={addDiscountRow}
                      className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                    >
                      + Add
                    </button>
                    {discounts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDiscountRow(index)}
                        className="rounded-xl bg-red-500 px-3 py-2 text-xs font-medium text-white hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Contact & Location */}
          <Section title="Contact & Location">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Field label="Phone Number" id="phone" required>
                <TextInput
                  id="phone"
                  placeholder="e.g., +974 5555 5555"
                  value={PhoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Field>
              <Field
                label="Address"
                id="address"
                required
                className="md:col-span-2"
              >
                <TextInput
                  id="address"
                  placeholder="Street, Area"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Field>
              <Field label="Menu URL (optional)" id="menuUrl">
                <TextInput
                  id="menuUrl"
                  placeholder="https://..."
                  value={menuUrl}
                  onChange={(e) => setMenuUrl(e.target.value)}
                />
              </Field>
              <Field label="Latitude" id="lat" required>
                <TextInput
                  id="lat"
                  placeholder="e.g., 25.286106"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                />
              </Field>
              <Field label="Longitude" id="lng" required>
                <TextInput
                  id="lng"
                  placeholder="e.g., 51.534817"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                />
              </Field>
            </div>
          </Section>

          {/* Classification */}
          <Section title="Classification">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Field label="Category" id="category" required>
                <CategoriesDropdown
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </Field>
              <Field label="Country" id="country" required>
                <CountriesDropdown
                  selectedCountry={selectedCountry}
                  onCountryChange={setSelectedCountry}
                />
              </Field>
              <Field label="City" id="city" required>
                <CitiesDropdown
                  selectedCity={selectedCity}
                  onCityChange={setSelectedCity}
                />
              </Field>

              {isVenue === "Yes" && (
                <Field
                  label="Select Venue"
                  id="venue"
                  className="md:col-span-1"
                >
                  <VenueDropdown
                    selectedVenue={selectedVenue}
                    onVenueChange={setSelectedVenue}
                  />
                </Field>
              )}
            </div>
          </Section>

          {/* Descriptions */}
          <Section title="Descriptions">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Description (English)" id="descEn" required>
                <TextArea
                  id="descEn"
                  placeholder="Write a brief description..."
                  value={descriptionEng}
                  onChange={(e) => setDescriptionEng(e.target.value)}
                />
              </Field>
              <Field label="Description (Arabic)" id="descAr" required>
                <TextArea
                  id="descAr"
                  dir="rtl"
                  placeholder="اكتب وصفًا مختصرًا..."
                  value={descriptionArabic}
                  onChange={(e) => setDescriptionArabic(e.target.value)}
                />
              </Field>
            </div>
          </Section>

          {/* Contract & Access */}
          <Section title="Contract & Access">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <Field label="PIN" id="pin" hint="Auto-generated">
                <div className="flex gap-2">
                  <TextInput
                    id="pin"
                    value={pin}
                    readOnly
                    className="w-full"
                    placeholder="— — — — — —"
                  />
                  <button
                    type="button"
                    onClick={generatePin}
                    className="whitespace-nowrap rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Generate
                  </button>
                </div>
              </Field>
            </div>
          </Section>

          {/* Timings */}
          <Section
            title="Timings"
            subtitle="Use format like 10:00 AM - 9:00 PM"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(timings).map(([day, value]) => (
                <Field
                  key={day}
                  label={day.charAt(0).toUpperCase() + day.slice(1)}
                  id={`tm-${day}`}
                >
                  <TextInput
                    id={`tm-${day}`}
                    placeholder="e.g., 10:00 AM - 9:00 PM"
                    value={value}
                    onChange={(e) => handleTimingChange(day, e.target.value)}
                  />
                </Field>
              ))}
            </div>
          </Section>

          {/* Assets */}
          <Section title="Assets">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Logo */}
              <div>
                <Label htmlFor="image-upload">Brand Logo</Label>
                {nodeImgPreview && (
                  <a
                    href={makeImageUrl(nodeImgPreview)}
                    target="_blank"
                    rel="noreferrer"
                    className="mb-2 inline-flex flex-col items-start"
                  >
                    <img
                      src={makeImageUrl(nodeImgPreview)}
                      alt="Preview"
                      className="h-24 w-24 rounded-xl object-cover ring-1 ring-gray-200"
                    />
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-gray-800/80 px-2 py-0.5 text-[10px] font-medium text-white">
                      {getImageSourceLabel(nodeImgPreview)}
                      <span className="text-[9px] opacity-80">(open)</span>
                    </span>
                  </a>
                )}
                <label
                  htmlFor="image-upload"
                  className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Choose Logo Image
                </label>
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  onChange={handleNodeImgChange}
                />
              </div>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-gray-100 bg-white/80 px-6 py-4 backdrop-blur-sm">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={saveVenue}
            className="rounded-xl bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            {editData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenderServicesModal;
