import { useState, useContext, useEffect } from "react";
import { Plus, Trash } from "lucide-react";
import "../styles/Create.scss";
import EditorBlock from "../components/EditorBlock";
import { AuthContext } from "../context/AuthContext";

export default function CreatePost() {
  const [title, setTitle] = useState("Untitled");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const { token } = useContext(AuthContext);

  const blocksNb = blocks.length;
  useEffect(() => {
    console.log("blocks:", JSON.stringify(blocks));
  }, [blocks]);

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handlePlusClick = () => {
    setShowButtons(!showButtons);
  };

  const addBlock = (type) => {
    setBlocks([...blocks, { type, id: blocksNb, content: "" }]);
  };

  const updateBlockOrder = (index, newIndex) => {
    const blocksCopy = [...blocks];

    // Remove the block from its current position
    const [removedBlock] = blocksCopy.splice(index, 1);

    // Re-insert the block at the new position
    blocksCopy.splice(newIndex - 1, 0, removedBlock); //subtract 1 from newIndex because array indexes are zero-based

    // Update the state with the new order
    setBlocks(blocksCopy);
  };

  const handleFormSubmitMock = (e) => {
    e.preventDefault();
    const requestBody = {
      title,
      blocks,
      public: e.target.name === "publish",
    };
    console.log(requestBody);
  };
  const deleteBlock = (id) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };
  return (
    <form method="post" onSubmit={handleFormSubmitMock}>
      <div className="post-editor">
        <div className="post-editor-header">
          <label htmlFor="newPostTitle">
            <small>Title</small>
          </label>
          <div className="post-editor-header-content">
            {isEditingTitle ? (
              <input
                type="text"
                name="title"
                id="newPostTitle"
                value={title}
                onChange={handleTitleChange}
                onBlur={() => setIsEditingTitle(false)}
                autoFocus
              />
            ) : (
              <h1 onClick={handleTitleClick}>{title}</h1>
            )}
            <button>
              <Trash />
            </button>
          </div>
        </div>
        <div className="post-editor-body">
          {blocks.map((block, index) => {
            block.index = index + 1;
            const params = {
              block,
              totalBlocks: blocksNb,
              updateBlockOrder,
              deleteBlock,
            };

            return <EditorBlock key={block.id} params={params} />;
          })}
          <div className="new-block">
            <button
              className="new-block-btn"
              type="button"
              onClick={handlePlusClick}>
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
