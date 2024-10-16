
import React, { useState, useEffect } from "react";
import axios from "axios";

const PinataFilesComponent = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileContent, setFileContent] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const PAGE_SIZE = 10;
  const PINATA_API_KEY = "add your own api key";
  const PINATA_SECRET_KEY =
    "add your own secret key";

  // Fetch files function
  const fetchFiles = async () => {
    setInitialLoading(true); // Set loading state before fetching
    let allFiles = [];
    let page = 0;
    let moreFiles = true;

    while (moreFiles) {
      try {
        const response = await axios.get(
          `https://api.pinata.cloud/data/pinList?status=pinned&pageLimit=${PAGE_SIZE}&pageOffset=${
            page * PAGE_SIZE
          }`,
          {
            headers: {
              pinata_api_key: `${PINATA_API_KEY}`,
              pinata_secret_api_key: `${PINATA_SECRET_KEY}`,
            },
          }
        );

        const uploadedNFTs = response.data.rows.filter((row) =>
          row.ipfs_pin_hash.startsWith("ba")
        );

        const files = uploadedNFTs.map((nft) => ({
          name: nft.ipfs_pin_hash,
          url: `https://gateway.pinata.cloud/ipfs/${nft.ipfs_pin_hash}`,
        }));

        allFiles = [...allFiles, ...files];
        moreFiles = files.length === PAGE_SIZE;
        page += 1;
      } catch (error) {
        console.error("Error fetching uploaded files:", error);
        moreFiles = false;
      }
    }

    setUploadedFiles(allFiles);
    setInitialLoading(false); // Stop loading state after fetching
  };

  useEffect(() => {
    fetchFiles(); // Fetch files when the component loads
  }, []);

  const fetchFileData = async (filename) => {
    try {
      const response = await axios.get(
        `https://gateway.pinata.cloud/ipfs/${filename}`
      );
      setFileContent(response.data);
    } catch (error) {
      console.error("Error fetching file data:", error);
    }
  };

  const openModal = (file) => {
    setSelectedFile(file);
    setIsModalOpen(true);
    fetchFileData(file.name);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFileContent(null);
  };

  if (initialLoading) {
    return <div className="text-center py-4">Loading files...</div>;
  }

  return (
    <div className="p-4">
      {/* Refresh Prices Button */}
      <div className="mb-4 flex justify-center">
        <button
          onClick={fetchFiles}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow-md hover:bg-blue-600 transition duration-300"
        >
          Refresh Prices
        </button>
      </div>

      <div className="flex items-center justify-center p-6 bg-gray-100 rounded-lg shadow-lg">
        <ul className="flex space-x-6">
            {console.log("hi from uploaded files",uploadedFiles)}
            
          {uploadedFiles.map((file, index) => (
            <li key={index} className="relative group">
              <button
                onClick={() => openModal(file)}
                className="px-4 py-2 bg-violet-500 text-white font-semibold rounded-md transition duration-300 transform hover:scale-105 hover:bg-violet-600 shadow-md"
              >
                Show Price of {index + 1} NFT
              </button>
             
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-2 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Price Of the NFT</h3>
            {fileContent ? (
              <pre className="text-sm overflow-auto h-40 bg-gray-100 p-2 rounded">
                {JSON.parse(fileContent.price, null, 2)}
              </pre>
            ) : (
              <div className="text-center">Loading file content...</div>
            )}
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PinataFilesComponent;

