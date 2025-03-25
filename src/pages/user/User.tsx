import React, { useState } from "react";
import Layout from "../../component/layout/Layout";
import { allUsers } from "./DummyData";


export const User: React.FC = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;

  // Filtered users based on search input
  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.phone.includes(search)
  );

  // Get current users based on pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Total pages
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <Layout>
      <div className="container mx-auto p-6">
        {/* Search Bar */}
        <h1 className="text-3xl font-semibold mb-6">Users</h1>
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

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Name</th>
                <th className="border p-2">Phone Number</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Total Discount</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={index} className="text-left p-2 hover:bg-gray-100">
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.phone}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.discount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4 space-x-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
};
