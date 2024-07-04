import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import { ImageInstance } from "../../types";
import useImageUrl from "../hooks/useImageURL";

interface ImagesSelectableListProps {
  imageList: ImageInstance[];
  setImageList: React.Dispatch<React.SetStateAction<ImageInstance[]>>;
}

const ImagesSelectableList: React.FC<ImagesSelectableListProps> = ({
  imageList,
  setImageList,
}) => {
  const handleImageClick = (clickedImage: ImageInstance) => {
    setImageList((prevList) => {
      const imageExists = prevList.some(
        (image) => image._id === clickedImage._id
      );

      if (imageExists) {
        return prevList.filter((image) => image._id !== clickedImage._id);
      } else {
        return [clickedImage, ...prevList];
      }
    });
  };
  const { getImageUrl } = useImageUrl();

  return (
    <Grid container spacing={2}>
      {imageList.map((image) => (
        <Grid item xs={3} key={image._id}>
          <Box
            sx={{
              position: "relative",
              width: "100px",
              height: "100px",
              border: "1px solid #ccc",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "4px",
              overflow: "hidden",
              backgroundColor: imageList.some(
                (selected) => selected._id === image._id
              )
                ? "#e0e0e0"
                : "transparent",
              "&:hover .overlay": {
                opacity: 1,
              },
            }}
            onClick={() => handleImageClick(image)}>
            <img
              src={getImageUrl(image)}
              alt={image.filename}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <Box
              className="overlay"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                opacity: 0,
                transition: "opacity 0.3s ease-in-out",
                padding: "0 5px",
              }}>
              <Typography
                variant="caption"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                  textAlign: "center",
                }}>
                {image.filename}
              </Typography>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default ImagesSelectableList;
