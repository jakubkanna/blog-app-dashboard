import { useContext, useState } from "react";
import DropZone from "./DropZone";
import { Alert, AlertTitle, CircularProgress } from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";

function getFileNameWithoutExtension(fileName: string): string {
  const index = fileName.lastIndexOf(".");
  return index === -1 ? fileName : fileName.substring(0, index);
}

interface Config {
  apiKey: string;
  presetName: string;
  cloudName: string;
  useCld: boolean;
}

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
}

type Severity = "error" | "warning" | "info" | "success";

const ImageUpload = ({ config }: { config: Config }) => {
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

  //can be removed later

  //async function MockResolveNotOk() {
  //   return new Promise<Response>((resolve) => {
  //     setTimeout(() => {
  //       resolve({
  //         ok: false,
  //         status: 400,
  //         json: async () => ({ error: { message: "Mocked error message" } }),
  //       } as Response);
  //     }, 2000);
  //   });
  // }

  // async function MockResolveOk() {
  //   return new Promise<Response>((resolve) => {
  //     setTimeout(() => {
  //       resolve({
  //         ok: true,
  //         status: 200,
  //         json: async () => ({
  //           message: "Mocked message",
  //         }),
  //       } as Response);
  //     }, 2000);
  //   });
  // }

  const uploadToCloudinary = async (file: File) => {
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
    console.log("uploadResult", uploadResult);
    instance.url = uploadResult.url;
    instance.secure_url = uploadResult.secure_url;
    instance.original_path ||= file.name;
    instance.bytes ||= file.size;
    instance.public_id ||= getFileNameWithoutExtension(file.name);

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
        let imgInstance: ImageInstance | undefined;

        if (config?.useCld) {
          const cldData = await uploadToCloudinary(file);
          console.log("cldData", cldData);
          imgInstance = {
            original_path: file.name,
            url: "",
            public_id: cldData.public_id,
            cld_url: cldData.url,
            cld_secure_url: cldData.secure_url,
            filename: cldData.original_filename,
            format: cldData.format,
            bytes: cldData.bytes,
            tags: [...cldData.tags, "cld"],
          };
        }

        if (imgInstance) {
          await uploadToServer(file, imgInstance);
        }
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
