import { AdvancedImage, placeholder, responsive } from "@cloudinary/react";
import DropZone from "../components/DropZone";
import { useEffect, useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import ButtonDelete from "../components/ButtonDelete";
import { Alert, AlertTitle } from "@mui/material";

export default function Images() {
  const [files, setFiles] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [message, setMessage] = useState({
    upload_msg: "",
    read_list_msg: "",
    severity: "",
  });

  //config
  const apiKey = "291738647398191";
  const presetName = "guflpyvn";
  const cld = new Cloudinary({ cloud: { cloudName: "dzsehmvrr" } });

  //functions
  const uploadImagesCLOUD = async () => {
    for (const file of files) {
      const data = new FormData();
      data.append("file", file);
      data.append("api_key", apiKey);
      data.append("upload_preset", presetName);
      data.append("tags", presetName);

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dzsehmvrr/image/upload",
          {
            method: "POST",
            body: data,
          }
        );

        if (!response.ok) {
          const result = await response.json();
          setMessage({
            upload_msg: `Error uploading image: ${result.error.message}`,
            read_list_msg: message.read_list_msg,
            severity: "error",
          });
        } else {
          setMessage({
            upload_msg: "Upload successful",
            read_list_msg: message.read_list_msg,
            severity: "success",
          });
          setFiles([]);
          await readImagesCLOUD();
        }
      } catch (error) {
        console.error("Error during upload:", error);
        setMessage({
          upload_msg: `Error during upload: ${error.message}`,
          read_list_msg: message.read_list_msg,
          severity: "error",
        });
      }
    }
  };

  const readImagesCLOUD = async () => {
    try {
      const response = await fetch(
        `https://res.cloudinary.com/dzsehmvrr/image/list/${presetName}.json`
      );

      if (!response.ok) {
        const result = await response.json();
        console.error("Error reading images:", result.error.message);
        setMessage({
          upload_msg: message.upload_msg,
          read_list_msg: `Error reading images: ${result.error.message}`,
          severity: "error",
        });
      } else {
        const result = await response.json();
        setImageList(result.resources);
      }
    } catch (error) {
      console.error("Error during read:", error);
      setMessage({
        upload_msg: message.upload_msg,
        read_list_msg: `Error during read: ${error.message}`,
        severity: "error",
      });
    }
  };

  useEffect(() => {
    readImagesCLOUD();
  }, []);

  return (
    <>
      <h2>Add Image</h2>
      <DropZone props={{ files, setFiles }} />
      {message.upload_msg && (
        <Alert severity={message.severity}>
          <AlertTitle> {message.upload_msg}</AlertTitle>
        </Alert>
      )}
      {files.length > 0 && <button onClick={uploadImagesCLOUD}>Upload</button>}
      <h2>Library</h2>
      {message.read_list_msg && (
        <Alert severity={message.severity}>
          <AlertTitle> {message.read_list_msg}</AlertTitle>
        </Alert>
      )}
      <div className="imageLibrary">
        {imageList.map((img) => {
          const cldImg = cld.image(img.public_id).quality("auto");

          return (
            <div key={img.public_id || img.id} style={{ marginBottom: "20px" }}>
              <ButtonDelete />
              <div style={{ width: "200px" }} className="image">
                <AdvancedImage
                  style={{ maxWidth: "100%" }}
                  cldImg={cldImg}
                  plugins={[responsive()]}
                />
              </div>
              <input type="text" />
            </div>
          );
        })}
      </div>
    </>
  );
}
