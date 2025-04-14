import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import { toast } from "react-toastify";
import AccountModal from "../../component/modal/AccountModal";
import Layout from "../../component/layout/Layout";

interface AccountEntry {
  id: string;
  name: string;
  email: string;
  role: string;
  password:string;
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

  // Fetch Data
  useEffect(() => {
    setLoading(true);
    const q = query(collection(fireDB, "Admins"), orderBy("time"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const accountsArray: AccountEntry[] = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as AccountEntry[];
      setAccountsList(accountsArray);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Delete Data
  const handleDeleteAccount = async (id: string, email: string) => {
    // Prevent deletion if the email matches the specified one
    if (email === "ashraf@westwalk.qa") {
      toast.error("This account cannot be deleted.");
      return;
    }

    if (!confirm("Are you sure you want to delete this account?")) return;

    try {
      await deleteDoc(doc(fireDB, "Admins", id));
      toast.success("Account deleted successfully!");

      // Remove the deleted account from the state
      setAccountsList((prev) => prev.filter((account) => account.id !== id));
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete account");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Account Management</h1>

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
                    <tr key={account.id} className="hover:bg-gray-100 transition">
                      <td className="border p-3 text-center text-gray-800">{account.name}</td>
                      <td className="border p-3 text-center text-gray-800">{account.email}</td>
                      <td className="border p-3 text-center text-gray-800">{account.role}</td>
                      <td className="border p-3 text-center space-x-2">
                        {  account.email==='ashraf@westwalk.qa' ? "" :
                          <div>
                          <button
                            onClick={() => openModal(account)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white mx-3  px-3 py-1 rounded transition duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>  handleDeleteAccount(account.id, account.email)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-200"
                          >
                            Delete
                          </button>
                          </div>
                 
                        }
                      
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-5 text-gray-500">
                      No accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AccountModal isOpen={isModalOpen} onClose={closeModal} editData={editData} />
    </Layout>
  );
};

export default Accounts;
