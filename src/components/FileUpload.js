import React, { useState } from "react";
import { supabase } from "../lib/SupaBaseClient";
import Image from "next/image";

const FileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      setUploading(true);
      if (!file) {
        alert("No file chosen");
        return;
      }
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error } = await supabase.storage
        .from("images_and_videos")
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      const { data: url } = await supabase.storage
        .from("images_and_videos")
        .getPublicUrl(filePath);

      setFileUrl(url.publicUrl);
      onUpload(url.publicUrl);
      alert("File uploaded successfully");
    } catch (error) {
      alert("Error uploading file: ", error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {fileUrl && (
        <div>
          <p>File uploaded to: {fileUrl}</p>
          <Image
            src={fileUrl}
            alt="Uploaded Image"
            width="300px"
            height="300px"
            style={{ width: "300px", height: "300px" }}
          />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
