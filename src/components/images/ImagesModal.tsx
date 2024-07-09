import { useState, useEffect } from "react";
import { Modal, Box, Button } from "@mui/material";
import { ImageInstance, ImagesModalProps } from "../../../types";
import ImagesSelectionPaper from "./ImagesSelectionField";
import { useGridApiContext } from "@mui/x-data-grid";

const ImagesModal: React.FC<ImagesModalProps> = ({
  onClose,
  params,
  fetchPath,
}) => {
  const [selectedImgList, setSelectedImgList] = useState<ImageInstance[]>([]);
  const apiRef = useGridApiContext();

  useEffect(() => {
    fetch(`http://localhost:3000/api/${fetchPath}/${params.id}/images`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch selected images");
        return response.json();
      })
      .then((data: ImageInstance[]) => setSelectedImgList(data))
      .catch((error) =>
        console.error("Failed to fetch selected images", error)
      );
  }, [params.id]);

  const handleSubmit = async () => {
    onClose();
  };

  const handleImagesChange = (value: ImageInstance[]) => {
    const selectedImageIds = value.map((image) => image && image._id);
    apiRef.current.setEditCellValue({
      id: params.id,
      field: params.field,
      value: selectedImageIds,
    });
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
        <ImagesSelectionPaper
          initVal={selectedImgList}
          onChange={handleImagesChange}
        />
        <Button onClick={handleSubmit}>Save</Button>
      </Box>
    </Modal>
  );
};

export default ImagesModal;
