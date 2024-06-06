import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";

export default function EditorBlockText({
  blockIndex,
  blockContent,
  updateBlockData,
}) {
  const editorRef = useRef(null);
  !blockContent && "Initial value";
  const handleEditorBlur = () => {
    const content = editorRef.current.getContent();
    updateBlockData({ content });
  };

  return (
    <Editor
      key={blockIndex}
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      licenseKey="gpl"
      onInit={(_evt, editor) => (editorRef.current = editor)}
      initialValue={blockContent}
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
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "preview",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help | image",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
      }}
      onBlur={handleEditorBlur}
    />
  );
}
