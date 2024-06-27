// components/ButtonDelete.tsx
import { Trash } from "lucide-react";
import PropTypes from "prop-types";

export default function ButtonDelete({ id, cb }) {
  const confirmDelete = () => {
    const result = window.confirm(
      `Are you sure you want to delete item: ID:${id} permanently?`
    );
    if (result) actionDelete();
  };

  const actionDelete = async () => {
    cb(id);
  };

  return (
    <Button type="Button" onClick={confirmDelete}>
      <Trash />
    </Button>
  );
}
