/* todo:
1. delete logic
2. update logic
*/

import { AdvancedImage, responsive } from "@cloudinary/react";
import { Alert, AlertTitle, Button, Card, CardContent } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AuthContext } from "../contexts/AuthContext";
import { config } from "../../config";

const Library = () => {
  const [imageList, setImageList] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [message, setMessage] = useState({
    msg: "",
    severity: "",
  });
  const { token } = useContext(AuthContext);

  // Fetch image list from backend or API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Replace with your API call to fetch image list
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

        const data = await response.json();
        setImageList(data);
        console.log(data);
        return data;
      } catch (error) {
        console.error("Error fetching images:", error.message);
        setMessage({
          msg: "Failed to fetch images",
          severity: "error",
        });
      }
    };

    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSelectImage = (imageId) => {
    setSelectedImages((prevSelectedImages) =>
      prevSelectedImages.includes(imageId)
        ? prevSelectedImages.filter((id) => id !== imageId)
        : [...prevSelectedImages, imageId]
    );
  };

  const deleteSelectedImages = async () => {
    try {
      // Delete selected images from the server
      const deleteFromServer = async () => {
        const response = await fetch(
          "http://localhost:3000/api/images/delete",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
            body: JSON.stringify({ selectedImages }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete images from server");
        }
        const result = await response.json();

        setMessage({
          msg: result?.message || "",
          severity: "info",
        });
      };

      await deleteFromServer();

      // Delete selected images from Cloudinary
      const deleteFromCloudinary = async () => {
        const timestamp = Math.floor(Date.now() / 1000);
        const api_key = "YOUR_CLOUDINARY_API_KEY";
        const api_secret = "YOUR_CLOUDINARY_API_SECRET";

        const generateSignature = (publicId, timestamp) => {
          const crypto = require("crypto");
          const hash = crypto.createHash("sha1");
          hash.update(
            `public_id=${publicId}&timestamp=${timestamp}${api_secret}`
          );
          return hash.digest("hex");
        };

        for (const image of selectedImages) {
          const public_id = image.public_id || image.id;
          const signature = generateSignature(public_id, timestamp);

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/destroy`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                public_id,
                timestamp,
                api_key,
                signature,
              }),
            }
          );

          if (!response.ok) {
            throw new Error(
              `Failed to delete image from Cloudinary: ${public_id}`
            );
          }

          const result = await response.json();

          setMessage({
            msg: result?.message || "",
            severity: "info",
          });
        }
      };

      await deleteFromCloudinary();

      // Update imageList to exclude deleted images
      setImageList((prevImageList) =>
        prevImageList.filter(
          (img) => !selectedImages.includes(img.public_id || img.id)
        )
      );

      // Clear selectedImages state
      setSelectedImages([]);
      setMessage({
        msg: "Selected images deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting images:", error.message);
      setMessage({
        msg: "Failed to delete selected images",
        severity: "error",
      });
    }
  };

  const getImageUrl = (img) => {
    if (config.USE_HTTPS) {
      return img.cld_secure_url ? img.cld_secure_url : img.secure_url;
    } else {
      return img.cld_url ? img.cld_url : img.url;
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
              key={img.public_id || img.id}
              onDoubleClick={() => toggleSelectImage(img.public_id || img.id)}
              className={
                selectedImages.includes(img.public_id || img.id)
                  ? "selected-card"
                  : ""
              }
              sx={{
                mb: 2,
                outline: selectedImages.includes(img.public_id || img.id)
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
                    placeholder="A full plate of spaghetti carbonara topped with creamy sauce, crispy pancetta, grated Parmesan cheese, and a sprinkle of black pepper, garnished with fresh parsley."
                    value={img.alt || ""}
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
