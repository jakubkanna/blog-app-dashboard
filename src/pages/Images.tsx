import "../styles/Images.scss";
import ImagesUploader from "../components/ImagesUploader";
import ImagesLibrary from "../components/ImagesLibrary";
import { ImageInstance } from "../../types";
import { useState } from "react";

export default function Images() {
  const [imageList, setImageList] = useState<ImageInstance[]>([]);

  return (
    <>
      <ImagesUploader setImageList={setImageList} />
      <ImagesLibrary imageList={imageList} setImageList={setImageList} />
    </>
  );
}
