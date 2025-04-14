import React, { useState } from 'react';
import Layout from '../../component/layout/Layout';

const Translation = () => {
  const [file, setFile] = useState<File | null>(null);

  // File select handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };

  // File delete handler
  const handleDelete = () => {
    setFile(null);
  };

  // File download handler
  const handleDownload = () => {
    if (file) {
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(fileURL);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Translation</h2>

        <div className="mb-4">
          <input type="file" onChange={handleFileChange} />
        </div>

        {file && (
          <div className="mb-4">
            <p><strong>Selected File:</strong> {file.name}</p>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 mr-2 rounded"
            >
              Delete
            </button>
            <button
              onClick={handleDownload}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Download
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Translation;
