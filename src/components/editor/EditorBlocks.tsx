import { useEffect } from "react";
import EditorBlock from "./EditorBlock";

export default function EditorBlocks({ blocks, setBlocks }) {
  const totalBlocks = blocks.length;

  const updateBlockData = (
    index: number,
    newData: Partial<{ html: string }>
  ) => {
    const blocksCopy = [...blocks];
    blocksCopy[index] = { ...blocksCopy[index], ...newData };
    setBlocks(blocksCopy);
  };
  const updateBlockOrder = (index: number, newIndex: number) => {
    if (index === newIndex) return;

    const blocksCopy = [...blocks];
    const [removedBlock] = blocksCopy.splice(index, 1);
    blocksCopy.splice(newIndex, 0, removedBlock);

    const updatedBlocks = blocksCopy.map((block, idx) => ({
      ...block,
      index: idx,
    }));

    setBlocks(updatedBlocks);
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  return (
    <>
      {blocks &&
        blocks.map((block) => (
          <EditorBlock
            key={block.id}
            blockProps={{ ...block }}
            props={{
              updateBlockOrder,
              deleteBlock,
              updateBlockData,
              totalBlocks,
            }}
          />
        ))}
    </>
  );
}
