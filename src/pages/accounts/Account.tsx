// src/pages/.../Accounts.tsx

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Layout from "../../component/layout/Layout";
import AccountModal from "../../component/modal/AccountModal";
import { adminApi } from "../../backend/Api/AdminApi";


interface AccountEntry {
  id: string;
  name: string;
  email: string;
  role: string;
  password?: string;
}

const Accounts: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accountsList, setAccountsList] = useState<AccountEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState<AccountEntry | null>(null);

  const openModal = (account?: AccountEntry) => {
    setEditData(account || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  // 🔥 Node API se data fetch
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAllAdmins();

      console.log("Admins API response:", data); // 👀 debug

      const mapped: AccountEntry[] = data.map((a: any) => ({
        id: a._id,
        name: a.name || "",
        email: a.email || "",
        role: a.role || "",
      }));

      setAccountsList(mapped);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  // Mount pe load
  useEffect(() => {
    fetchAccounts();
  }, []);

  // Delete Data (Node API)
  const handleDeleteAccount = async (id: string, email: string) => {
    // Prevent deletion if the email matches the specified one
    if (email === "ashraf@westwalk.qa") {
      toast.error("This account cannot be deleted.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this account?")) return;

    try {
      await adminApi.deleteAdmin(id);
      toast.success("Account deleted successfully!");
      setAccountsList((prev) => prev.filter((account) => account.id !== id));
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast.error(error?.message || "Failed to delete account");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Account Management
        </h1>

        <div className="flex flex-col md:flex-row md:justify-between items-center mb-6 gap-3">
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition duration-200 shadow-md"
          >
            + Add Account
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
                  <th className="border p-3 text-center">Name</th>
                  <th className="border p-3 text-center">Email</th>
                  <th className="border p-3 text-center">Role</th>
                  <th className="border p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {accountsList.length > 0 ? (
                  accountsList.map((account) => (
                    <tr
                      key={account.id}
                      className="hover:bg-gray-100 transition"
                    >
                      <td className="border p-3 text-center text-gray-800">
                        {account.name}
                      </td>
                      <td className="border p-3 text-center text-gray-800">
                        {account.email}
                      </td>
                      <td className="border p-3 text-center text-gray-800">
                        {account.role}
                      </td>
                      <td className="border p-3 text-center space-x-2">
                        {account.email === "ashraf@westwalk.qa" ? (
                          ""
                        ) : (
                          <div>
                            <button
                              onClick={() => openModal(account)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white mx-3 px-3 py-1 rounded transition duration-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteAccount(account.id, account.email)
                              }
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-200"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-5 text-gray-500"
                    >
                      No accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AccountModal
        isOpen={isModalOpen}
        onClose={closeModal}
        editData={editData}
        onSaved={fetchAccounts} // ✅ create/update ke baad refresh
      />
    </Layout>
  );
};

export default Accounts;
