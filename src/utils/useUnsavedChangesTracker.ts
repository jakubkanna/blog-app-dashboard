import { useLocation } from "react-router-dom";

const useUnsavedChangesTracker = () => {
  const location = useLocation();

  const verifyUnsavedChanges = (path: string): boolean => {
    const existingPaths = JSON.parse(
      localStorage.getItem("hasUnsavedChanges") || "[]"
    );
    return existingPaths.includes(path);
  };

  const setUnsavedChanges = () => {
    const path = location.pathname;
    let existingPaths: string[] = [];
    const storedPaths = localStorage.getItem("hasUnsavedChanges");

    if (storedPaths) {
      try {
        existingPaths = JSON.parse(storedPaths);
      } catch (error) {
        console.error("Error parsing JSON from localStorage:", error);
        existingPaths = [];
      }
    }

    if (!existingPaths.includes(path)) {
      existingPaths.push(path);
      localStorage.setItem("hasUnsavedChanges", JSON.stringify(existingPaths));
    }
  };

  const removeUnsavedChanges = () => {
    const path = location.pathname;
    let existingPaths: string[] = [];
    const storedPaths = localStorage.getItem("hasUnsavedChanges");

    if (storedPaths) {
      try {
        existingPaths = JSON.parse(storedPaths);
      } catch (error) {
        console.error("Error parsing JSON from localStorage:", error);
        existingPaths = [];
      }
    }

    const updatedPaths = existingPaths.filter((p: string) => p !== path);
    localStorage.setItem("hasUnsavedChanges", JSON.stringify(updatedPaths));
  };

  return {
    verifyUnsavedChanges,
    setUnsavedChanges,
    removeUnsavedChanges,
  };
};

export default useUnsavedChangesTracker;
