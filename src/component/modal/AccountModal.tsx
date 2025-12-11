// src/component/modal/AccountModal.tsx

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../loader/Loader";
import { adminApi } from "../../backend/Api/AdminApi";


interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  editData?:
    | {
        id: string;
        name: string;
        email: string;
        role: string;
        password?: string;
      }
    | null;
}

const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  editData,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // password create time pe required, edit time pe optional / hidden
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setEmail(editData.email || "");
      setRole(editData.role || "User");
      setPassword(""); // edit ke time password input clear
    } else {
      setName("");
      setEmail("");
      setPassword("");
      setRole("User");
    }
  }, [editData, isOpen]);

  // Add or update account (Node API)
  const saveAccount = async () => {
    // Create ke time: sare required
    // Edit ke time: name / email / role required, password optional
    if (!name || !email || !role || (!editData && !password)) {
      return toast.error("All fields are required");
    }

    setLoading(true);

    try {
      if (editData) {
        // UPDATE
        const payload: any = {
          name,
          email,
          role,
        };

        // Agar tum future me password change allow karna chaho to:
        // if (password) payload.password = password;

        await adminApi.updateAdmin(editData.id, payload);
        toast.success("Account updated successfully!");
      } else {
        // CREATE
        await adminApi.createAdmin({
          name,
          email,
          password,
          role,
        });
        toast.success("Account added successfully!");

        setName("");
        setEmail("");
        setPassword("");
        setRole("User");
      }

      onSaved(); // list refresh
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Error saving account");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      {loading && <Loader />}
      <div className="bg-white p-6 rounded-lg w-[400px]">
        <h2 className="text-2xl font-semibold mb-5 text-gray-800">
          {editData ? "Edit Account" : "Add Account"}
        </h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-3 w-full rounded-lg mb-3"
          placeholder="Enter Name"
        />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 w-full rounded-lg mb-3"
          placeholder="Enter Email"
        />

        {/* Create mode me hi password dikhayenge */}
        {!editData && (
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 w-full rounded-lg mb-3"
            placeholder="Enter Password"
          />
        )}

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-3 w-full rounded-lg mb-3"
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-300 rounded-lg"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={saveAccount}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg"
            disabled={loading}
          >
            {loading ? "Saving..." : editData ? "Update Account" : "Save Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
