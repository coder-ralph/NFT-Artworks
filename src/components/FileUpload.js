import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.REACT_APP_PINATA_SECRET_KEY;
const PAGE_SIZE = 10;

const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [messages, setMessages] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

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
            setMessages('No files yet uploaded. Please select files.');
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

    useEffect(() => {
        fetchAllFiles();
    }, []);

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
                    className="bg-blue-500 text-white rounded p-2 mt-4"
                >
                    {uploading ? (
                        <span className="animate-spin">Uploading...</span>
                    ) : (
                        'Upload'
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {uploadedFiles.length > 0 ? (
                            uploadedFiles.map((uploadedFile, index) => (
                                <div key={`${uploadedFile.cid}-${index}`} className="relative group overflow-hidden rounded-lg shadow-lg">
                                    <img 
                                        src={uploadedFile.url} 
                                        alt={uploadedFile.name} 
                                        className="w-full h-full object-cover sm:w-48 sm:h-48 sm:object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg" 
                                    />
                                </div>
                            ))
                        ) : (
                            <p>No files uploaded yet.</p>
                        )}
                    </div>
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
