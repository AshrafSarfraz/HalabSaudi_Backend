import React, { useState, ChangeEvent } from "react";
import Layout from "../../component/layout/Layout";
import AddVenusModal from "../../component/modal/VenusModal";

interface VenusEntry {
  id: number;
  name: string;
  logo: string;
  status: "Active" | "Inactive";
}

const Venus: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [venusList, setVenusList] = useState<VenusEntry[]>([]);
  const [selectedVenus, setSelectedVenus] = useState<VenusEntry | null>(null);
  const [venusName, setVenusName] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);
  const handleAddVenusClick = () => {
    setOpenModal(true); setEditMode(false); setSelectedVenus(null);
    setVenusName(""); setLogo(null); setStatus("Active");
  };

  const handleEditVenusClick = (venus: VenusEntry) => {
    setEditMode(true); setSelectedVenus(venus);
    setVenusName(venus.name); setStatus(venus.status);
    setOpenModal(true);
  };

  const handleDeleteVenus = (id: number) => setVenusList(venusList.filter(v => v.id !== id));

  const handleSubmit = () => {
    if (!venusName) return alert("Please enter a name.");
    setVenusList(editMode && selectedVenus 
      ? venusList.map(v => v.id === selectedVenus.id ? { ...v, name: venusName, logo: logo ? URL.createObjectURL(logo) : v.logo, status } : v)
      : [...venusList, { id: Date.now(), name: venusName, logo: logo ? URL.createObjectURL(logo) : "", status }]
    );
    setOpenModal(false);
  };

  const filteredVenusList = venusList.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Layout>
      <div className="container mx-auto py-4">
      <h1 className="text-3xl font-semibold mb-6">Venus Management</h1>
        <div className="flex justify-between mb-4">
          <input type="text" placeholder="Search Venus by name" value={searchTerm} onChange={handleSearchChange} className="border px-4 py-2 rounded w-1/2" />
          <button onClick={handleAddVenusClick} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Add Venus</button>
        </div>

        <div className="bg-white shadow-md rounded-md p-4">
          
          <table className="w-full border-collapse border border-gray-200">
            <thead><tr className="bg-gray-100"><th className="border p-2">Logo</th><th className="border p-2">Name</th><th className="border p-2">Status</th><th className="border p-2">Actions</th></tr></thead>
            <tbody>
              {filteredVenusList.length > 0 ? filteredVenusList.map(v => (
                <tr key={v.id} className="text-center">
                  <td className="border p-2"><img src={v.logo} alt={v.name} className="w-10 h-10 rounded-full mx-auto" /></td>
                  <td className="border p-2">{v.name}</td>
                  <td className="border p-2"><span className={`px-3 py-1 rounded text-white ${v.status === "Active" ? "bg-green-500" : "bg-red-500"}`}>{v.status}</span></td>
                  <td className="border p-2 flex justify-center space-x-2">
                    <button onClick={() => handleEditVenusClick(v)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                    <button onClick={() => handleDeleteVenus(v.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                  </td>
                </tr>
              )) : <tr><td colSpan={4} className="text-center py-4">No Venus found.</td></tr>}
            </tbody>
          </table>
        </div>

        <AddVenusModal open={openModal} onClose={() => setOpenModal(false)} venusName={venusName} logo={logo} status={status} 
          onVenusNameChange={(e) => setVenusName(e.target.value)} onLogoChange={(e) => setLogo(e.target.files ? e.target.files[0] : null)} 
          onStatusChange={(e) => setStatus(e.target.value as "Active" | "Inactive")} onSubmit={handleSubmit} isEditMode={editMode} />
      </div>
    </Layout>
  );
};

export default Venus;
