

// export default Uploadjson;
import { PinataSDK } from "pinata-web3";
import React, { useState } from "react";

const UploadJson = ({defaultPrice}) => {
  const pinata = new PinataSDK({
    pinataJwt:
     "Replace with your actual JWT", // 
    pinataGateway: "replace with your gateway",
  });

  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);

  const handleUpload = async () => {
    setUploading(true);
    setError(null); // Reset any previous errors

    try {
      const upload = await pinata.upload.json({
        name: "Pinnie NFT",
        description: "A Pinnie NFT from Pinata",
        price:defaultPrice
      });
      setUploadResult(upload);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload JSON to Pinata.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <button className="p-2 bg-blue-600 rounded-lg " onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {uploadResult && <div>Upload successful: {JSON.stringify(uploadResult)}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default UploadJson;
