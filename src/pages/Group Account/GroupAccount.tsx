// src/pages/Group_Account.tsx (path adjust kar lena)
import React, { useState, useEffect, ChangeEvent } from "react";
import Layout from "../../component/layout/Layout";
import GroupAccountModal from "../../component/modal/Group_AccountModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { groupAccountApi } from "../../backend/Api/groupAccountApi";


interface ContactPerson {
  name: string;
  phone: string;
  email: string;
  position: string;
}

export interface GroupAccountEntry {
  id: string;
  supplierName: string;
  groupName: string;
  email: string;
  phoneNumber: string;
  crNumber?: string;
  contractHolder?: string;
  ourRepresentative?: string;
  contactPerson?: ContactPerson;
}

const Group_Account: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupAccounts, setGroupAccounts] = useState<GroupAccountEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState<GroupAccountEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const openModal = (account?: GroupAccountEntry) => {
    setEditData(account || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  // ✅ API se data lana (Firestore snapshot ki jagah)
  const fetchGroupAccounts = async () => {
    try {
      setLoading(true);
      const data = await groupAccountApi.getAll();
      // Backend se _id aata ho to map kar sakte ho:
      const normalized = data.map((item: any) => ({
        id: item._id || item.id,
        supplierName: item.supplierName || "",
        groupName: item.groupName || "",
        email: item.email || "",
        phoneNumber: item.phoneNumber || "",
        crNumber: item.crNumber,
        contractHolder: item.contractHolder,
        ourRepresentative: item.ourRepresentative,
        contactPerson: item.contactPerson,
      })) as GroupAccountEntry[];
      setGroupAccounts(normalized);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load group accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupAccounts();
  }, []);

  // ✅ API se delete
  const handleDeleteAccount = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this group account?")) return;
    try {
      await groupAccountApi.remove(id);
      toast.success("Group account deleted successfully!");
      fetchGroupAccounts(); // list refresh
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete group account");
    }
  };

  // Search
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);
  const filteredAccounts = groupAccounts.filter((c) =>
    c.groupName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Group Accounts</h1>

        <div className="flex flex-col md:flex-row md:justify-between items-center mb-6 gap-3">
          <input
            type="text"
            placeholder="Search Group by Name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border px-4 py-2 rounded-md w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition duration-200 shadow-md"
          >
            + Add Group Account
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
                  <th className="border p-3 text-center">Group Name</th>
                  <th className="border p-3 text-center">Supplier Name</th>
                  <th className="border p-3 text-center">Phone Number</th>
                  <th className="border p-3 text-center">Email</th>
                  <th className="border p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.length > 0 ? (
                  filteredAccounts.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-100 transition">
                      <td
                        className="border p-3 text-center text-blue-600 cursor-pointer hover:underline"
                        onClick={() =>
                          navigate(`/brands/${account.id}`, {
                            state: { groupData: account },
                          })
                        }
                      >
                        {account.groupName}
                      </td>
                      <td className="border p-3 text-center text-gray-800">{account.supplierName}</td>
                      <td className="border p-3 text-center text-gray-800">{account.phoneNumber}</td>
                      <td className="border p-3 text-center text-gray-800">{account.email}</td>
                      <td className="border p-3 text-center space-x-2">
                        <button
                          onClick={() => openModal(account)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAccount(account.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-5 text-gray-500">
                      No Group Accounts Found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <GroupAccountModal
        isOpen={isModalOpen}
        onClose={closeModal}
        editData={editData}
        onSaved={fetchGroupAccounts} // 👈 save ke baad list refresh
      />
    </Layout>
  );
};

export default Group_Account;
