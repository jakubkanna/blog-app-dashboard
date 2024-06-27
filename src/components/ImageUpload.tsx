import { useContext, useState } from "react";
import DropZone from "./DropZone";
import { Alert, AlertTitle, CircularProgress } from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";
import { config } from "../../config";

interface ImageInstance {
  url: string;
  original_path: string;
  bytes: number;
  public_id: string;
  secure_url?: string;
  cld_url?: string;
  cld_secure_url?: string;
  format?: string;
  filename?: string;
  alt?: string;
  tags?: string[];
  dimensions?: { width: {}; height: {} };
}

type Severity = "error" | "warning" | "info" | "success";

const ImageUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<{
    msg: string;
    severity: Severity | undefined;
  }>({
    msg: "",
    severity: undefined,
  });
  const [uploading, setUploading] = useState(false); // State to track uploading status
  const { token } = useContext(AuthContext);

  const uploadToCloudinary = async (file: File) => {
    setMessage({
      msg: `Uploading ${file.name} to Cloudinary...`,
      severity: "info",
    });

    const data = new FormData();
    data.append("file", file);
    data.append("api_key", config.CLD_API_KEY);
    data.append("upload_preset", config.CLD_PRESET_NAME);
    data.append("tags", config.CLD_PRESET_NAME);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${config.CLD_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error.message);
    }

    return result;
  };

  const uploadToServer = async (file: File, instance: ImageInstance) => {
    const uploadFile = async () => {
      setMessage({
        msg: "Uploading ${file.name} to the server...",
        severity: "info",
      });
      const data = new FormData();
      data.append("file", file);

      const response = await fetch("http://localhost:3000/api/images/upload", {
        method: "POST",
        body: data,
        headers: {
          Authorization: `${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error.message);
      }

      return result;
    };

    //upload file to the server
    const uploadResult = await uploadFile();
    setMessage({ msg: uploadResult.message, severity: "info" });
    console.log(uploadResult);
    instance.original_path = file.name;
    instance.url = uploadResult.url;
    instance.secure_url = uploadResult.secure_url;
    instance.bytes = file.size;
    instance.dimensions = uploadResult.dimensions;
    instance.filename = uploadResult.filename;

    const createImageInstance = async () => {
      setMessage({
        msg: `Creating image instance in database...`,
        severity: "info",
      });

      const response = await fetch(`http://localhost:3000/api/images/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(instance),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error.message);
      }

      return result;
    };

    //save instance in database
    const createResult = await createImageInstance();
    setMessage({ msg: createResult.message, severity: "info" });
  };

  const uploadImages = async () => {
    setUploading(true);
    let allUploadsSuccessful = true;

    for (let file of files) {
      try {
        let imgInstance: ImageInstance = {
          url: "",
          original_path: "",
          bytes: 0,
          public_id: "",
          dimensions: { width: 0, height: 0 },
        };

        if (config.USE_CLD) {
          const cldData = await uploadToCloudinary(file);
          console.log("cldData", cldData);
          imgInstance = {
            original_path: file.name,
            url: "",
            dimensions: { width: cldData.width, height: cldData.height },
            public_id: cldData.public_id,
            cld_url: cldData.url,
            cld_secure_url: cldData.secure_url,
            filename: cldData.original_filename,
            format: cldData.format,
            bytes: cldData.bytes,
            tags: [...cldData.tags, "cld"],
          };
        }

        await uploadToServer(file, imgInstance);
      } catch (error: any) {
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
        <Button onClick={uploadImages} disabled={uploading}>
          {uploading ? (
            <>
              <CircularProgress size={24} /> Uploading...
            </>
          ) : (
            "Upload"
          )}
        </Button>
      )}
    </>
  );
};

export default ImageUpload;
