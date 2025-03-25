import React, { useState, useEffect } from "react";

interface Account {
  id: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface AccountModalProps {
  isOpen: boolean;
  currentAccount: Account | null;
  onClose: () => void;
  onSave: (account: Account) => void;
}

const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  currentAccount,
  onClose,
  onSave,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  useEffect(() => {
    if (currentAccount) {
      setEmail(currentAccount.email);
      setPassword(currentAccount.password);
      setRole(currentAccount.role);
      setCreatedAt(currentAccount.createdAt);
      setUpdatedAt(currentAccount.updatedAt);
    } else {
      setEmail("");
      setPassword("");
      setRole("USER");
      setCreatedAt("");
      setUpdatedAt("");
    }
  }, [currentAccount]);

  const handleSave = () => {
    if (email && password && role) {
      onSave({
        id: currentAccount ? currentAccount.id : Date.now().toString(),
        email,
        password,
        role,
        createdAt: currentAccount ? currentAccount.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      onClose(); // Close modal after saving
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg w-[500px]">
          <h2 className="text-2xl font-semibold mb-5 text-gray-800">
            {currentAccount ? "Edit Account" : "Add New Account"}
          </h2>

          {/* Email */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
          />

          {/* Password */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
          />

          {/* Role */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>

   


          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-5 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md"
            >
              {currentAccount ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AccountModal;
