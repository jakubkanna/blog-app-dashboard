import ImagesUploader from "../components/images/ImagesUploader";
import ImagesLibrary from "../components/images/ImagesLibrary";
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
