"use client";
import { useState } from "react";

const UploadForm = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    console.log("File selected:", e.target.files[0]);
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    if (!file) {
      console.log("No file selected");
      return;
    }

    setUploading(true);
    console.log("Preparing to upload file:", file);

    const formData = new FormData();
    formData.append("file", file);

    const requestTime = new Date().toISOString();
    console.log("Request Time (Client):", requestTime);

    try {
      console.log("Uploading file:", file);
      const response = await fetch("/api/s3-upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Upload response data:", data);
      setUploading(false);
    } catch (error) {
      console.log("Error during upload:", error);
      setUploading(false);
    }
  };

  return (
    <>
      <h1>Upload Files to S3 Bucket</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={!file || uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </>
  );
};

export default UploadForm;
