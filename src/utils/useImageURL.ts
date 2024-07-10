import { useCallback } from "react";
import { ImageInstance } from "../../types";

const useImageUrl = () => {
  const getImageUrl = useCallback((img: ImageInstance) => {
    if (false) {
      // change later
      return img.cld_secure_url ? img.cld_secure_url : img.secure_url;
    } else {
      return img.cld_url ? img.cld_url : img.url;
    }
  }, []);

  return { getImageUrl };
};

export default useImageUrl;
