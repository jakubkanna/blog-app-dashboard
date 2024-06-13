import React, { useEffect, useState } from "react";

type CellEditableProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
};

const CellDefault: React.FC<CellEditableProps> = ({
  value,
  onChange,
  onBlur,
}) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    onChange(e.target.value);
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
