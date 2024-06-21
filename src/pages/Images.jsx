import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AdvancedImage } from "@cloudinary/react";
import DropZone from "../components/DropZone";
import { useState } from "react";

export default function Images() {
  const [files, setFiles] = useState([]);

  const uploadImages = async () => {
    console.log(files);

    for (const file of files) {
      const data = new FormData();
      data.append("file", file);
      data.append("api_key", "");
      data.append("timestamp", "");
      data.append("signature", "");

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/guflpyvn/image/upload",
          {
            method: "POST",
            body: data,
          }
        );

        const result = await response.json();

        if (!response.ok) {
          console.error("Error uploading image:", result);
        } else {
          console.log("Upload successful:", result);
        }
      } catch (error) {
        console.error("Error during upload:", error);
      }
    }
  };

  //cld
  const cld = new Cloudinary({ cloud: { cloudName: "dzsehmvrr" } });

  // Use this sample image or upload your own via the Media Explorer
  const img = cld
    .image("cld-sample-5")
    .format("auto") // Optimize delivery by resizing and applying auto-format and auto-quality
    .quality("auto")
    .resize(auto().gravity(autoGravity()).width(500).height(500)); // Transform the image: auto-crop to square aspect_ratio

  return (
    <>
      <h2>Add Image</h2>
      <DropZone props={{ files, setFiles }} />
      {files.length > 0 && <button onClick={uploadImages}>Upload</button>}

      <h2>Library</h2>
      <AdvancedImage cldImg={img} />
    </>
  );
}
