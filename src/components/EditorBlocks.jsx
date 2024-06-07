import { useContext, useEffect, useState } from "react";
import EditorBlock from "./EditorBlock";
import { EditorContext } from "../context/EditorContext";

export default function EditorBlocks() {
  const { blocks, setBlocks } = useContext(EditorContext);

  const updateBlockData = (index, newData) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = { ...updatedBlocks[index], ...newData };
    setBlocks(updatedBlocks);
  };

  const updateBlockOrder = (index, newIndex) => {
    if (index === newIndex) return;
    const blocksCopy = [...blocks];
    const [removedBlock] = blocksCopy.splice(index, 1);
    blocksCopy.splice(newIndex, 0, removedBlock);
    setBlocks(blocksCopy);
  };

  const deleteBlock = (id) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  return (
    <>
      {blocks.map((block, index) => (
        <EditorBlock
          key={block.id}
          props={{
            index: index,
            totalBlocks: blocks.length,
            blockData: block,
            updateBlockData: (newData) => updateBlockData(index, newData),
            updateBlockOrder: (newIndex) => updateBlockOrder(index, newIndex),
            deleteBlock: deleteBlock,
          }}
        />
      ))}
    </>
  );
}
