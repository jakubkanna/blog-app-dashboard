import { createContext, useEffect, useState } from "react";
export const EditorContext = createContext();

export const EditorContextProvider = ({ storageKey, children }) => {
  const stringData = sessionStorage.getItem(storageKey);
  const data = stringData ? JSON.parse(stringData).data : null;

  const [title, setTitle] = useState(data ? data.title : "Untitled");
  const [blocks, setBlocks] = useState(data ? data.blocks : []);

  useEffect(() => {
    // Create a default data object if it doesn't exist in sessionStorage
    if (!sessionStorage.getItem(storageKey)) {
      const defaultData = {
        data: {
          title: "Untitled",
          blocks: [],
        },
      };
      sessionStorage.setItem(storageKey, JSON.stringify(defaultData));
    }
  }, [storageKey]);

  useEffect(() => {
    // Update sessionStorage with the new blocks
    const data = JSON.parse(sessionStorage.getItem(storageKey));
    data.data.blocks = blocks;
    sessionStorage.setItem(storageKey, JSON.stringify(data));
  }, [blocks, storageKey]);

  useEffect(() => {
    // Save the updated title to session storage under the 'data' parameter
    const savedData = sessionStorage.getItem(storageKey);
    const newData = savedData ? JSON.parse(savedData) : { data: {} };
    newData.data.title = title;
    sessionStorage.setItem(storageKey, JSON.stringify(newData));
  }, [title, storageKey]);

  return (
    <EditorContext.Provider
      value={{ storageKey, title, setTitle, blocks, setBlocks }}>
      {children}
    </EditorContext.Provider>
  );
};
