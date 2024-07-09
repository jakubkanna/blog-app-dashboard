import { Option } from "../../types";

const useFetchTags = async (): Promise<Option[]> => {
  try {
    const response = await fetch("http://localhost:3000/api/tags/");
    const data = await response.json();
    return data.map((tag: string) => ({
      label: tag,
      value: tag,
    }));
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return [];
  }
};

export default useFetchTags;
