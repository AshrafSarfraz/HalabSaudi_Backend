import React from "react";

interface AddVenusModalProps {
  open: boolean;
  onClose: () => void;
  venusName: string;
  logo: File | null;
  status: "Active" | "Inactive";
  onVenusNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: () => void;
  isEditMode?: boolean;
}

const AddVenusModal: React.FC<AddVenusModalProps> = ({
  open,
  onClose,
  venusName,
  logo,
  status,
  onVenusNameChange,
  onLogoChange,
  onStatusChange,
  onSubmit,
  isEditMode = false,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[500px] shadow-lg">
        <h2 className="text-2xl font-semibold mb-5 text-gray-800">
          {isEditMode ? "Edit Venue" : "Add Venue"}
        </h2>
        <input
          type="text"
          value={venusName}
          onChange={onVenusNameChange}
          className="border border-gray-300 p-3 w-full rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Venue Name"
        />
        <input
          type="file"
          onChange={onLogoChange}
          className="border border-gray-300 p-3 w-full rounded-lg mb-3 focus:outline-none"
        />
        <select
          value={status}
          onChange={onStatusChange}
          className="border border-gray-300 p-3 w-full rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-5 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-5 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md"
          >
            {isEditMode ? "Update Venue" : "Add Venue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVenusModal;
