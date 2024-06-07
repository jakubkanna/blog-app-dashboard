import "../styles/Create.scss";
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import EditorTitle from "./EditorTitle";
import { X } from "lucide-react";
import EditorBlocks from "./EditorBlocks";
import EditorMenu from "./EditorMenu";
import { EditorContextProvider } from "../context/EditorContext";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Editor() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const storageKey = currentPath;
  const { id } = useParams();
  const isUpdatePath = currentPath.includes(id);
  const { token } = useContext(AuthContext);
  const { onPostsChange } = useOutletContext();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/posts/${id}`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }

        const data = await response.json();

        if (response.ok) {
          console.log(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    // determine if editor is 'update' or 'create'
    // if update fetch and insert data into form
    isUpdatePath && fetchPost();
  }, [isUpdatePath]);

  const handleSave = async (e) => {
    e.preventDefault();

    const storedData = sessionStorage.getItem(storageKey);
    console.log(e.target);
    const requestBody = {
      title: JSON.parse(storedData).title,
      data: storedData,
      public: e.target.name === "make-public",
    };

    try {
      const response = await fetch(`http://localhost:3000/api/posts/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      onPostsChange({
        message: responseData && responseData.message,
        response: response,
      });

      console.log(responseData);
      if (response.ok) sessionStorage.removeItem(storageKey);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = () => {
    sessionStorage.removeItem(storageKey);
    navigate("/admin/posts");
  };

  return (
    <EditorContextProvider storageKey={storageKey}>
      <form className="post-editor">
        <div className="post-editor-header">
          <label htmlFor="newPostTitle">
            <small>Title</small>
            <div className="post-editor-header-content">
              <EditorTitle />
              <button type="button" onClick={handleDelete}>
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
          <button type="submit" name="save-draft" onClick={handleSave}>
            Save Draft
          </button>
          <button type="submit" name="make-public" onClick={handleSave}>
            Publish
          </button>
        </div>
      </form>
    </EditorContextProvider>
  );
}
