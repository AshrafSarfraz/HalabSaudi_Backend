import React from "react";

interface ViewBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandData: any;
}

const ViewBrandModal: React.FC<ViewBrandModalProps> = ({ isOpen, onClose, brandData }) => {
  if (!isOpen || !brandData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-semibold mb-4">Brand Details</h2>

        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <div><strong>Brand Name:</strong> {brandData.brandName}</div>
          <div><strong>Phone Number:</strong> {brandData.PhoneNumber}</div>
          <div><strong>Address:</strong> {brandData.address}</div>
          <div><strong>Discount:</strong> {brandData.discount}</div>
          <div><strong>Payment:</strong> {brandData.subscription}</div>
          <div><strong>Category:</strong> {brandData.category}</div>
          <div><strong>City:</strong> {brandData.city}</div>
          <div><strong>Country:</strong> {brandData.country}</div>
          <div><strong>Subscription Start:</strong> {brandData.startAt}</div>
          <div><strong>Subscription End:</strong> {brandData.endAt}</div>
          <div><strong>Group ID:</strong> {brandData.groupId}</div>
          <div><strong>PDF:</strong> {brandData.pdfUrl && <a href={brandData.pdfUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">View PDF</a>}</div>
          <div><strong>Logo:</strong> {brandData.img && <img src={brandData.img} alt="Logo" className="w-10 h-10 object-cover rounded-lg" />}</div>
      </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ViewBrandModal;
