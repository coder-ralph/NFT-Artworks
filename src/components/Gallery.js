import React, { useState, useEffect } from "react";
import axios from "axios";
import mediumZoom from "medium-zoom";
import { motion } from "framer-motion";
import SubmitFormModal from "./SubmitFormModal";
import { PinataSDK } from "pinata";
import GetfileData from "./GetfileData";

const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.REACT_APP_PINATA_SECRET_KEY;
const PINATA_JWT = process.env.REACT_APP_PINATA_JWT;
const PAGE_SIZE = 10;

const pinata = new PinataSDK({
  pinataJwt: PINATA_JWT,
  pinataGateway: "black-perfect-barnacle-746.mypinata.cloud",
});

const options = {method: 'DELETE', headers: {Authorization: 'Bearer <token>'}};

fetch('https://api.pinata.cloud/v3/files/{id}', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));


const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const Gallery = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [Price, setPrice] = useState("");

  const categories = [
    "All",
    "Art",
    "Music",
    "Collectibles",
    "Gaming",
    "Sports",
    "Virtual Real Estate",
    "Domain Names",
    "Memes",
  ];

  useEffect(() => {
    fetchAllFiles();
  }, []);

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      const zoom = mediumZoom(".zoomable", { margin: 24 });
      return () => zoom.detach();
    }
  }, [uploadedFiles]);

  const fetchAllFiles = async () => {
    let allFiles = [];
    let page = 0;
    let moreFiles = true;

    setInitialLoading(true);

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
          row.ipfs_pin_hash.startsWith("Qm")
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
    setInitialLoading(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="mt-2 flex flex-col items-center px-4 sm:px-0">
      {/* Submit Button */}
      <button
        onClick={openModal}
        className="mb-4 flex items-center justify-center text-sm font-medium h-9 rounded-md px-3 transition-colors gap-2 bg-blue-700 text-white hover:bg-blue-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-send"
        >
          <path d="m22 2-7 20-4-9-9-4Z"></path>
          <path d="M22 2 11 13"></path>
        </svg>
        <span>Submit</span>
      </button>
      

      {/* Modal for file upload */}
      {isModalOpen && (
        <SubmitFormModal
          closeModal={closeModal}
          setUploadedFiles={setUploadedFiles}
          setPrice={setPrice}
        />
      )}

      <div className="mt-10 min-h-[300px]">
        <h3 className="font-nft text-3xl font-bold mb-4 text-center">
          Gallery
        </h3>
      
        <div className="mb-4 flex flex-wrap justify-center">
          {categories.map((category) => (
            <button
              key={category}
              className={`btn ${
                selectedCategory === category ? "btn-selected bg-blue-500" : ""
              } border-black border-2 p-2`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {initialLoading ? (
          <div className="mt-6 flex items-center justify-center w-full h-full min-h-[200px]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
           {console.log(uploadedFiles)
           }
            {uploadedFiles.length > 0 ? (
              uploadedFiles.map((uploadedFile, index) => (         
                <motion.div
                key={`${uploadedFile.cid}-${index}`}
                className="mt-4 relative group overflow-hidden rounded-lg shadow-lg"
                variants={itemVariants}
              >
                <img
                  src={uploadedFile.url}
                  alt={uploadedFile.name}
                  className="w-full h-full aspect-square object-cover sm:w-48 sm:h-48 sm:object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg zoomable"
                />
              
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-center">
                  <span className="text-sm font-semibold">{index+1}</span>
                </div>  
              </motion.div>   
              ))
            ) : (
              <p>No files uploaded yet.</p>
            )}
          </motion.div>
        )}
          <GetfileData></GetfileData>
      </div>
    </div>
  );
};

export default Gallery;
