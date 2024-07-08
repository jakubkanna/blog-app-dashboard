import { Box, Button, Modal } from "@mui/material";
import AutoCompleteField from "./AutoCompleteField";

export default function EventModal({ onClose, params }) {
  const fetchOptions = async (): Promise<Option[]> => {
    try {
      const response = await fetch("http://localhost:3000/api/events/");
      const data = await response.json();
      return data.map((event: Event) => ({
        label: event.title,
        value: event._id,
      }));
    } catch (error) {
      console.error("Failed to fetch options:", error);
      return [];
    }
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
        <h1>{row.title + " - " + field.toUpperCase()}</h1>
        <AutoCompleteField multiple={true} fetchOptions={fetchOptions} />
        <Button onClick={handleEventSave}>Save</Button>
      </Box>
    </Modal>
  );
}
