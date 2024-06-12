import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";

export default function EditorBlockImage({ params }) {
  const { blockContent, setBlockContent, blockIndex } = params;

  const editorRef = useRef(null);

  const handleEditorChange = () => {
    const content = editorRef.current.getContent();
    setBlockContent(content);
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
        branding: false,
        menubar: false,
        plugins: ["image"],
        toolbar: "image",
        selector: "textarea", // change this value according to your HTML
        image_caption: true,
        file_picker_types: "file image media",
        object_resizing: false,
        image_description: true,
        image_dimensions: false,
        images_upload_url: "",
        image_uploadtab: true,
        file_picker_callback: (callback, value, meta) => {
          // Provide file and text for the link dialog
          if (meta.filetype == "file") {
            callback("mypage.html", { text: "My text" });
          }

          // Provide image and alt text for the image dialog
          if (meta.filetype == "image") {
            callback("myimage.jpg", { alt: "My alt text" });
          }

          // Provide alternative source and posted for the media dialog
          if (meta.filetype == "media") {
            callback("movie.mp4", {
              source2: "alt.ogg",
              poster: "image.jpg",
            });
          }
        },
      }}
      onBlur={handleEditorChange}
    />
  );
}
