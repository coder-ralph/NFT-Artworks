import React, { useEffect, useState } from 'react';
import axios from 'axios';
import mediumZoom from 'medium-zoom';
import { motion } from 'framer-motion';

const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.REACT_APP_PINATA_SECRET_KEY;
const PAGE_SIZE = 10;

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

const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [messages, setMessages] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        fetchAllFiles();
    }, []);

    useEffect(() => {
        if (uploadedFiles.length > 0) {
            const zoom = mediumZoom('.zoomable', { margin: 24 });
            return () => zoom.detach();
        }
    }, [uploadedFiles]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const validFiles = selectedFiles.filter(file => 
            file.type.startsWith('image/') && file.size <= 25 * 1024 * 1024
        );

        if (validFiles.length === 0) {
            setMessages('Please select valid image files under 25 MB.');
            setFiles([]);
            return;
        }

        setFiles(validFiles);
        setMessages('');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const selectedFiles = Array.from(e.dataTransfer.files);
        handleFileChange({ target: { files: selectedFiles } });
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setMessages('Please select a file to upload.');
            showToastMessage();
            return;
        }

        setUploading(true);
        const uploadPromises = files.map(async (file) => {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
                    headers: {
                        'pinata_api_key': PINATA_API_KEY,
                        'pinata_secret_api_key': PINATA_SECRET_KEY,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                return {
                    name: file.name,
                    cid: response.data.IpfsHash,
                    url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
                    type: file.type || 'application/octet-stream',
                };
            } catch (error) {
                console.error('Error uploading file:', error);
                setMessages((prev) => prev + ' Error uploading ' + file.name + '. ');
                return null;
            }
        });

        const results = await Promise.all(uploadPromises);
        const successfulUploads = results.filter(file => file !== null);

        if (successfulUploads.length > 0) {
            setUploadedFiles((prevFiles) => [...successfulUploads, ...prevFiles]);
            setMessages('Files uploaded successfully!');
            showToastMessage();
        }

        setFiles([]);
        setUploading(false);
    };

    const showToastMessage = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const fetchAllFiles = async () => {
        let allFiles = [];
        let page = 0;
        let moreFiles = true;

        setInitialLoading(true);

        while (moreFiles) {
            try {
                const response = await axios.get(`https://api.pinata.cloud/data/pinList?status=pinned&pageLimit=${PAGE_SIZE}&pageOffset=${page * PAGE_SIZE}`, {
                    headers: {
                        'pinata_api_key': PINATA_API_KEY,
                        'pinata_secret_api_key': PINATA_SECRET_KEY,
                    },
                });

                const uploadedNFTs = response.data.rows.filter(row => row.ipfs_pin_hash.startsWith('Qm'));
                const files = uploadedNFTs.map(nft => ({
                    name: nft.ipfs_pin_hash,
                    url: `https://gateway.pinata.cloud/ipfs/${nft.ipfs_pin_hash}`,
                }));

                allFiles = [...allFiles, ...files];
                
                moreFiles = files.length === PAGE_SIZE;
                page += 1;
            } catch (error) {
                console.error('Error fetching uploaded files:', error);
                moreFiles = false;
            }
        }

        setUploadedFiles(allFiles);
        setInitialLoading(false);
    };

    return (
        <div className="mt-8 flex flex-col items-center px-4 sm:px-0">
            <div className="flex flex-col w-full">
                <div
                    className="border-dashed border-2 border-gray-300 rounded-lg w-full p-4 text-center cursor-pointer hover:bg-gray-100"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => document.getElementById('file-input').click()}
                >
                    <p className="text-gray-500">
                        {files.length > 0 ? `${files.length} file(s) selected` : 'Choose files or drag here to preview'}
                    </p>
                    <input
                        type="file"
                        id="file-input"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        multiple
                    />
                </div>
                <button 
                    onClick={handleUpload} 
                    className="bg-blue-500 text-white rounded p-2 mt-4 flex items-center justify-center gap-2 shadow-lg transition-transform transition-shadow duration-300 ease-in-out hover:bg-blue-600 hover:shadow-xl"
                >
                    {uploading ? (
                        <span className="animate-spin">Uploading...</span>
                    ) : (
                        <>
                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="text-white" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            Upload
                        </>
                    )}
                </button>
            </div>

            <div className="mt-20">
                <h3 className="font-nft text-2xl font-bold mb-4 text-center">NFT Gallery</h3>
                {initialLoading ? (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {uploadedFiles.length > 0 ? (
                            uploadedFiles.map((uploadedFile, index) => (
                                <motion.div
                                    key={`${uploadedFile.cid}-${index}`}
                                    className="relative group overflow-hidden rounded-lg shadow-lg"
                                    variants={itemVariants}
                                >
                                    <img
                                        src={uploadedFile.url}
                                        alt={uploadedFile.name}
                                        className="w-full h-full object-cover sm:w-48 sm:h-48 sm:object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg zoomable"
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <p>No files uploaded yet.</p>
                        )}
                    </motion.div>
                )}
            </div>

            {showToast && (
                <div className="fixed bottom-4 right-4 bg-blue-100 text-blue-800 border border-blue-300 rounded-md p-2 shadow-lg transition-opacity duration-300 opacity-100">
                    {messages}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
