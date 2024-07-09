import "../../styles/Create.scss";
import { useNavigate } from "react-router-dom";
import EditorTitle from "./EditorTitle";
import { X } from "lucide-react";
import EditorBlocks from "./EditorBlocks";
import EditorMenu from "./EditorMenu";
import { useContext } from "react";
import { EditorContext } from "../../contexts/EditorContext";
import { Button } from "@mui/material";

export default function Editor({ isUpdateUrl, idParam }) {
  const navigate = useNavigate();
  const id = idParam;
  const isUpdatePath = isUpdateUrl;
  const { storageKey, setTitle, setBlocks } = useContext(EditorContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedData = sessionStorage.getItem(storageKey);

    const requestBody = {
      title: JSON.parse(storedData).title,
      data: storedData,
      public: e.target.name === "make-public",
    };
  };

  const handleDelete = () => {
    sessionStorage.removeItem(storageKey);
    navigate("/admin/posts");
  };

  return (
    <form className="post-editor">
      <div className="post-editor-header">
        <label htmlFor="newPostTitle">
          <small>Title</small>
          <div className="post-editor-header-content">
            <EditorTitle />
            <Button type="Button" onClick={handleDelete}>
              <X />
            </Button>
          </div>
        </label>
      </div>
      <small>Content</small>
      <div className="post-editor-body">
        <EditorBlocks />
        <EditorMenu />
      </div>
      <small>Summary</small>
      <div className="post-editor-footer">
        <Button type="submit" name="save-draft" onClick={handleSubmit}>
          Draft
        </Button>
        <Button type="submit" name="make-public" onClick={handleSubmit}>
          Public
        </Button>
      </div>
      <hr />
    </form>
  );
}
