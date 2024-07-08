import { Box, Button, Modal } from "@mui/material";
import { ReactNode } from "react";

interface MuiTableCellModalProps {
  children: ReactNode;
  title?: string;
  open: boolean;
  onClose: () => void;
}

const MuiTableCellModal: React.FC<MuiTableCellModalProps> = ({
  children,
  title,
  open,
  onClose,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
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
        <h1>{title}</h1>

        {children}

        <Button onClick={onClose}>Save</Button>
      </Box>
    </Modal>
  );
};

export default MuiTableCellModal;
