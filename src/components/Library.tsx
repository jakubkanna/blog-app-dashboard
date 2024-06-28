import React, { useState, useEffect, useContext } from "react";
import { Alert, AlertTitle, Button, Card, CardContent } from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";
import { ImageInstance, AuthContextType, LibraryProps } from "../../types";
import "../styles/Library.scss";

const Library: React.FC<LibraryProps> = ({ imageList, setImageList }) => {
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
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/images", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }

      const data: ImageInstance[] = await response.json();
      setImageList(data);
    } catch (error: any) {
      setMessage({
        msg: `Failed to fetch images ${error.message}`,
        severity: "error",
      });
    }
  };

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

      if (!response.ok) {
        throw new Error("Failed to delete images from server");
      }

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

  const getImageUrl = (img: ImageInstance) => {
    if (false) {
      //change later
      return img.cld_secure_url ? img.cld_secure_url : img.secure_url;
    } else {
      return img.cld_url ? img.cld_url : img.url;
    }
  };

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
      <h2>Library</h2>
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
      <div className="imageLibrary">
        {imageList.map((img) => {
          const imageUrl = getImageUrl(img);

          return (
            <Card
              key={img.public_id}
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
              }}>
              <img
                src={imageUrl}
                alt={img.alt}
                style={{ width: 300, height: 300, objectFit: "cover" }}
              />
              <CardContent>
                <div>
                  <label>Filename:</label>
                  <input type="text" value={img.original_filename} readOnly />
                </div>
                <div>
                  <label>Size:</label>
                  <input
                    type="text"
                    value={`${(img.bytes / 1048576).toFixed(2)} MB`}
                    className={
                      img.bytes > 9 * 1048576
                        ? "orange-red"
                        : img.bytes > 7 * 1048576
                        ? "orange"
                        : img.bytes > 5 * 1048576
                        ? "light-orange"
                        : ""
                    } // color scale 9/7/5
                    readOnly
                  />
                </div>
                <div>
                  <label>Dimensions:</label>
                  <input
                    type="text"
                    value={`${img.dimensions?.width}px x ${img.dimensions?.height}px`}
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="altText">Alt. text:</label>
                  <input
                    id="altText"
                    type="text"
                    value={altText[img.public_id] || img.alt || ""}
                    placeholder="A full plate of spaghetti carbonara topped with creamy sauce."
                    onChange={(e) => handleAltTextChange(e, img.public_id)}
                    onBlur={() => updateImageInstance(img.public_id)}
                  />
                </div>
                <div>
                  <span>Link:</span>
                  <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default Library;
