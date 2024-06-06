import { Plus } from "lucide-react";
import { useContext, useState } from "react";
import { EditorContext } from "../context/EditorContext";

export default function EditorMenu() {
  const { blocks, setBlocks } = useContext(EditorContext);
  const [showButtons, setShowButtons] = useState(false);
  const handleNewBlockBtn = () => {
    setShowButtons(!showButtons);
  };

  const addBlock = (type) => {
    const newBlock = {
      type: type,
      id: blocks.length,
    };

    const newData = [...blocks, newBlock];

    setBlocks(newData);
  };

  return (
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
  );
}
