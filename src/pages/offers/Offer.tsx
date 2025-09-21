import React, { useState, useEffect, ChangeEvent } from "react";
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import Layout from "../../component/layout/Layout";
import FlatOfferModal from "../../component/modal/FlatOffers";


interface VenusEntry {
  id: string;
  nameEng: string;
  nameArabic: string;
  descriptionEng: string;
  descriptionArabic: string;
  PhoneNumber: string;
  address: string;
  longitude: string;
  latitude: string;
  discount: string;
  Time_sat_to_thrusday: string;
  Time_Fri_to_Sat: string;
  startAt: string;
  endAt: string;
  pin: string;
  isBestSeller: string;
  isVenue: string;
  selectedVenue: any | null;
  selectedCategory: string;
  selectedCity: any | null;
  selectedCountry: any | null;
  status: string;

  // Media
  img: string;              // main logo image
  pdfUrl: string;           // uploaded PDF
  imageUrl: string;         // preview or temporary image (local)

  multiImageUrls: string[]; // ✅ new field for multiple uploaded images
}


const FlatOffer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [venusList, setVenusList] = useState<VenusEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState<VenusEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const openModal = (venue?: VenusEntry) => {
    setEditData(venue || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  // fetch Data
  useEffect(() => {
    setLoading(true);
    const q = query(collection(fireDB, "H-FlatOffers"), orderBy("time"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const venusArray: VenusEntry[] = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as VenusEntry[];
      setVenusList(venusArray);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
 
  // delete data
  const handleDeleteVenus = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Offer?")) return;
    try {
      await deleteDoc(doc(fireDB, "H-FlatOffers", id));
      alert("Deleted successfully");
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete");
    }
  };
 
  // search Item
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);
  const filteredVenusList = venusList.filter((v) =>
    v.nameEng.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Flat Offer</h1>

        <div className="flex flex-col md:flex-row md:justify-between items-center mb-6 gap-3">
          <input
            type="text"
            placeholder="Search Venue by name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border px-4 py-2 rounded-md w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition duration-200 shadow-md"
          >
            + Add Offer
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <span className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></span>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                  <th className="border p-3 text-center">Logo</th>
                  <th className="border p-3 text-center">Brand Name</th>
                  <th className="border p-3 text-center">Discount</th>
                  <th className="border p-3 text-center">City</th>
                  <th className="border p-3 text-center">Is Best Seller</th>
                  <th className="border p-3 text-center">Pin</th>
                  <th className="border p-3 text-center">Discount Star At</th>
                  <th className="border p-3 text-lcenter">Discount End At</th>
                  <th className="border p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVenusList.length > 0 ? (
                  filteredVenusList.map((venue) => (
                    <tr key={venue.id} className="hover:bg-gray-100 transition">
                      <td className="border p-3">
                        <img
                          src={venue.img}
                          alt={venue.nameEng}
                          className="w-12 h-12 object-cover rounded-full"
                        />
                      </td>
                      <td className="border p-3 text-gray-800 text-center">{venue.nameEng}</td>
                      <td className="border p-3 text-gray-800 text-center ">{venue.discount}</td>
                      <td className="border p-3 text-gray-800 text-center ">{venue.selectedCity}</td>
                      <td className="border p-3 text-gray-800 text-center ">{venue.isBestSeller}</td>
                      <td className="border p-3 text-gray-800 text-center ">{venue.pin}</td>
                      <td className="border p-3 text-gray-800 text-center ">{venue.startAt}</td>
                      <td className="border p-3 text-gray-800 text-center ">{venue.endAt}</td>
                     
                     
                      <td className="border p-3 text-center space-x-2">
                        <button
                          onClick={() => openModal(venue)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteVenus(venue.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={12} className="text-center py-5 text-gray-500">
                      No Data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <FlatOfferModal isOpen={isModalOpen} onClose={closeModal} editData={editData} />
    </Layout>
  );
};

export default FlatOffer;
