import { memo, useState } from "react";
import EditorBlockText from "./EditorBlockText";
import EditorBlockImage from "./EditorBlockImage";
import { Delete } from "lucide-react";
import { Button } from "@mui/material";
import TextEditor from "../TextEditor";

const EditorBlock = function EditorBlock({ props }) {
  const {
    index,
    totalBlocks,
    blockData,
    updateBlockData,
    updateBlockOrder,
    deleteBlock,
  } = props;

  const Input = () => {
    const [blockIndex, setBlockIndex] = useState(index);
    const [isEditing, setIsEditing] = useState(false);

    function handleDelete() {
      deleteBlock(blockData.id);
    }

    function handleIndexChange(event) {
      const newIndex = parseInt(event.target.value, 10);
      if (!isNaN(newIndex) && newIndex >= 0 && newIndex < totalBlocks) {
        setBlockIndex(newIndex);
      }
    }

    function handleNewIndexSubmit() {
      setIsEditing(false);
      updateBlockOrder(blockIndex);
    }

    return (
      <>
        {isEditing ? (
          // Render input field when editing
          <input
            type="number"
            value={blockIndex}
            onChange={handleIndexChange}
            onBlur={handleNewIndexSubmit}
            autoFocus
          />
        ) : (
          // Render block information when not editing
          <div className="editor-block-info">
            <small onClick={() => setIsEditing(true)}>
              {`Block ${index}: ${blockData.type}`}
            </small>
            <Button>
              <Delete onClick={handleDelete} />
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className={`editor-block-${blockData.type}-${blockData.id}`}>
      <Input />
      {blockData.type === "image" ? null : (
        <TextEditor id={`text-editor-${blockData.id}`} initVal onBlur />
      )}
    </div>
  );
};

export default EditorBlock;
