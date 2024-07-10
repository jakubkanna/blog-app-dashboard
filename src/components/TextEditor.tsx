import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Box, CircularProgress } from "@mui/material";

interface TextEditorProps {
  id: string;
  initVal?: string;
  onBlur?: (content: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
  id,
  initVal = "",
  onBlur,
}) => {
  const [editorContent, setEditorContent] = useState<string>(initVal);
  const [loading, setLoading] = useState(true);

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  const handleEditorBlur = () => {
    if (typeof onBlur === "function") {
      onBlur(editorContent);
    }
  };

  return (
    <>
      {loading && (
        <Box
          sx={{
            height: 500,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <CircularProgress />
        </Box>
      )}
      <div style={{ display: loading ? "none" : "block" }}>
        <Editor
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          licenseKey="gpl"
          id={id}
          initialValue={initVal}
          init={{
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
            ],
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help | code",
          }}
          onInit={() => setLoading(false)}
          onEditorChange={handleEditorChange}
          onBlur={handleEditorBlur}
        />
      </div>
    </>
  );
};

export default TextEditor;
