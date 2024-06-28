import React, { useState, useEffect, useContext } from "react";
import { AdvancedImage, responsive } from "@cloudinary/react";
import { Alert, AlertTitle, Button, Card, CardContent } from "@mui/material";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AuthContext } from "../contexts/AuthContext";
import { config } from "../../config";
import { ImageInstance, AuthContextType, LibraryProps } from "../../types";

const Library: React.FC<LibraryProps> = ({ imageList, setImageList }) => {
  const [selectedImages, setSelectedImages] = useState<ImageInstance[]>([]);
  const [message, setMessage] = useState<{ msg: string; severity: string }>({
    msg: "",
    severity: "",
  });
  const [altText, setAltText] = useState<{ [key: string]: string }>({});
  const { token } = useContext<AuthContextType>(AuthContext);

  useEffect(() => {
    fetchImages();
  }, [token]);

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
      console.error("Error fetching images:", error.message);
      setMessage({
        msg: "Failed to fetch images",
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
    try {
      for (const image of selectedImages) {
        // Delete from server
        setMessage({
          msg: `Deleting ${image.public_id} from the server...`,
          severity: "info",
        });

        const deleteFromServerResponse = await fetch(
          "http://localhost:3000/api/images/destroy",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
            body: JSON.stringify({ selectedImages }),
          }
        );

        if (!deleteFromServerResponse.ok) {
          throw new Error("Failed to delete images from server");
        }

        const serverResult = await deleteFromServerResponse.json();

        setMessage({
          msg: serverResult.message,
          severity: "info",
        });

        // Delete from Cloudinary if enabled
        if (config.ENABLE_CLD) {
          const timestamp = Math.floor(Date.now() / 1000);
          const api_key = config.CLD_API_KEY;
          const eager = "";

          setMessage({
            msg: `Deleting ${image.public_id} from Cloudinary...`,
            severity: "info",
          });

          const signatureResponse = await fetch(
            `http://localhost:3000/api/cld/signature/${image.public_id}/${eager}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
              },
            }
          );

          if (!signatureResponse.ok) {
            throw new Error("Failed to fetch Cloudinary signature");
          }

          const { signature } = await signatureResponse.json();

          const deleteResponse = await fetch(
            `${config.CLD_API_URL}${config.CLD_CLOUD_NAME}/image/destroy`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                public_id: image.public_id,
                timestamp: timestamp.toString(),
                api_key,
                signature,
              }),
            }
          );

          if (!deleteResponse.ok) {
            setMessage({
              msg: `Failed to delete image from Cloudinary: ${image.public_id}`,
              severity: "error",
            });
          }
        }
      }

      // Update imageList to exclude deleted images
      setImageList((prevImageList) =>
        prevImageList.filter((img) =>
          selectedImages.every((selImg) => selImg.public_id !== img.public_id)
        )
      );

      setSelectedImages([]);
      setMessage({
        msg: "Selected images deleted successfully",
        severity: "success",
      });
    } catch (error: any) {
      console.error("Error deleting images:", error.message);
      setMessage({
        msg: "Failed to delete selected images",
        severity: "error",
      });
    }
  };

  const getImageUrl = (img: ImageInstance) => {
    if (config.USE_HTTPS) {
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
    if (alt === "" || undefined) return;
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
      console.error("Error updating image instance:", error.message);
      setMessage({
        msg: "Failed to update alt text",
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
          const cldImg = config.CLD_INSTANCE.image(img.public_id).resize(
            fill().width(300).height(300).gravity(autoGravity())
          );

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
              {img.cld_url ? (
                <AdvancedImage
                  cldImg={cldImg}
                  plugins={[responsive()]}
                  alt={img.alt}
                />
              ) : (
                <img src={imageUrl} alt={img.alt} />
              )}
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
                    readOnly
                  />
                </div>
                <div>
                  <label>Dimensions:</label>
                  <input
                    type="text"
                    value={`${img.dimensions.width}px x ${img.dimensions.height}px`}
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="altText">Alt. text:</label>
                  <input
                    id="altText"
                    type="text"
                    value={altText[img.public_id] || img.alt || ""}
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
