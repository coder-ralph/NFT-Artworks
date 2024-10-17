import React, { useState } from "react";
import axios from "axios";
import UploadJson from "./Uploadjson";
const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.REACT_APP_PINATA_SECRET_KEY;

const SubmitForm = ({ setUploadedFiles, closeModal }) => {
  const [files, setFiles] = useState([]);
  const [messages, setMessages] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Art");
  const [defaultPrice, setDefaultPrice] = useState("");

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(
      (file) => file.type.startsWith("image/") && file.size <= 25 * 1024 * 1024
    );

    if (validFiles.length === 0) {
      setMessages("Please select valid image files under 25 MB.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setFiles([]);
      return;
    }

    setFiles(validFiles);
    setMessages("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selectedFiles = Array.from(e.dataTransfer.files);
    handleFileChange({ target: { files: selectedFiles } });
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      setMessages("Please select a file to upload.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (!defaultPrice) {
      setMessages("Please enter a default price for the NFT.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    setUploading(true);
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      
      // Create metadata object
      const metadata = {
        name: file.name,
        keyValues: {
          category: selectedCategory,
          price: defaultPrice,
        },
      };

      // Send file and metadata together
      try {
        const response = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          formData,
          {
            headers: {
              pinata_api_key: PINATA_API_KEY,
              pinata_secret_api_key: PINATA_SECRET_KEY,
              "Content-Type": "multipart/form-data",
            },
            params: {
              metadata: JSON.stringify(metadata),
            },
          }
        );

        return {
          name: file.name,
          cid: response.data.IpfsHash,
          url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
          type: file.type || "application/octet-stream",
          category: selectedCategory,
          price: defaultPrice,
        };
      } catch (error) {
        console.error("Error uploading file:", error);
        setMessages((prev) => prev + " Error uploading " + file.name + ". ");
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter((file) => file !== null);

    if (successfulUploads.length > 0) {
      setUploadedFiles((prevFiles) => [...successfulUploads, ...prevFiles]);
      setMessages("Files uploaded successfully!");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        closeModal();
      }, 3000);
    }

    setFiles([]);
    setUploading(false);
  };

  return (
    <div className="mt-8 flex flex-col items-center px-4 sm:px-0">
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-blue-100 text-blue-800 border border-blue-300 rounded-md p-2 shadow-lg transition-opacity duration-300 opacity-100">
          {messages}
        </div>
      )}
      <div className="bg-white rounded-lg max-w-md w-full">
        <h1 className="text-xl text-black dark:text-white font-semibold text-center mb-4">
          Submit NFT Artworks
        </h1>
        <p className="text-sm text-center text-gray-600 mb-4">
          This will automatically be added to the gallery.
        </p>
        <div className="flex justify-center p-2">
          <label className="mr-4 text-black dark:text-white">Category</label>
          <select
            className="text-center border-black border-2 rounded-md text-black dark:text-white bg-white dark:bg-gray-700"
            name="nftCategory"
            id="nftCategory"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="art">Art</option>
            <option value="music">Music</option>
            <option value="collectibles">Collectibles</option>
            <option value="gaming">Gaming</option>
            <option value="sports">Sports</option>
            <option value="virtualRealEstate">Virtual Real Estate</option>
            <option value="domainNames">Domain Names</option>
            <option value="memes">Memes</option>
          </select>
        </div>
        <div
          className="border-dashed border-2 border-gray-300 rounded-lg w-full p-4 text-center cursor-pointer hover:bg-gray-100 transition duration-200"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById("file-input").click()}
        >
          <p className="text-gray-500">
            {files.length > 0
              ? `${files.length} file(s) selected`
              : "Select or drag files here"}
          </p>
          <p className="text-gray-400 text-sm">Max file size is 25 MB</p>
          <input
            type="file"
            id="file-input"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
        </div>
        <div className="mt-4">
          <label htmlFor="defaultPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Default Price (in ETH)
          </label>
          <input
            type="number"
            id="defaultPrice"
            value={defaultPrice}
            onChange={(e) => setDefaultPrice(e.target.value)}
            placeholder="Enter price"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black dark:text-white bg-white dark:bg-gray-700"
          />
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleUpload}
            className="text-white rounded p-2 transition duration-200 hover:bg-blue-600"
          >
            {uploading ? (
              <span className="animate-spin">Uploading...</span>
            ) : (
              <UploadJson defaultPrice={defaultPrice}></UploadJson>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitForm;
