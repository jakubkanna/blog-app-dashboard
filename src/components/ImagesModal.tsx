import { useState, useEffect } from "react";
import { Modal, Box, Button } from "@mui/material";
import ImagesSelectableList from "./ImagesSelectableList";
import ImagesUploader from "./ImagesUploader";
import { ImageInstance, ImagesModalProps } from "../../types";
import { useGridApiContext } from "@mui/x-data-grid";

const ImagesModal: React.FC<ImagesModalProps> = ({ onClose, params }) => {
  const [selectedImgList, setSelectedImgList] = useState<ImageInstance[]>([]);
  const [imgList, setImgList] = useState<ImageInstance[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/images")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch images");
        return response.json();
      })
      .then((data: ImageInstance[]) => setImgList(data))
      .catch((error) => console.error("Failed to fetch images", error));
  }, []);

  useEffect(() => {
    if (params?.id) {
      fetch(`http://localhost:3000/api/events/${params.id}/images`)
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch selected images");
          return response.json();
        })
        .then((data: ImageInstance[]) => setSelectedImgList(data))
        .catch((error) =>
          console.error("Failed to fetch selected images", error)
        );
    }
  }, [params?.id]);

  const handleSubmit = async () => {
    const id = params.id;
    const field = params.field;
    const selectedImageIds = selectedImgList.map((image) => image._id);
    onClose();
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          width: "80%",
          maxWidth: "720px",
          maxHeight: "100vh",
          overflowY: "auto",
        }}>
        <h1>{params?.row.title + " - " + params?.field.toUpperCase()}</h1>
        <h2>Selected</h2>
        <ImagesSelectableList
          imageList={selectedImgList}
          setImageList={setSelectedImgList}
        />
        <ImagesUploader setImageList={setSelectedImgList} />
        <h2>Library</h2>
        <ImagesSelectableList
          imageList={imgList}
          setImageList={setSelectedImgList}
        />
        <br />
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default ImagesModal;
