// src/component/modal/Group_AccountModal.tsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../loader/Loader";
import { GroupAccountEntry } from "../../pages/Group Account/GroupAccount";
import { groupAccountApi } from "../../backend/Api/groupAccountApi";



interface GroupAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: GroupAccountEntry | null;
  onSaved?: () => void; // 👈 parent ko notify karne ke liye
}

const GroupAccountModal: React.FC<GroupAccountModalProps> = ({
  isOpen,
  onClose,
  editData,
  onSaved,
}) => {
  const [supplierName, setSupplierName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [crNumber, setCrNumber] = useState("");
  const [contractHolder, setContractHolder] = useState("");
  const [ourRepresentative, setOurRepresentative] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPosition, setContactPosition] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setSupplierName(editData.supplierName || "");
      setGroupName(editData.groupName || "");
      setEmail(editData.email || "");
      setPhoneNumber(editData.phoneNumber || "");
      setCrNumber(editData.crNumber || "");
      setContractHolder(editData.contractHolder || "");
      setOurRepresentative(editData.ourRepresentative || "");
      if (editData.contactPerson) {
        setContactName(editData.contactPerson.name || "");
        setContactPhone(editData.contactPerson.phone || "");
        setContactEmail(editData.contactPerson.email || "");
        setContactPosition(editData.contactPerson.position || "");
      }
    } else {
      resetFields();
    }
  }, [editData]);

  const resetFields = () => {
    setSupplierName("");
    setGroupName("");
    setEmail("");
    setPhoneNumber("");
    setCrNumber("");
    setContractHolder("");
    setOurRepresentative("");
    setContactName("");
    setContactPhone("");
    setContactEmail("");
    setContactPosition("");
  };

  const saveGroupAccount = async () => {
    if (!supplierName || !groupName || !email || !phoneNumber) {
      return toast.error("All required fields must be filled!");
    }

    const payload = {
      supplierName,
      groupName,
      email,
      phoneNumber,
      crNumber,
      contractHolder,
      ourRepresentative,
      contactPerson: {
        name: contactName,
        phone: contactPhone,
        email: contactEmail,
        position: contactPosition,
      },
    };

    setLoading(true);
    try {
      if (editData?.id) {
        await groupAccountApi.update(editData.id, payload);
        toast.success("Group Account updated successfully!");
      } else {
        await groupAccountApi.create(payload);
        toast.success("Group Account added successfully!");
      }

      onClose();
      resetFields();
      onSaved && onSaved(); // 👈 parent ko bol do ke dubara fetch kare
    } catch (error) {
      console.error(error);
      toast.error("Error saving Group Account");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {loading && <Loader />}
      <div className="bg-white p-6 rounded-xl w-[850px] max-w-full shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          {editData ? "Edit Group Account" : "Add Group Account"}
        </h2>

        {/* Supplier Info */}
        <h3 className="text-lg font-semibold mb-3 text-blue-900">Supplier Information</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            className="border p-3 w-full rounded-lg"
            placeholder="Supplier Name *"
          />
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="border p-3 w-full rounded-lg"
            placeholder="Group Name *"
          />
          <input
            type="text"
            value={crNumber}
            onChange={(e) => setCrNumber(e.target.value)}
            className="border p-3 w-full rounded-lg"
            placeholder="CR Number"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 w-full rounded-lg"
            placeholder="Email *"
          />
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border p-3 w-full rounded-lg"
            placeholder="Phone Number *"
          />
        </div>

        {/* Contact Person */}
        <h3 className="text-lg font-semibold mb-3 text-blue-900">Contact Person Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="border p-3 w-full rounded-lg"
            placeholder="Name"
          />
          <input
            type="text"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className="border p-3 w-full rounded-lg"
            placeholder="Phone"
          />
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="border p-3 w-full rounded-lg"
            placeholder="Email"
          />
          <input
            type="text"
            value={contactPosition}
            onChange={(e) => setContactPosition(e.target.value)}
            className="border p-3 w-full rounded-lg"
            placeholder="Position"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={() => {
              onClose();
              resetFields();
            }}
            className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={saveGroupAccount}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Saving..." : editData ? "Update Group Account" : "Save Group Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupAccountModal;
