import { useContext, useState } from "react";
import DropZone from "./DropZone";
import { Alert, AlertTitle, Button, CircularProgress } from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";
import { config } from "../../config";
import { ImageInstance, Severity } from "../../types";

const ImageUpload = ({ imageList, setImageList }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<{
    msg: string;
    severity: Severity | undefined;
  }>({
    msg: "",
    severity: undefined,
  });
  const [uploading, setUploading] = useState(false); // State to track uploading status
  const authContext = useContext(AuthContext);
  const token = authContext?.token;

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
      `${config.CLD_API_URL}${config.CLD_CLOUD_NAME}/image/upload`,
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
        msg: `Uploading ${file.name} to the server...`,
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

    // upload file to the server
    const uploadResult = await uploadFile();
    setMessage({ msg: uploadResult.message, severity: "info" });

    //
    instance.original_filename ||= file.name;
    instance.url ||= uploadResult.url;
    instance.secure_url ||= uploadResult.secure_url;
    instance.bytes ||= uploadResult.size;
    instance.dimensions ||= uploadResult.dimensions;
    instance.filename ||= uploadResult.filename;
    instance.format ||= uploadResult.format;
    instance.path ||= uploadResult.path;

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
      setMessage({ msg: result.message, severity: "info" });
      return result;
    };

    // save instance in database
    const imageInstanceResult = await createImageInstance();

    setImageList((prevList) => {
      // Check if the new image instance already exists in the list
      const existingIndex = prevList.findIndex(
        (item) => item.public_id === imageInstanceResult.imageinstance.public_id
      );

      if (existingIndex !== -1) {
        // If the image with the same public_id exists, replace it
        const updatedList = prevList.map((item, index) =>
          index === existingIndex ? imageInstanceResult.imageinstance : item
        );
        return updatedList;
      } else {
        // If the image does not exist (new image), prepend it to the list
        return [imageInstanceResult.imageinstance, ...prevList];
      }
    });

    console.log(imageList);
  };

  const uploadImages = async () => {
    setUploading(true);
    let allUploadsSuccessful = true;

    for (let file of files) {
      try {
        let imgInstance: ImageInstance = {
          original_filename: "",
          path: "",
          url: "",
          bytes: 0,
          public_id: "",
          dimensions: { width: 0, height: 0 },
        };

        if (config.ENABLE_CLD) {
          const cldData = await uploadToCloudinary(file);
          imgInstance = {
            original_filename: "",
            path: "",
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
