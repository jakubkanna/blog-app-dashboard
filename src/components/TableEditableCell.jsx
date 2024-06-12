import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const TableEditableCell = ({
  value,
  onSave,
  type = "text",
  editable = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(
    type === "year" && !value ? "2016" : value
  );

  const handleClick = () => {
    if (editable) {
      setIsEditing(true);
    }
  };

  const handleChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onSave(editValue);
  };

  useEffect(() => {
    if (!isEditing) {
      setEditValue(type === "year" && !value ? "2016" : value);
    }
  }, [isEditing, value, type]);

  return isEditing ? (
    type === "year" ? (
      <input
        type={"number"}
        min={"1900"}
        max={"2099"}
        step={"1"}
        value={editValue}
        onChange={handleChange}
        onBlur={handleBlur}
        autoFocus
      />
    ) : (
      <input
        type={type}
        value={editValue}
        onChange={handleChange}
        onBlur={handleBlur}
        autoFocus
      />
    )
  ) : (
    <div onClick={handleClick}>{value}</div>
  );
};

TableEditableCell.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  onSave: PropTypes.func.isRequired,
  type: PropTypes.string,
  editable: PropTypes.bool,
};

export default TableEditableCell;
