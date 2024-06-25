import { useContext, useState } from "react";
import DropZone from "../components/DropZone";
import { Alert, AlertTitle, CircularProgress } from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";

const ImageUpload = ({ config }) => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState({
    msg: "",
    severity: "",
  });
  const [uploading, setUploading] = useState(false); // State to track uploading status
  const { token } = useContext(AuthContext);

  async function MockResolveNotOk() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ok: false, // Change this to true to simulate a successful response
          status: 400, // You can set any HTTP status code
          json: async () => ({
            error: { message: "Mocked error message" },
          }),
        });
      }, 2000);
    });
  }

  async function MockResolveOk() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ok: true, // Change this to true to simulate a successful response
          status: 200, // You can set any HTTP status code
          json: async () => ({
            message: "Mocked message",
          }),
        });
      }, 2000);
    });
  }

  const uploadToCloudinary = async (file) => {
    setMessage({
      msg: `Uploading ${file.name} to Cloudinary...`,
      severity: "info",
    });

    const data = new FormData();
    data.append("file", file);
    data.append("api_key", config.apiKey);
    data.append("upload_preset", config.presetName);
    data.append("tags", config.presetName);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
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
    return result.secure_url;
  };

  const uploadToServer = async (file, fileUrl) => {
    setMessage({
      msg: `Uploading ${file.name} to the server...`,
      severity: "info",
    });

    const data = {
      fileUrl,
    };

    const response = await fetch(`http://localhost:3000/api/images/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error.message);
    }
  };

  const uploadImages = async () => {
    setUploading(true);
    let allUploadsSuccessful = true;

    for (let file of files) {
      try {
        let fileUrl = URL.createObjectURL(file);
        console.log(fileUrl); // blob

        if (config?.useCld) {
          fileUrl = await uploadToCloudinary(file);
        }

        await uploadToServer(file, fileUrl);
      } catch (error) {
        setMessage({
          msg: `Error during upload: ${error.message}`,
          severity: "error",
        });
        allUploadsSuccessful = false;
        break;
      }
    }

    if (allUploadsSuccessful) {
      setMessage({
        msg: "All files uploaded successfully.",
        severity: "success",
      });
    }

    setFiles([]);
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
