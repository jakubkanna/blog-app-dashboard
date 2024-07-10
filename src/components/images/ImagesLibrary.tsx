import React, { useState, useEffect, useContext } from "react";
import {
  Alert,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  TextField,
  Typography,
  Link,
  InputLabel,
} from "@mui/material";
import { AuthContext } from "../../contexts/AuthContext";
import {
  ImageInstance,
  AuthContextType,
  ImageLibraryProps,
} from "../../../types";
import useImageUrl from "../../utils/useImageURL";

const ImagesLibrary: React.FC<ImageLibraryProps> = ({
  imageList,
  setImageList,
}) => {
  const [selectedImages, setSelectedImages] = useState<ImageInstance[]>([]);
  const [message, setMessage] = useState<{
    msg: string;
    severity: "error" | "warning" | "info" | "success";
  }>({
    msg: "",
    severity: "info",
  });
  const [altText, setAltText] = useState<{ [key: string]: string }>({});
  const { token } = useContext<AuthContextType>(AuthContext);

  useEffect(() => {
    fetch("http://localhost:3000/api/images", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch images");
        return response.json();
      })
      .then((data) => setImageList(data))
      .catch((error) => console.error("Failed to fetch images", error));
  }, []);

  const toggleSelectImage = (image: ImageInstance) => {
    setSelectedImages((prevSelectedImages) =>
      prevSelectedImages.some((img) => img.public_id === image.public_id)
        ? prevSelectedImages.filter((img) => img.public_id !== image.public_id)
        : [...prevSelectedImages, image]
    );
  };

  const deleteSelectedImages = async () => {
    setMessage({
      msg: "Deleting images...",
      severity: "info",
    });
    try {
      const response = await fetch("http://localhost:3000/api/images/destroy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({ selectedImages }),
      });

      if (!response.ok) throw new Error("Failed to delete images from server");

      const result = await response.json();

      setMessage({
        msg: result.message,
        severity: "success",
      });

      setImageList((prevImageList) =>
        prevImageList.filter(
          (img) =>
            !selectedImages.some((selImg) => selImg.public_id === img.public_id)
        )
      );

      setSelectedImages([]);

      return result;
    } catch (error: any) {
      setMessage({
        msg: `Failed to delete selected images, ${error.message}`,
        severity: "error",
      });
    }
  };

  const { getImageUrl } = useImageUrl();

  const handleAltTextChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    public_id: string
  ) => {
    setAltText((prev) => ({
      ...prev,
      [public_id]: e.target.value,
    }));
  };

  const updateImageInstance = async (public_id: string) => {
    const alt = altText[public_id];
    if (alt === "" || alt === undefined) return;
    try {
      const response = await fetch(
        `http://localhost:3000/api/images/update/${public_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({ alt }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update image instance");
      }

      const updatedImage = await response.json();
      setImageList((prevImageList) =>
        prevImageList.map((img) =>
          img.public_id === public_id ? updatedImage : img
        )
      );

      setMessage({
        msg: "Alt text updated successfully",
        severity: "success",
      });
    } catch (error: any) {
      setMessage({
        msg: `Failed to update alt text ${error.message}`,
        severity: "error",
      });
    }
  };

  return (
    <>
      <Typography variant="h5">Library</Typography>
      {message.msg && (
        <Alert severity={message.severity}>
          <AlertTitle>{message.msg}</AlertTitle>
        </Alert>
      )}

      <div className="library-menu">
        {selectedImages.length > 0 && (
          <>
            <Button onClick={deleteSelectedImages}>Delete Selected</Button>
            <Button onClick={() => setSelectedImages([])}>Cancel</Button>
          </>
        )}
      </div>

      <Grid container spacing={2} className="imageLibrary">
        {imageList.map((img) => {
          const imageUrl = getImageUrl(img);

          return (
            <Grid item key={img.public_id} xs={12} sm={6} md={4} lg={3} xl={2}>
              <Card
                onDoubleClick={() => toggleSelectImage(img)}
                className={
                  selectedImages.some(
                    (selectedImg) => selectedImg.public_id === img.public_id
                  )
                    ? "selected-card"
                    : ""
                }
                sx={{
                  mb: 2,
                  outline: selectedImages.some(
                    (selectedImg) => selectedImg.public_id === img.public_id
                  )
                    ? "solid #1976d2 1px"
                    : "none",
                  height: "100%",
                  width: "100%",
                }}>
                <CardMedia
                  component="img"
                  image={imageUrl}
                  alt={img.alt}
                  style={{ width: "100%", height: 200, objectFit: "cover" }}
                />
                <CardContent>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <InputLabel className="typography" shrink>
                        Filename:
                      </InputLabel>{" "}
                      {img.original_filename}
                    </Grid>
                    <Grid item xs={12}>
                      <InputLabel className="typography" shrink>
                        Size:
                      </InputLabel>{" "}
                      {(img.bytes / 1048576).toFixed(2)} MB
                    </Grid>
                    <Grid item xs={12}>
                      <InputLabel className="typography" shrink>
                        Dimensions:
                      </InputLabel>{" "}
                      {`${img.dimensions?.width}px x ${img.dimensions?.height}px`}
                    </Grid>
                    <Grid item xs={12}>
                      <InputLabel className="typography" shrink>
                        Alt. text:
                      </InputLabel>
                      <TextField
                        id="altText"
                        size="small"
                        variant="standard"
                        value={altText[img.public_id] || img.alt || ""}
                        placeholder="A full plate of spaghetti carbonara topped with creamy sauce."
                        onChange={(e) => handleAltTextChange(e, img.public_id)}
                        onBlur={() => updateImageInstance(img.public_id)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} marginTop={"16px"}>
                      <Link
                        href={imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="typography">
                        View
                      </Link>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default ImagesLibrary;
