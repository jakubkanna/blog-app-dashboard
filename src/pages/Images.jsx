import { AdvancedImage } from "@cloudinary/react";
import DropZone from "../components/DropZone";
import { useEffect, useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";

export default function Images() {
  const [files, setFiles] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [message, setMessage] = useState({ upload: "", read_list: "" });

  const cdnTag = "guflpyvn";
  const cld = new Cloudinary({ cloud: { cloudName: "dzsehmvrr" } });

  const uploadImagesCDN = async () => {
    for (const file of files) {
      const data = new FormData();
      data.append("file", file);
      data.append("api_key", "291738647398191");
      data.append("upload_preset", "guflpyvn");
      data.append("tags", cdnTag);

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
          setMessage((prev) => ({
            ...prev,
            upload: `Error uploading image: ${result.error.message}`,
          }));
        } else {
          setMessage((prev) => ({ ...prev, upload: "Upload successful" }));
          setFiles([]);
          await readImagesCDN();
        }
      } catch (error) {
        console.error("Error during upload:", error);
        setMessage((prev) => ({
          ...prev,
          upload: `Error during upload: ${error.message}`,
        }));
      }
    }
  };

  const readImagesCDN = async () => {
    try {
      const response = await fetch(
        `https://res.cloudinary.com/dzsehmvrr/image/list/${cdnTag}.json`
      );

      if (!response.ok) {
        const result = await response.json();
        console.error("Error reading images:", result.error.message);
        setMessage((prev) => ({
          ...prev,
          read_list: `Error reading images: ${result.error.message}`,
        }));
      } else {
        const result = await response.json();
        setImageList(result.resources);
      }
    } catch (error) {
      console.error("Error during read:", error);
      setMessage((prev) => ({
        ...prev,
        read_list: `Error during read: ${error.message}`,
      }));
    }
  };

  useEffect(() => {
    readImagesCDN();
  }, []);

  return (
    <>
      <h2>Add Image</h2>
      <DropZone props={{ files, setFiles }} />
      {message.upload && <div className="upload-message">{message.upload}</div>}
      {files.length > 0 && <button onClick={uploadImagesCDN}>Upload</button>}
      <h2>Library</h2>
      {message.read_list && (
        <div className="library-message">{message.read_list}</div>
      )}
      <div className="imageLibrary">
        {imageList.map((img) => {
          const cldImg = cld
            .image(img.public_id)
            .format("auto")
            .quality("auto")
            .resize(auto().gravity(autoGravity()).width(300).height(300));

          return (
            <div className="image" key={img.public_id}>
              <AdvancedImage cldImg={cldImg} />
            </div>
          );
        })}
      </div>
    </>
  );
}
