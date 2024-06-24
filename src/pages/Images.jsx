import "../styles/Images.scss";
import { Cloudinary } from "@cloudinary/url-gen";
import ImageUpload from "../components/ImageUpload";
import Library from "../components/Library";

export default function Images() {
  const config = {
    apiKey: "291738647398191",
    presetName: "guflpyvn",
    cld: new Cloudinary({ cloud: { cloudName: "dzsehmvrr" } }), //Cloudinary instance
  };

  return (
    <>
      <ImageUpload config={config} />
      <Library config={config} />
    </>
  );
}
