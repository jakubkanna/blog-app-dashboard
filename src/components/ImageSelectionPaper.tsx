import React, { useState } from "react";
import { Box, Typography, Paper, InputLabel } from "@mui/material";
import ImagesSelectableList from "./ImagesSelectableList";
import ImagesUploader from "./ImagesUploader";
import { ImageInstance } from "../../types";

interface ImageSelectionPaperProps {
  selectedImgList: ImageInstance[];
  setSelectedImgList: React.Dispatch<React.SetStateAction<ImageInstance[]>>;
  imgList: ImageInstance[];
  setImgList: React.Dispatch<React.SetStateAction<ImageInstance[]>>;
  onBlur: () => void;
}

const ImageSelectionPaper: React.FC<ImageSelectionPaperProps> = ({
  selectedImgList,
  setSelectedImgList,
  imgList,
  onBlur,
}) => {
  const [isActive, setIsActive] = useState(false);

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleBlur = () => {
    setIsActive(false);
    onBlur();
  };

  return (
    <Paper
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0} // Make the paper focusable
      sx={{ border: isActive ? "solid #1976d2 1px" : "1px solid #ccc" }} // Indicate active state
    >
      <Box p={2}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <InputLabel shrink>Selected Images</InputLabel>
          <Box sx={{ border: "1px solid #ccc", padding: 2, borderRadius: 1 }}>
            <ImagesSelectableList
              imageList={selectedImgList}
              setImageList={setSelectedImgList}
            />
          </Box>

          <ImagesUploader setImageList={setSelectedImgList} />

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Library
          </Typography>

          {imgList.length > 0 ? (
            <ImagesSelectableList
              imageList={imgList}
              setImageList={setSelectedImgList}
            />
          ) : (
            "No images"
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default ImageSelectionPaper;
