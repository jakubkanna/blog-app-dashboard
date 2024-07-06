import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Paper, InputLabel } from "@mui/material";
import ImagesSelectableList from "./ImagesSelectableList";
import ImagesUploader from "./ImagesUploader";
import { ImageInstance } from "../../types";

interface ImageSelectionPaperProps {
  initVal: ImageInstance[];
  onChange: (value: ImageInstance[]) => void;
}

const ImageSelectionPaper: React.FC<ImageSelectionPaperProps> = ({
  initVal,
  onChange,
}) => {
  const [selectedImgList, setSelectedImgList] = useState<ImageInstance[]>([]);
  const [images, setImages] = useState<ImageInstance[]>([]);
  const [isActive, setIsActive] = useState(false);
  const paperRef = useRef<HTMLDivElement>(null);

  const fetchAllImgs = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/images`);
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      const data: ImageInstance[] = await response.json();
      if (data.length) {
        setImages(data);
      }
    } catch (error) {
      console.error("Failed to fetch event images", error);
    }
  };

  useEffect(() => {
    setSelectedImgList(initVal);
  }, [initVal]);

  useEffect(() => {
    fetchAllImgs();
  }, []);

  const handleImageSubmit = () => {
    onChange(selectedImgList);
  };

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleBlur = (event: MouseEvent) => {
    if (paperRef.current && !paperRef.current.contains(event.target as Node)) {
      setIsActive(false);
      handleImageSubmit();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleBlur);
    return () => {
      document.removeEventListener("click", handleBlur);
    };
  }, []);

  return (
    <Paper
      ref={paperRef}
      sx={{ border: isActive ? "solid #1976d2 1px" : "1px solid #ccc" }} // Indicate active state
      onClick={handleFocus}>
      <Box p={2}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <InputLabel>Selected Images</InputLabel>

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

          {images.length > 0 ? (
            <ImagesSelectableList
              imageList={images}
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
