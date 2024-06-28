import { Cloudinary } from "@cloudinary/url-gen";

export const config = {
  ENABLE_CLD: true, //db
  ENABLE_HTTPS: false, //db
  BASE_URL: import.meta.env.BASE_URL, //db
  FE_BASE_URL: "", //db
  API_URL: "http://localhost:3000/api/", //db
  CLD_API_URL: "https://api.cloudinary.com/v1_1/", //db
  CLD_API_KEY: "291738647398191", //db
  CLD_PRESET_NAME: "guflpyvn", //db
  CLD_CLOUD_NAME: "dzsehmvrr", //db
  CLD_INSTANCE: new Cloudinary({ cloud: { cloudName: "dzsehmvrr" } }), //config
};
