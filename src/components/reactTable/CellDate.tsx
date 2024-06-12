import React from "react";

type DateCellProps = {
  value: string;
  onBlur: (value: string) => void;
};

const CellDate: React.FC<DateCellProps> = ({ value, onBlur }) => {
  const [date, setDate] = React.useState(value);

  return (
    <input
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
      onBlur={() => onBlur(date)}
    />
  );
};

export default CellDate;
