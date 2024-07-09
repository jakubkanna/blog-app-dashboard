import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

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
      onEditorChange={handleEditorChange}
      onBlur={handleEditorBlur}
    />
  );
};

export default TextEditor;
