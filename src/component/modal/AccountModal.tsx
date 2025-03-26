import React, { useState } from "react";
import { toast } from "react-toastify";
import { fireDB } from "../../firebase/FirebaseConfig";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import Loader from "../loader/Loader";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER"); // Default role is USER
  const [loading, setLoading] = useState(false);

  const saveAdmin = async () => {
    if (!name || !email || !password) {
      return toast.error("All fields are required");
    }
    setLoading(true);
    try {
      // Admin or User data
      const user = {
        name,
        email,
        password, // You can hash/store the password as needed, not recommended to store plain password
        role, // Saving the role as either USER or ADMIN
        time: Timestamp.now(),
      };

      // Save the user data in Firestore under the "Admins" collection
      await addDoc(collection(fireDB, "Admins"), user);

      toast.success("User created successfully");
      setName("");
      setEmail("");
      setPassword("");
      setRole("USER"); // Resetting the role to default USER after saving
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error saving user");
    } finally {
      setLoading(false);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        {loading && <Loader />}
        <div className="bg-white p-6 rounded-lg w-[400px]">
          <h2 className="text-2xl font-semibold mb-5 text-gray-800">Add User</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-3 w-full rounded-lg mb-3"
            placeholder="Name"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 w-full rounded-lg mb-3"
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 w-full rounded-lg mb-3"
            placeholder="Password"
          />
          {/* Role Dropdown */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-3 w-full rounded-lg mb-3"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
          <div className="flex justify-end space-x-4">
            <button onClick={onClose} className="px-5 py-2 bg-gray-300 rounded-lg">
              Cancel
            </button>
            <button onClick={saveAdmin} className="px-5 py-2 bg-blue-600 text-white rounded-lg">
              {loading ? "Saving..." : "Save User"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AccountModal;
