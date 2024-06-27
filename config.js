const cloudName = "dzsehmvrr";
import { Cloudinary } from "@cloudinary/url-gen";

export const config = {
  USE_CLD: true,
  USE_HTTPS: false,
  CLD_API_KEY: "291738647398191",
  CLD_PRESET_NAME: "guflpyvn",
  CLD_CLOUD_NAME: cloudName,
  CLD_INSTANCE: new Cloudinary({ cloud: { cloudName: cloudName } }),
};
