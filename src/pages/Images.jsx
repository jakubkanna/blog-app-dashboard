import "../styles/Images.scss";
import { Cloudinary } from "@cloudinary/url-gen";
import ImageUpload from "../components/ImageUpload";
import Library from "../components/Library";

export default function Images() {
  const cloudName = "dzsehmvrr";

  const config = {
    useCld: true, //should use cld?
    apiKey: "291738647398191",
    presetName: "guflpyvn",
    cloudName: cloudName,
    cld: new Cloudinary({ cloud: { cloudName: cloudName } }), //Cloudinary instance
  };

  return (
    <>
      <ImageUpload config={config} />
      <Library config={config} />
    </>
  );
}
