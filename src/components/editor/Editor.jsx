import "../styles/Create.scss";
import { useNavigate, useOutletContext } from "react-router-dom";
import EditorTitle from "./EditorTitle";
import { X } from "lucide-react";
import EditorBlocks from "./EditorBlocks";
import EditorMenu from "./EditorMenu";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { EditorContext } from "../../contexts/EditorContext";

export default function Editor({ isUpdateUrl, idParam }) {
  const navigate = useNavigate();
  const id = idParam;
  const isUpdatePath = isUpdateUrl;
  const { storageKey, setTitle, setBlocks } = useContext(EditorContext);
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

        const fetchedData = await response.json();

        const data = JSON.parse(fetchedData.data);

        if (response.ok) {
          setTitle(data.title);
          setBlocks(data.blocks);
        }
      } catch (err) {
        console.error(err);
      }
    };
    // determine if editor is 'update' or 'create'
    // if update fetch and insert data into form
    isUpdatePath ? fetchPost() : setTitle("Untitled");
  }, [id, isUpdatePath, setBlocks, setTitle]);

  const createPost = async (requestBody) => {
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

      if (response.ok) sessionStorage.removeItem(storageKey);
    } catch (error) {
      console.error(error);
    }
  };

  const updatePost = async (requestBody) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/posts/update/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      const responseData = await response.json();

      onPostsChange({
        message: responseData && responseData.message,
        response: response,
      });

      if (response.ok) sessionStorage.removeItem(storageKey);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedData = sessionStorage.getItem(storageKey);

    const requestBody = {
      title: JSON.parse(storedData).title,
      data: storedData,
      public: e.target.name === "make-public",
    };

    isUpdatePath ? updatePost(requestBody) : createPost(requestBody);
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
            <button type="button" onClick={handleDelete}>
              <X />
            </button>
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
        <button type="submit" name="save-draft" onClick={handleSubmit}>
          Draft
        </button>
        <button type="submit" name="make-public" onClick={handleSubmit}>
          Public
        </button>
      </div>
      <hr />
    </form>
  );
}
