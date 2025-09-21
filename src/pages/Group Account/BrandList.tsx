import React, { useState, useEffect, ChangeEvent } from "react";
import { useLocation, useParams } from "react-router-dom";
import { collection, onSnapshot, query, where, doc, deleteDoc } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import Layout from "../../component/layout/Layout";
import { toast } from "react-toastify";
import BrandListModal from "../../component/modal/GroupAccountBrand";
import ViewBrandModal from "../../component/modal/GroupAcc_ViewBrand";

interface BrandEntry {
  id: string;
  brandName: string;
  PhoneNumber: string;
  address: string;
  discount: string;
  subscription: string;
  startAt: string;
  endAt: string;
  category: string;
  city: any | null;
  country: any | null;
  img: string;
  pdfUrl: string;
  groupId: string;
}

const BrandList: React.FC = () => {
  const { id: groupId } = useParams(); // group ID from URL
  const location = useLocation();
  const groupData = (location.state as { groupData: any })?.groupData;

  const [brands, setBrands] = useState<BrandEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<BrandEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewBrand, setViewBrand] = useState<BrandEntry | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const openModal = (brand?: BrandEntry) => {
    setEditData(brand || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  const openViewModal = (brand: BrandEntry) => {
    setViewBrand(brand);
    setIsViewModalOpen(true);
  };
  
  const closeViewModal = () => {
    setViewBrand(null);
    setIsViewModalOpen(false);
  };

  // Fetch brands for this group
  useEffect(() => {
    if (!groupId) return;
    setLoading(true);
    const q = query(
      collection(fireDB, "H-GROUP_Brands"),
      where("groupId", "==", groupId),
      // orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const arr: BrandEntry[] = snapshot.docs.map((doc) => ({
        ...(doc.data() as Omit<BrandEntry, "id">),
        id: doc.id,
      }));
      setBrands(arr);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [groupId]);

  // Delete brand
  const handleDeleteBrand = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;
    try {
      await deleteDoc(doc(fireDB, "H-GROUP_Brands", id));
      toast.success("Brand deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete brand");
    }
  };

  // Search
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);
  const filteredBrands = brands.filter((b) =>
    b.brandName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-2">Brands for {groupData?.groupName}</h1>
        <p className="text-gray-500 mb-6">
          Supplier: {groupData?.supplierName} | Contact: {groupData?.contactPerson?.name}
        </p>

        <div className="flex flex-col md:flex-row md:justify-between items-center mb-6 gap-3">
          <input
            type="text"
            placeholder="Search Brand by Name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border px-4 py-2 rounded-md w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition duration-200 shadow-md"
          >
            + Add Brand
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
                  <th className="border p-3 text-center">Status</th>
                  <th className="border p-3 text-center">Contract End At</th>
                  <th className="border p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBrands.length > 0 ? (
                  filteredBrands.map((brand) => (
                    <tr key={brand.id} className="hover:bg-gray-100 transition">
                      <td className="border p-3">
                        <img
                          src={brand.img}
                          alt={brand.brandName}
                          className="w-12 h-12 object-cover rounded-full"
                        />
                      </td>
                      <td className="border p-3 text-center text-gray-800">{brand.brandName}</td>
                      <td className="border p-3 text-center text-gray-800">{brand.discount}</td>
                      <td className="border p-3 text-center text-gray-800">{brand.city}</td>
                      <td className={`border p-3 text-center ${brand.subscription === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {brand.subscription}
                      </td>
                      <td className="border p-3 text-center text-gray-800">{brand.endAt}</td>
                      <td className="border p-3 text-center space-x-2">
                      <button
                       onClick={() => openViewModal(brand)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition duration-200"
                        >View</button>
                       
                        <button
                          onClick={() => openModal(brand)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBrand(brand.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 mt-2 rounded transition duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-5 text-gray-500">
                      No Brands Found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <BrandListModal isOpen={isModalOpen} onClose={closeModal} editData={editData} groupId={groupId!} />
      <ViewBrandModal isOpen={isViewModalOpen} onClose={closeViewModal} brandData={viewBrand} />

    </Layout>
  );
};

export default BrandList;
