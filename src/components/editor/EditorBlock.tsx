import React, { memo, useState } from "react";
import { Delete } from "lucide-react";
import { Button } from "@mui/material";
import TextEditor from "../TextEditor";
import { Block } from "../../../types";

interface EditorBlockProps {
  blockProps: Block;
  props: {
    updateBlockOrder: (index: number, newIndex: number) => void;
    deleteBlock: (id: string) => void;
    updateBlockData: (index: number, newData: { html: string }) => void;
    totalBlocks: number;
  };
}

const EditorBlock: React.FC<EditorBlockProps> = memo(
  ({ blockProps, props }) => {
    const { updateBlockOrder, deleteBlock, updateBlockData, totalBlocks } =
      props;
    const { id, index, type, html } = blockProps;

    const Input: React.FC = () => {
      const [blockIndex, setBlockIndex] = useState(index);
      const [isEditing, setIsEditing] = useState(false);

      const handleDelete = () => {
        deleteBlock(id);
      };

      const handleIndexChange = (
        event: React.ChangeEvent<HTMLInputElement>
      ) => {
        const newIndex = parseInt(event.target.value, 10);
        if (!isNaN(newIndex) && newIndex >= 0 && newIndex < totalBlocks) {
          setBlockIndex(newIndex);
        }
      };

      const handleNewIndexSubmit = () => {
        setIsEditing(false);
        updateBlockOrder(index, blockIndex);
      };

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
                {`${index}: ${type}`}
              </small>
              <Button onClick={handleDelete}>
                <Delete />
              </Button>
            </div>
          )}
        </>
      );
    };

    return (
      <div className={`editor-${id}`}>
        <Input />
        {type === "image" ? null : (
          <TextEditor
            key={index}
            id={`text-editor-${id}`}
            initVal={html}
            onBlur={(content) => updateBlockData(index, { html: content })}
          />
        )}
      </div>
    );
  }
);

export default EditorBlock;
