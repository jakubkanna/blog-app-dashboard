import { Plus } from "lucide-react";
import { useContext, useState } from "react";
import { EditorContext } from "../../contexts/EditorContext";
import { Button } from "@mui/material";

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
      <Button
        className="new-block-btn"
        type="Button"
        onClick={handleNewBlockBtn}>
        <small>Add new block</small> <Plus />
      </Button>
      {showButtons && (
        <div className="new-block-blocks-btns">
          <Button type="Button" onClick={() => addBlock("text")}>
            Text
          </Button>
          <Button type="Button" onClick={() => addBlock("image")}>
            Image
          </Button>
        </div>
      )}
    </div>
  );
}
