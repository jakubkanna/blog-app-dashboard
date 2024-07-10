import React, { createContext, useContext, useState, useEffect } from "react";
import { PageContextType, ProviderProps } from "../../types";
import {
  useCreateData,
  useFetchData,
  useUpdateData,
  useDeleteData,
} from "./useFetch";

const createGenericContext = <T extends {}>(
  fetchUrl: string,
  createUrl: string,
  updateUrl: string,
  deleteUrl: string
) => {
  const Context = createContext<PageContextType<T> | undefined>(undefined);

  const useGenericContext = () => {
    const context = useContext(Context);
    if (!context) {
      throw new Error("useGenericContext must be used within a Provider");
    }
    return context as PageContextType<T>;
  };

  const Provider: React.FC<ProviderProps> = ({ children }) => {
    const { data, loading: fetchLoading } = useFetchData<T>(fetchUrl);

    const { createData, loading: createLoading } = useCreateData<T>(createUrl);
    const { updateData, loading: updateLoading } = useUpdateData<T>(updateUrl);
    const { deleteData, loading: deleteLoading } = useDeleteData(deleteUrl);

    const [items, setItems] = useState<T[]>(data);

    useEffect(() => {
      setItems(data);
    }, [data]);

    const handleCreateData = async (newItem: T) => {
      const createdItem = await createData(newItem);
      if (createdItem) {
        setItems((prevItems) => [...prevItems, createdItem]);
      }
      return createdItem;
    };

    const handleUpdateData = async (updatedItem: T) => {
      const item = await updateData(updatedItem);
      if (item) {
        setItems((prevItems) =>
          prevItems.map((i) =>
            (i as any)._id === (item as any)._id ? item : i
          )
        );
      }
      return item;
    };

    const handleDeleteData = async (itemId: string) => {
      const success = await deleteData(itemId);
      if (success) {
        setItems((prevItems) =>
          prevItems.filter((i) => (i as any)._id !== itemId)
        );
      }
      return success;
    };

    return (
      <Context.Provider
        value={{
          data: items,
          createData: handleCreateData,
          updateData: handleUpdateData,
          deleteData: handleDeleteData,
          loading:
            fetchLoading || createLoading || updateLoading || deleteLoading,
        }}>
        {children}
      </Context.Provider>
    );
  };

  return { useGenericContext, Provider };
};

export default createGenericContext;
