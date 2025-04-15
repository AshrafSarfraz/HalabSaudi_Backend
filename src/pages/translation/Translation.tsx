import React, { useEffect, useState } from 'react';
import Layout from '../../component/layout/Layout';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { fireDB, storage } from '../../firebase/FirebaseConfig';

const Translation = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loadingFiles, setLoadingFiles] = useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const uploadFileToFirebase = async () => {
    if (!file) return;

    try {
      setUploading(true);
      const storageRef = ref(storage, `uploads/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(fireDB, 'uploadedFiles'), {
        name: file.name,
        url: downloadURL,
        size: file.size,
        createdAt: serverTimestamp(),
      });

      setFile(null);
      fetchUploadedFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const fetchUploadedFiles = async () => {
    try {
      setLoadingFiles(true);
      const querySnapshot = await getDocs(collection(fireDB, 'uploadedFiles'));
      const files = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUploadedFiles(files);
    } catch (err) {
      console.error('Error fetching files:', err);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleDeleteFromFirebase = async (fileId: string, fileName: string) => {
    try {
      setDeletingId(fileId);
      const fileRef = ref(storage, `uploads/${fileName}`);
      await deleteObject(fileRef);
      await deleteDoc(doc(fireDB, 'uploadedFiles', fileId));
      fetchUploadedFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadFromFirebase = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Translation</h2>

        <div className="mb-4 flex items-center gap-4">
          <input type="file" onChange={handleFileChange} />
          {file && (
            <button
              onClick={uploadFileToFirebase}
              disabled={uploading}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {uploading ? 'Uploading...' : 'Upload to Firebase'}
            </button>
          )}
        </div>

        {loadingFiles ? (
          <div className="text-center mt-8 text-gray-600">Loading files...</div>
        ) : uploadedFiles.length > 0 ? (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Uploaded Files</h3>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Size</th>
                  <th className="border p-2">Uploaded</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {uploadedFiles.map((file) => {
                  const sizeInKB = (file.size / 1024).toFixed(2);
                  const uploadedDate = file.createdAt?.seconds
                    ? new Date(file.createdAt.seconds * 1000).toLocaleString()
                    : 'Pending...';

                  return (
                    <tr key={file.id}>
                      <td className="border p-2">{file.name}</td>
                      <td className="border p-2">{sizeInKB} KB</td>
                      <td className="border p-2">{uploadedDate}</td>
                      <td className="border p-2 flex gap-2 items-center">
                        <button
                          onClick={() =>
                            handleDownloadFromFirebase(file.url, file.name)
                          }
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Download
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteFromFirebase(file.id, file.name)
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                          disabled={deletingId === file.id}
                        >
                          {deletingId === file.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 mt-4">No files uploaded yet.</p>
        )}
      </div>
    </Layout>
  );
};

export default Translation;
