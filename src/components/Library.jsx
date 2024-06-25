import { AdvancedImage, responsive } from "@cloudinary/react";
import { Alert, AlertTitle, Card, CardContent } from "@mui/material";
import ButtonDelete from "./ButtonDelete";
import { useEffect, useMemo, useState } from "react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";

const Library = ({ config }) => {
  const [imageList, setImageList] = useState([]);
  const [message, setMessage] = useState({
    msg: "",
    severity: "",
  });

  const readImagesCloudinary = async () => {
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
        // Update imageList to include isSelected property
        const updatedImageList = result.resources.map((img) => ({
          ...img,
          isSelected: false,
        }));
        setImageList(updatedImageList);
      }
    } catch (error) {
      setMessage({
        msg: `Error during read: ${error.message}`,
        severity: "error",
      });
    }
  };

  useMemo(() => {
    readImagesCloudinary();
  }, []);

  const toggleSelectImage = (imageId) => {
    setImageList((prevImageList) =>
      prevImageList.map((img) =>
        img.public_id === imageId || img.id === imageId
          ? { ...img, isSelected: !img.isSelected }
          : img
      )
    );
  };

  const deleteSelectedImages = () => {
    // Filter out selected images
    const selectedIds = imageList
      .filter((img) => img.isSelected)
      .map((img) => img.public_id || img.id);

    // Here you would implement deletion logic, e.g., calling your API to delete images
    // For demonstration purposes, we'll just log the selected image IDs
    console.log("Deleting images:", selectedIds);

    // Update imageList to exclude deleted images
    const updatedImageList = imageList.filter((img) => !img.isSelected);
    setImageList(updatedImageList);
  };

  return (
    <>
      {/* <h2>Library</h2>
      {message.msg && (
        <Alert severity={message.severity}>
          <AlertTitle>{message.msg}</AlertTitle>
        </Alert>
      )}
      <div className="library-menu">
        {imageList.some((img) => img.isSelected) && (
          <>
            <button onClick={deleteSelectedImages}>Delete Selected</button>
            <button
              onClick={() => {
                setImageList([]);
              }}>
              Cancel
            </button>
          </>
        )}
      </div>
      <div className="imageLibrary">
        {imageList.map((img) => {
          const cldImg = config.cld
            .image(img.public_id)
            .resize(fill().width(300).height(300).gravity(autoGravity()));

          return (
            <Card
              key={img.public_id || img.id}
              onDoubleClick={() => toggleSelectImage(img.public_id || img.id)}
              className={img.isSelected ? "selected-card" : ""}
              sx={{
                mb: 2,
                outline: img.isSelected ? "solid #1976d2 1px" : "none",
              }}>
              <AdvancedImage
                cldImg={cldImg}
                plugins={[responsive()]}
                alt={img.alt}
              />
              <CardContent>
                <input
                  type="text"
                  placeholder="alt text"
                  onFocus={() => toggleSelectImage(img.public_id || img.id)}
                />
              </CardContent>
            </Card>
          );
        })}
      </div> */}
    </>
  );
};

export default Library;
