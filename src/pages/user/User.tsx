import React, { useEffect, useState } from "react";
import Layout from "../../component/layout/Layout";
import {
  collection,
  onSnapshot,
  getDocs,
  query,
} from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";

export const User: React.FC = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const usersPerPage = 15;

  useEffect(() => {
    const q = query(collection(fireDB, "users"));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      setLoading(true); // Start loader
      const userArray: any[] = [];

      for (const doc of querySnapshot.docs) {
        const userData = {
          id: doc.id,
          ...doc.data(),
        };

        const redeemedRef = collection(
          fireDB,
          "users",
          doc.id,
          "redeemed_discounts"
        );
        const redeemedSnapshot = await getDocs(redeemedRef);
        const redeemedCount = redeemedSnapshot.size;

        userArray.push({
          ...userData,
          redeemedCount,
        });
      }

      setUsers(userArray);
      setLoading(false); // End loader
    });

    return () => unsubscribe();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.phone?.includes(search)
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6">Users</h1>

        {/* Search Bar */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full p-2 border rounded-lg mr-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Search
          </button>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
          </div>
        ) : (
          <>
            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Phone Number</th>
                    <th className="border p-2">Account Created At</th>
                    <th className="border p-2">Redeemed Count</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => (
                    <tr key={user.id || index} className="hover:bg-gray-100">
                      <td className="border p-2">{user.name}</td>
                      <td className="border p-2">{user.phoneNumber}</td>
                      <td className="border p-2">
                        {user.createdAt?.toDate
                          ? user.createdAt.toDate().toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="border p-2 text-center">
                        {user.redeemedCount ?? 0}
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
