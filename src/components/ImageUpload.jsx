import { useState } from "react";
import DropZone from "../components/DropZone";
import { Alert, AlertTitle, CircularProgress } from "@mui/material";

const ImageUpload = ({ config }) => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState({
    msg: "",
    severity: "",
  });
  const [uploading, setUploading] = useState(false); // State to track uploading status

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("api_key", config.apiKey);
    data.append("upload_preset", config.presetName);
    data.append("tags", config.presetName);

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dzsehmvrr/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error.message);
    }

    const result = await response.json();
    return result.secure_url; // Return the URL of the uploaded image
  };

  const uploadToDatabase = async (fileUrl) => {
    // Simulating a mock upload to the database
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(); // Simulate a successful upload
      }, 1000); // Simulate delay of 1 second
    });
  };

  const uploadImages = async () => {
    setUploading(true); // Set uploading status to true
    setMessage({
      msg: "Uploading image...",
      severity: "info",
    });

    for (const file of files) {
      try {
        let fileUrl = URL.createObjectURL(file); // Default to local URL for database upload

        if (config.cld) {
          // If Cloudinary config exists, upload to Cloudinary first
          setMessage({
            msg: "Uploading image to Cloudinary...",
            severity: "info",
          });
          fileUrl = await uploadToCloudinary(file);
        }

        setMessage({
          msg: "Uploading image to database...",
          severity: "info",
        });

        // Upload the file URL to your database (mocked )
        await uploadToDatabase(fileUrl);

        setMessage({
          msg: "Upload successful.",
          severity: "success",
        });
        setFiles([]);
      } catch (error) {
        setMessage({
          msg: `Error during upload: ${error.message}`,
          severity: "error",
        });
      }
    }

    setUploading(false);
  };

  return (
    <>
      <h2>Add Image</h2>
      <DropZone props={{ files, setFiles }} />
      {message.msg && (
        <Alert severity={message.severity}>
          <AlertTitle>{message.msg}</AlertTitle>
        </Alert>
      )}
      {files.length > 0 && (
        <button onClick={uploadImages} disabled={uploading}>
          {uploading ? (
            <>
              <CircularProgress size={24} /> Uploading...
            </>
          ) : (
            "Upload"
          )}
        </button>
      )}
    </>
  );
};

export default ImageUpload;
