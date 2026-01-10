import React, { useEffect, useState } from "react";
import { redeemApi } from "../../../backend/redeemApi";

export const Vender_Redeemed_Histroy: React.FC = () => {
  const [venderName, setVenderName] = useState<string>("");
  const [search, setSearch] = useState("");
  const [redeems, setRedeems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const redeemsPerPage = 15;

  // ✅ createdAt formatter (Firestore + API safe)
  const formatCreatedAt = (value: any) => {
    if (!value) return "N/A";

    if (typeof value === "object" && typeof value.toDate === "function") {
      try {
        return value.toDate().toLocaleString();
      } catch {
        return "N/A";
      }
    }

    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d.toLocaleString();

    return String(value);
  };

  useEffect(() => {
    const raw = localStorage.getItem("currentVender");
    if (raw) {
      const vendorData = JSON.parse(raw);
      setVenderName(vendorData.name || "");
    }
  }, []);

  useEffect(() => {
    const fetchRedeems = async () => {
      try {
        setLoading(true);
        const data = await redeemApi.getAll();
        setRedeems(data);
      } catch (error) {
        console.error("Failed to fetch redeems", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRedeems();
  }, []);

  // ✅ Sirf current vendor + search filter
  const filteredRedeems = redeems
    .filter(
      (item) =>
        item.brand?.toLowerCase() === venderName.toLowerCase()
    )
    .filter(
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">
        Redeemed Discounts — {venderName}
      </h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by username, phone, or brand..."
        className="w-full p-2 border rounded-lg mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center py-10">
          <span className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></span>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">Username</th>
                  {/* <th className="border p-2">Phone</th> */}
                  <th className="border p-2">Brand</th>
                  <th className="border p-2">Address</th>
                  <th className="border p-2">Percentage</th>
                  <th className="border p-2">Created At</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, index) => (
                  <tr key={item._id || item.id || index}>
                    <td className="border p-2">{item.Username || "N/A"}</td>
                    {/* <td className="border p-2">{item.phoneNumber || "N/A"}</td> */}
                    <td className="border p-2">{item.brand || "N/A"}</td>
                    <td className="border p-2">{item.address || "N/A"}</td>
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
  );
};
