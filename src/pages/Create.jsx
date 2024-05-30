import { useState } from "react";
import { Plus } from "lucide-react";
import "../styles/Create.scss";
import EditorBlock from "../components/EditorBlock";

export default function Create() {
  const [title, setTitle] = useState("Untitled");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const blocksNb = blocks.length;

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
    const content = `block ID: ${blocksNb}`;
    setBlocks([...blocks, { type, id: blocksNb, content }]);
    setShowButtons(false);
  };

  const updateBlockOrder = (index, newOrder) => {
    // Make a copy of the blocks array
    const blocksCopy = [...blocks];

    // Remove the block from its current position
    const [removedBlock] = blocksCopy.splice(index, 1);

    // Re-insert the block at the new position
    blocksCopy.splice(newOrder - 1, 0, removedBlock); // Subtract 1 from newOrder

    // Update the state with the new order
    setBlocks(blocksCopy);
  };

  return (
    <div className="post-editor">
      <div className="post-editor-header">
        <label htmlFor="newPostTitle">
          <small>Title</small>
        </label>
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
      </div>
      <div className="post-editor-body">
        {blocks.map((block, index) => {
          const params = {
            block,
            index: index + 1, //  start index from 1
            totalBlocks: blocksNb,
            updateBlockOrder: updateBlockOrder,
          };

          return <EditorBlock key={block.id} params={params} />;
        })}
        <div className="new-block">
          <button className="new-block-btn" onClick={handlePlusClick}>
            <small>Add new block</small> <Plus />
          </button>
          {showButtons && (
            <div className="new-block-blocks-btns">
              <button onClick={() => addBlock("text")}>Text</button>
              <button onClick={() => addBlock("image")}>Image</button>
            </div>
          )}
        </div>
      </div>
      <div className="post-editor-footer">
        <button>Submit</button>
        <hr />
      </div>
    </div>
  );
}
