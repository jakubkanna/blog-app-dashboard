import { useState } from "react";
import { Modal, Box, Button } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import { useGridApiContext } from "@mui/x-data-grid";

const EditorModal = ({ params, onClose }) => {
  const [editorContent, setEditorContent] = useState(params.value);
  const apiRef = useGridApiContext();

  const handleEditorSubmit = async () => {
    const id = params.id;
    const field = params.field;
    console.log(id, field, editorContent);
    apiRef.current.setEditCellValue({ id, field, value: editorContent });
    onClose();
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
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
        }}>
        <h1>{params?.row.title + " - " + params?.field.toUpperCase()}</h1>
        <Editor
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          licenseKey="gpl"
          initialValue={params.value}
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
        <Button
          onClick={handleEditorSubmit}
          variant="contained"
          color="primary">
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default EditorModal;
