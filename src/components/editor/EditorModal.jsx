import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal, Box, Button } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";

const EditorModal = ({ open, handleClose, title, initialValue, onSubmit }) => {
  const [editorContent, setEditorContent] = useState(initialValue);

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const handleSave = () => {
    onSubmit(editorContent);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
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
          maxWidth: "600px",
        }}>
        <h1>{title?.toUpperCase()}</h1>
        <Editor
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          licenseKey="gpl"
          initialValue={initialValue}
          init={{
            selector: "textarea",
            height: 500,
            menubar: false,
            branding: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "charmap",
              "anchor",
              "searchreplace",
              "code",
              "fullscreen",
              "insertdatetime",
              "table",
              "help",
              "wordcount",
              "code",
            ],
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help | code",
          }}
          onEditorChange={handleEditorChange}
        />
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </Box>
    </Modal>
  );
};

EditorModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  initialValue: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default EditorModal;
