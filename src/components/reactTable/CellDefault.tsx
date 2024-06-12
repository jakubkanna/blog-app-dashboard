import React from "react";

type CellEditableProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
};

const CellDefault: React.FC<CellEditableProps> = ({ value, onBlur }) => {
  const [internalValue, setInternalValue] = React.useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
  };

  return (
    <input
      type="text"
      value={internalValue}
      onChange={handleChange}
      onBlur={onBlur}
    />
  );
};

export default CellDefault;
