import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { Timestamp, addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { fireDB } from "../../../firebase/FirebaseConfig";
import Loader from "../../loader/Loader";
import { useNavigate } from "react-router-dom";


interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: {
    id: string;
    name: string;
    email: string;
    role: string;
    password:string;
  } | null;
}

const VenderAccount: React.FC<AccountModalProps> = ({ isOpen, onClose, editData }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (editData) {
      setName(editData.name);
      setEmail(editData.email);
      setRole(editData.role);
      setPassword(editData.password)
    } else {
      setName("");
      setEmail("");
      setPassword("");
      setRole("User");
    }
  }, [editData]);

  // Add or update account
  const saveAccount = async () => {
    if (!name || !email || !password || !role) {
      return toast.error("All fields are required");
    }
    setLoading(true);
    try {
      if (editData) {
        await updateDoc(doc(fireDB, "H-Vender_Account", editData.id), { name, email, role,password });
        toast.success("Account updated successfully!");
      } else {
        await addDoc(collection(fireDB, "H-Vender_Account"), {
          name,
          email,
          password,
          role,
          time: Timestamp.now(),
        });
        toast.success("Account added successfully!");
        setName("");
        setEmail("");
        setPassword("");
        setRole("User");
      }

      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error saving account");
    } finally {
      setLoading(false);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        {loading && <Loader/>}
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
        {editData? null:  <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 w-full rounded-lg mb-3"
            placeholder="Enter Password"
          />}
         
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-3 w-full rounded-lg mb-3"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>

          <div className="flex justify-end space-x-4">
            <button onClick={onClose} className="px-5 py-2 bg-gray-300 rounded-lg">
              Cancel
            </button>
            <button onClick={saveAccount} className="px-5 py-2 bg-blue-600 text-white rounded-lg" disabled={loading}>
              {loading ? "Saving..." : editData ? "Update Account" : "Save Account"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default VenderAccount;
