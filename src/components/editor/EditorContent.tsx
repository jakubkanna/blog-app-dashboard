import React, { useContext } from "react";
import EditorBlock from "./EditorBlock";
import { EditorContext } from "../../contexts/EditorContext";

export default function EditorBlocks() {
  const { blocks, setBlocks } = useContext(EditorContext)!;

  const updateBlockData = (
    index: number,
    newData: Partial<{ id: string; content: string; index: number }>
  ) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = { ...updatedBlocks[index], ...newData };
    setBlocks(updatedBlocks);
  };

  const updateBlockOrder = (index: number, newIndex: number) => {
    if (index === newIndex) return;
    const blocksCopy = [...blocks];
    const [removedBlock] = blocksCopy.splice(index, 1);
    blocksCopy.splice(newIndex, 0, removedBlock);
    setBlocks(blocksCopy);
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  return (
    <>
      {blocks &&
        blocks.map((block, index) => (
          <EditorBlock
            key={block.id}
            props={{
              index,
              totalBlocks: blocks.length,
              blockData: block,
              updateBlockData: (
                newData: Partial<{ id: string; content: string; index: number }>
              ) => updateBlockData(index, newData),
              updateBlockOrder: (newIndex: number) =>
                updateBlockOrder(index, newIndex),
              deleteBlock,
            }}
          />
        ))}
    </>
  );
}
