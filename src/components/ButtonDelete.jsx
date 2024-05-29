import { Trash } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function ButtonDelete({ props }) {
  const { token } = useContext(AuthContext);
  const confirmDelete = () => {
    const result = window.confirm(
      `Are you sure you want to delete item: ${props.data._id} from ${props.type} permanently?`
    );
    if (result) {
      actionDelete();
    }
  };

  const actionDelete = async () => {
    try {
      const endpoint = `http://localhost:3000/api/${props.type}/delete/${props.data._id}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        console.log(`${props.type} deleted`);
      }
    } catch (err) {
      console.error(`Error deleting ${props.type}:`, err);
    }
  };

  return (
    <button type="button" onClick={confirmDelete}>
      <Trash />
    </button>
  );
}
