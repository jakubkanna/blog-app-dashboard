import { useState } from "react";
import EditorBlockImage from "./EditorBlockImage";
import EditorBlockText from "./EditorBlockText";

export default function EditorBlock({ params }) {
  const [isEditing, setIsEditing] = useState(false);
  const [blockIndex, setblockIndex] = useState(params.index);

  const handleIndexChange = (event) => {
    const newIndex = parseInt(event.target.value, 10);
    if (!isNaN(newIndex) && newIndex > 0 && newIndex <= params.totalBlocks) {
      setblockIndex(newIndex);
    }
  };

  const handleOrderSubmit = () => {
    setIsEditing(false);
    params.updateBlockOrder(params.index - 1, blockIndex); // Subtract 1 from params.index
  };

  return (
    <div className={`editor-block-${params.block.type}-${params.block.id}`}>
      {isEditing ? (
        <input
          type="number"
          value={blockIndex}
          onChange={handleIndexChange}
          onBlur={handleOrderSubmit}
          autoFocus
        />
      ) : (
        <small onClick={() => setIsEditing(true)}>
          {`Block ${blockIndex}: ${params.block.type}`}
        </small>
      )}
      {params.block.type === "image" ? (
        <EditorBlockImage content={params.block.content} />
      ) : (
        <EditorBlockText content={params.block.content} />
      )}
    </div>
  );
}
