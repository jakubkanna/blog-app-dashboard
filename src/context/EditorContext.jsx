import { createContext, useEffect, useState } from "react";
export const EditorContext = createContext();

export const EditorContextProvider = ({ storageKey, children }) => {
  const [title, setTitle] = useState("Untitled");
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    // Create a default data object if it doesn't exist in sessionStorage
    if (!sessionStorage.getItem(storageKey)) {
      const defaultData = {
        title: "Untitled",
        blocks: [],
      };
      sessionStorage.setItem(storageKey, JSON.stringify(defaultData));
    }
  }, [storageKey]);

  useEffect(() => {
    // Update sessionStorage with the new blocks
    const data = JSON.parse(sessionStorage.getItem(storageKey)) || {};
    data.blocks = blocks;
    sessionStorage.setItem(storageKey, JSON.stringify(data));
  }, [blocks, storageKey]);

  useEffect(() => {
    // Save the updated title to session storage
    const data = JSON.parse(sessionStorage.getItem(storageKey)) || {};
    data.title = title;
    sessionStorage.setItem(storageKey, JSON.stringify(data));
  }, [title, storageKey]);

  return (
    <EditorContext.Provider
      value={{ storageKey, title, setTitle, blocks, setBlocks }}>
      {children}
    </EditorContext.Provider>
  );
};
