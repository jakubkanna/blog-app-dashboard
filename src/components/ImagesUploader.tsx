import { useContext, useState } from "react";
import DropZone from "./DropZone";
import { Alert, AlertTitle, Button, CircularProgress } from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";
import { Severity } from "../../types";

const ImagesUploader = ({ setImageList }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<{
    msg: string;
    severity: Severity;
  }>({
    msg: "",
    severity: "info",
  });
  const [uploading, setUploading] = useState(false);
  const { token } = useContext(AuthContext);

  const uploadImages = async () => {
    try {
      setUploading(true);
      setMessage({
        msg: `Preparing files...`,
        severity: "info",
      });

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      setMessage({
        msg: `Uploading files...`,
        severity: "info",
      });

      const response = await fetch("http://localhost:3000/api/images/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to upload to server");
      }

      const result = await response.json();

      setMessage({
        msg: result.message,
        severity: "success",
      });

      // Update the image list without adding duplicates
      setImageList((prevList) => {
        const newImages = result.imageInstances.filter(
          (newImage) =>
            !prevList.some((image) => image.public_id === newImage.public_id)
        );
        return [...newImages, ...prevList];
      });
    } catch (error: any) {
      setMessage({
        msg: `Error during upload: ${error.message}`,
        severity: "error",
      });
    }

    setUploading(false);
    setFiles([]);
  };

  return (
    <>
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

export default ImagesUploader;
