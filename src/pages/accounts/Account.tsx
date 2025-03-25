import React, { useState } from "react"; // Updated to AccountModal
import Layout from "../../component/layout/Layout";
import AccountModal from "../../component/modal/AccountModal";

interface Account {
  id: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const AccountManagementScreen: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);

  const openModal = () => {
    setIsModalOpen(true);
    setCurrentAccount(null); // Reset current account for adding new account
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAccount(null);
  };

  const handleAddOrUpdateAccount = (account: Account) => {
    if (currentAccount) {
      // Update account
      setAccounts(
        accounts.map((acc) =>
          acc.id === currentAccount.id
            ? { ...acc, ...account, updatedAt: new Date().toISOString() }
            : acc
        )
      );
    } else {
      // Add new account
      setAccounts([
        ...accounts,
        {
          ...account,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleEditAccount = (account: Account) => {
    setCurrentAccount(account);
    setIsModalOpen(true);
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter((account) => account.id !== id));
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${formattedDate}  ${formattedTime}`; // Small gap between date and time
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-semibold mb-6">Account Management</h1>
        {/* Add Account Button */}
        <button
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-5 "
        >
          Add New Account
        </button>

        {/* Accounts Table */}
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Updated At</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td className="px-4 py-2 border">{account.email}</td>
                <td className="px-4 py-2 border">{account.role}</td>
                <td className="px-4 py-2 border">
                  {formatDateTime(account.createdAt)}
                </td>
                <td className="px-4 py-2 border">
                  {formatDateTime(account.updatedAt)}
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleEditAccount(account)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAccount(account.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* AccountModal Component */}
        <AccountModal
          isOpen={isModalOpen}
          currentAccount={currentAccount}
          onClose={closeModal}
          onSave={handleAddOrUpdateAccount}
        />
      </div>
    </Layout>
  );
};

export default AccountManagementScreen;
