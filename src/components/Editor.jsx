import "../styles/Create.scss";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import EditorTitle from "./EditorTitle";
import { X } from "lucide-react";
import EditorBlocks from "./EditorBlocks";
import EditorMenu from "./EditorMenu";
import { EditorContextProvider } from "../context/EditorContext";

export default function Editor() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const storageKey = currentPath;
  const { id } = useParams();

  const handleSave = (e) => {
    e.preventDefault();
    const data = sessionStorage.getItem(storageKey);
    const requestBody = {
      title: data.title,
      content: data.blocks,
      public: e.target.name === "publish",
    };
    console.log(requestBody);
    sessionStorage.removeItem(storageKey);
    navigate("/admin/posts");
  };

  const handleXClick = () => {
    sessionStorage.removeItem(storageKey);
    navigate("/admin/posts");
  };

  return (
    <EditorContextProvider storageKey={storageKey}>
      <form className="post-editor" onSubmit={handleSave}>
        <div className="post-editor-header">
          <label htmlFor="newPostTitle">
            <small>Title</small>
            <div className="post-editor-header-content">
              <EditorTitle />
              <button type="button" onClick={handleXClick}>
                <X />
              </button>
            </div>
          </label>
        </div>
        <div className="post-editor-body">
          <EditorBlocks />
          <EditorMenu />
        </div>
        <div className="post-editor-footer">
          <button type="submit" name="save-draft">
            Save Draft
          </button>
          <button type="submit" name="publish">
            Publish
          </button>
        </div>
      </form>
    </EditorContextProvider>
  );
}
