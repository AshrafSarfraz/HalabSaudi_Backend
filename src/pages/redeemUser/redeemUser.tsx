// src/pages/User.tsx (ya jahan bhi yeh component hai)
import React, { useEffect, useState } from "react";
import Layout from "../../component/layout/Layout";
import { redeemApi } from "../../backend/redeemApi";


export const RedeemUser: React.FC = () => {
  const [search, setSearch] = useState("");
  const [redeems, setRedeems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const redeemsPerPage = 15;

 // ✅ createdAt ko safely human readable string me convert karo (ms timestamp + string + Date)
 const formatCreatedAt = (value: any) => {
  if (value === null || value === undefined || value === "") return "N/A";

  const fixYear = (d: Date) => {
    if (d.getFullYear() < 2025) {
      d.setFullYear(2025); // ✅ sirf year update
    }
    return d.toLocaleString();
  };

  // Firestore Timestamp support
  if (typeof value === "object" && typeof value.toDate === "function") {
    try {
      const d = value.toDate();
      return fixYear(d);
    } catch {
      return "N/A";
    }
  }

  // milliseconds timestamp (number OR numeric string)
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isNaN(num) && num > 0) {
    const d = new Date(num);
    if (!Number.isNaN(d.getTime())) return fixYear(d);
  }

  // ISO / normal date string
  const d2 = new Date(value);
  if (!Number.isNaN(d2.getTime())) return fixYear(d2);

  return String(value);
};



  useEffect(() => {
    const fetchRedeems = async () => {
      try {
        setLoading(true);
        const data = await redeemApi.getAll();
        setRedeems(data);
      } catch (err) {
        console.error(err);
        // optional: toast use karna ho to yahan kar sakte ho
        // toast.error("Failed to load redeemed discounts");
      } finally {
        setLoading(false);
      }
    };

    fetchRedeems();
  }, []);

  const filteredRedeems = redeems.filter(
    (item) =>
      item.Username?.toLowerCase().includes(search.toLowerCase()) ||
      item.phoneNumber?.includes(search) ||
      item.brand?.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * redeemsPerPage;
  const indexOfFirst = indexOfLast - redeemsPerPage;
  const currentData = filteredRedeems.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRedeems.length / redeemsPerPage);

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6">Redeemed Discounts</h1>

        {/* Search */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by username, phone, or brand..."
            className="w-full p-2 border rounded-lg mr-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <span className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></span>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-2">Username</th>
                    <th className="border p-2">Phone</th>
                    <th className="border p-2">Brand</th>
                    <th className="border p-2">Address</th>
                    {/* <th className="border p-2">Date</th> */}
                    <th className="border p-2">Percentage</th>
                    <th className="border p-2">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((item, index) => (
                    <tr key={item.id || item._id || index} className="hover:bg-gray-100">
                      <td className="border p-2">{item.Username || "N/A"}</td>
                      <td className="border p-2">{item.phoneNumber || "N/A"}</td>
                      <td className="border p-2">{item.brand || "N/A"}</td>
                      <td className="border p-2">{item.address || "N/A"}</td>
                      {/* <td className="border p-2">{item.date || "N/A"}</td> */}
                      <td className="border p-2">{item.percentage || "N/A"}</td>
                      <td className="border p-2">
                        {formatCreatedAt(item.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4 space-x-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};
