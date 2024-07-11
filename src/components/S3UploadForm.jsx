
"use client";
import { useState } from "react";

const S3UploadForm = ({ onUpload, id, type }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleUpload = async () => {
    if (!files.length) return;

    setUploading(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`/api/s3-upload?id=${id}&type=${type}`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Upload failed:', errorData);
          continue;
        }

        const data = await response.json();
        console.log('Upload response data:', data);
        onUpload(file); // Call the onUpload callback with the file
      }
      setUploading(false);
    } catch (error) {
      console.log('Error uploading file:', error);
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept={type === 'image' ? "image/*" : "video/*"} multiple onChange={handleFileChange} />
      <button type="button" onClick={handleUpload} disabled={!files.length || uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default S3UploadForm;
