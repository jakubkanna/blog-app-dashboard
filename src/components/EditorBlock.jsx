import { useState, useEffect } from "react";
import EditorBlockImage from "./EditorBlockImage";
import EditorBlockText from "./EditorBlockText";
import { Delete } from "lucide-react";

const EditorBlock = ({ params }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [blockIndex, setBlockIndex] = useState(params.block.index);
  const [blockContent, setBlockContent] = useState(params.block.content);

  //update block content
  useEffect(() => {
    params.block.content = blockContent;
  }, [blockContent, params.block.content]);

  // Update blockIndex when params.block.index changes
  useEffect(() => {
    setBlockIndex(params.block.index);
  }, [params.block.index]);

  const handleIndexChange = (event) => {
    const newIndex = parseInt(event.target.value, 10);
    if (!isNaN(newIndex) && newIndex > 0 && newIndex <= params.totalBlocks) {
      setBlockIndex(newIndex);
    }
  };

  const handleNewIndexSubmit = () => {
    setIsEditing(false);
    // Update the block order with the new block index
    params.updateBlockOrder(params.block.index - 1, blockIndex);
  };

  const handleDelete = () => {
    params.deleteBlock(params.block.id);
  };

  const Input = () => (
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
            {`Block ${params.block.index}: ${params.block.type}`}
          </small>
          <button>
            <Delete onClick={handleDelete} />
          </button>
        </div>
      )}
    </>
  );

  const BlockRenderer = () => {
    const rendererParams = {
      blockContent,
      setBlockContent: (content) => {
        setBlockContent(content);
        params.updateBlockContent(params.block.id, content);
      },
      blockIndex: params.block.index,
    };

    if (params.block.type === "image") {
      return <EditorBlockImage params={rendererParams} />;
    } else {
      return <EditorBlockText params={rendererParams} />;
    }
  };

  return (
    <div className={`editor-block-${params.block.type}-${params.block.id}`}>
      <Input />
      <BlockRenderer />
    </div>
  );
};

export default EditorBlock;
