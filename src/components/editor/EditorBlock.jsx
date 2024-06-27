import { memo, useState } from "react";
import EditorBlockText from "./EditorBlockText";
import EditorBlockImage from "./EditorBlockImage";
import { Delete } from "lucide-react";

const EditorBlock = memo(function EditorBlock({ props }) {
  // memo to re render only on param change

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
      {blockData.type === "image" ? (
        <EditorBlockImage />
      ) : (
        <EditorBlockText
          blockIndex={index}
          id={blockData.id}
          type={blockData.type}
          blockContent={blockData.content}
          updateBlockData={updateBlockData}
        />
      )}
    </div>
  );
});

export default EditorBlock;
