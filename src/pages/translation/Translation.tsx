import React, { useState, useEffect } from 'react';
import Layout from '../../component/layout/Layout';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { fireDB, storage } from '../../firebase/FirebaseConfig';

const Translation = () => {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      const querySnapshot = await getDocs(collection(fireDB, 'uploadedFiles'));
      const filesData = [];
      querySnapshot.forEach((doc) => {
        filesData.push({ id: doc.id, ...doc.data() });
      });
      setUploadedFiles(filesData);
    } catch (error) {
      console.error('Error fetching uploaded files:', error);
    }
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    const uploadPromises = files.map((file) => {
      const storageRef = ref(storage, `Translation/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          null,
          (error) => reject(error),
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              const docRef = await addDoc(collection(fireDB, 'uploadedFiles'), {
                name: file.name,
                url: downloadURL,
                path: `Translation/${file.name}`,
              });
              resolve({ id: docRef.id, name: file.name, url: downloadURL, path: `Translation/${file.name}` });
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    });

    try {
      const uploaded = await Promise.all(uploadPromises);
      setUploadedFiles((prev) => [...prev, ...uploaded]);
      setFiles([]);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const handleDelete = async (file) => {
    try {
      const fileRef = ref(storage, file.path);
      await deleteObject(fileRef);
      await deleteDoc(doc(fireDB, 'uploadedFiles', file.id));
      setUploadedFiles((prev) => prev.filter((f) => f.id !== file.id));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleDownload = (url, name) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Translation</h2>

        <div className="mb-4">
          <input type="file" multiple onChange={handleFileChange} />
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white px-4 py-2 ml-2 rounded"
            disabled={files.length === 0}
          >
            Upload
          </button>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Uploaded Files:</h3>
            <ul>
              {uploadedFiles.map((file) => (
                <li key={file.id} className="mb-2">
                  <span className="mr-2">{file.name}</span>
                  <button
                    onClick={() => handleDelete(file)}
                    className="bg-red-500 text-white px-2 py-1 mr-2 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleDownload(file.url, file.name)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Download
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Translation;
