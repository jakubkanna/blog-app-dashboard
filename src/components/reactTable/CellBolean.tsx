import React from "react";

type BooleanCellProps = {
  value: boolean;
  cb: (value: boolean) => void;
};

const CellBolean: React.FC<BooleanCellProps> = ({ value, cb }) => {
  const [checked, setChecked] = React.useState(value);

  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => {
        const newValue = e.target.checked;
        setChecked(newValue);
        cb(newValue);
      }}
    />
  );
};

export default CellBolean;
