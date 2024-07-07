import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface CustomEditorProps {
  id: string;
  initialValue?: string;
  onBlur?: (content: string) => void;
}

const CustomEditor: React.FC<CustomEditorProps> = ({
  id,
  initialValue = "",
  onBlur,
}) => {
  const [editorContent, setEditorContent] = useState<string>(initialValue);

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  const handleEditorBlur = () => {
    if (typeof onBlur === "function") {
      onBlur(editorContent);
    }
  };

  return (
    <Editor
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      licenseKey="gpl"
      id={id}
      initialValue={initialValue}
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
      onEditorChange={handleEditorChange}
      onBlur={handleEditorBlur}
    />
  );
};

export default CustomEditor;
