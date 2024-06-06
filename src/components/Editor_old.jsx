import { useState, useContext, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "../styles/Create.scss";
import EditorBlock from "./EditorBlock_old";
import { AuthContext } from "../context/AuthContext";

export default function Editor() {
  const location = useLocation();
  const currentPath = location.pathname;
  const storageKey = currentPath;
  const { id } = useParams();
  const [isEditingInput, setIsEditingInput] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [title, setTitle] = useState(() => {
    const savedData = sessionStorage.getItem(storageKey);
    return savedData ? JSON.parse(savedData).data.title : "Untitled";
  });
  const [blocks, setBlocks] = useState(() => {
    const savedData = sessionStorage.getItem(storageKey);
    return savedData ? JSON.parse(savedData).data.blocks : [];
  });

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
        setTitle(data.title);
        // setBlocks(data.content);
      } catch (err) {
        console.error(err);
      }
    };
    currentPath == `/admin/posts/update/${id}` && fetchPost();
  }, [currentPath]);

  useEffect(() => {
    const savedData = sessionStorage.getItem(storageKey);
    if (savedData) {
      const { title, blocks } = JSON.parse(savedData).data;
      setTitle(title);
      setBlocks(blocks);
    }
  }, [storageKey]);

  useEffect(() => {
    const postEditorData = { url: currentPath, data: { title, blocks } };
    sessionStorage.setItem(storageKey, JSON.stringify(postEditorData));
  }, [blocks, title, storageKey, currentPath]);

  const handleTitleClick = () => {
    setIsEditingInput(true);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleNewBlockBtn = () => {
    setShowButtons(!showButtons);
  };

  const addBlock = (type) => {
    setBlocks([...blocks, { type, id: blocks.length, content: "" }]);
  };

  const deleteBlock = (id) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  const updateBlockOrder = (index, newIndex) => {
    const blocksCopy = [...blocks];
    const [removedBlock] = blocksCopy.splice(index, 1);
    blocksCopy.splice(newIndex - 1, 0, removedBlock);
    setBlocks(blocksCopy);
  };

  const updateBlockContent = (id, content) => {
    const updatedBlocks = blocks.map((block) =>
      block.id === id ? { ...block, content } : block
    );
    setBlocks(updatedBlocks);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const requestBody = {
      title,
      blocks,
      public: e.target.name === "publish",
    };
    console.log(requestBody);
    sessionStorage.removeItem(storageKey);
    navigate("/admin/posts");
  };

  const handleX = () => {
    sessionStorage.removeItem(storageKey);
    navigate("/admin/posts");
  };

  return (
    <form method="post" onSubmit={handleSave}>
      <div className="post-editor">
        <div className="post-editor-header">
          <label htmlFor="newPostTitle">
            <small>Title</small>
          </label>
          <div className="post-editor-header-content">
            {isEditingInput ? (
              <input
                type="text"
                name="title"
                id="newPostTitle"
                value={title}
                onChange={handleTitleChange}
                onBlur={() => setIsEditingInput(false)}
                autoFocus
              />
            ) : (
              <h1 onClick={handleTitleClick}>{title}</h1>
            )}
            <button type="button" onClick={handleX}>
              <X />
            </button>
          </div>
        </div>
        <div className="post-editor-body">
          {blocks.map((block, index) => {
            block.index = index + 1;
            const params = {
              block,
              totalBlocks: blocks.length,
              updateBlockOrder,
              deleteBlock,
              updateBlockContent,
            };

            return <EditorBlock key={block.id} params={params} />;
          })}
          <div className="new-block-menu">
            <button
              className="new-block-btn"
              type="button"
              onClick={handleNewBlockBtn}>
              <small>Add new block</small> <Plus />
            </button>
            {showButtons && (
              <div className="new-block-blocks-btns">
                <button type="button" onClick={() => addBlock("text")}>
                  Text
                </button>
                <button type="button" onClick={() => addBlock("image")}>
                  Image
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="post-editor-footer">
          <button type="submit" name="save-draft">
            Save Draft
          </button>
          <button type="submit" name="publish">
            Publish
          </button>
        </div>
      </div>
      <hr />
    </form>
  );
}
