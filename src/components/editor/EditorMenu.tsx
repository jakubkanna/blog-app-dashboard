import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@mui/material";
import { Block } from "../../../types";

export default function EditorMenu({ blocks, setBlocks }) {
  const [showButtons, setShowButtons] = useState(false);
  const handleNewBlockBtn = () => {
    setShowButtons(!showButtons);
  };

  const addBlock = (type: string) => {
    const newBlock: Block = {
      id: `${type}-block-${blocks.length}`,
      index: blocks.length,
      html: "",
      type: type,
    };

    const newData = [...blocks, newBlock];

    setBlocks(newData);
  };

  return (
    <div className="new-block-menu">
      <Button
        className="new-block-btn"
        type="button"
        onClick={handleNewBlockBtn}>
        <small>Add new block</small> <Plus />
      </Button>
      {showButtons && (
        <div className="new-block-blocks-btns">
          <Button type="button" onClick={() => addBlock("text")}>
            Text
          </Button>
          <Button type="button" onClick={() => addBlock("image")}>
            Image
          </Button>
        </div>
      )}
    </div>
  );
}
