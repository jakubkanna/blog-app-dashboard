import React from "react";

type BooleanCellProps = {
  value: boolean;
  onBlur: (value: boolean) => void;
};

const CellBolean: React.FC<BooleanCellProps> = ({ value, onBlur }) => {
  const [checked, setChecked] = React.useState(value);

  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
      onBlur={() => onBlur(checked)}
    />
  );
};

export default CellBolean;
