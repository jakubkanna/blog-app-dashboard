import { AdvancedImage, responsive } from "@cloudinary/react";
import { Alert, AlertTitle } from "@mui/material";
import ButtonDelete from "./ButtonDelete";
import { useEffect, useState } from "react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";

const Library = ({ config }) => {
  const [imageList, setImageList] = useState([]);
  const [message, setMessage] = useState({
    msg: "",
    severity: "",
  });

  const readImagesCLOUD = async () => {
    try {
      const response = await fetch(
        `https://res.cloudinary.com/dzsehmvrr/image/list/${config.presetName}.json`
      );

      if (!response.ok) {
        const result = await response.json();
        setMessage({
          msg: `Error reading images: ${result.error.message}`,
          severity: "error",
        });
      } else {
        const result = await response.json();
        setImageList(result.resources);
      }
    } catch (error) {
      setMessage({
        msg: `Error during read: ${error.message}`,
        severity: "error",
      });
    }
  };

  useEffect(() => {
    readImagesCLOUD();
  }, []);

  return (
    <>
      <h2>Library</h2>
      {message.msg && (
        <Alert severity={message.severity}>
          <AlertTitle>{message.msg}</AlertTitle>
        </Alert>
      )}
      <div className="imageLibrary">
        {imageList.map((img) => {
          const cldImg = config.cld
            .image(img.public_id)
            .resize(fill().width(300).height(300).gravity(autoGravity()));

          return (
            <div key={img.public_id || img.id}>
              <ButtonDelete />
              <AdvancedImage cldImg={cldImg} plugins={[responsive()]} />
              <input type="text" placeholder="alt text" />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Library;
