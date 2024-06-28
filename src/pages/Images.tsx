import "../styles/Images.scss";
import ImageUpload from "../components/ImageUpload";
import Library from "../components/Library";
import { ImageInstance } from "../../types";
import { useState } from "react";

export default function Images() {
  const [imageList, setImageList] = useState<ImageInstance[]>([]);

  return (
    <>
      <ImageUpload imageList={imageList} setImageList={setImageList} />
      <Library imageList={imageList} setImageList={setImageList} />
    </>
  );
}
