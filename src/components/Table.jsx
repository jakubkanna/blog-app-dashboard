import { useState } from "react";
import ButtonDelete from "./ButtonDelete";
import TableEditableCell from "./TableEditableCell";
import TableOptionsCell from "./TableOptionsCell";

const Table = ({ columns = [], data = [] }) => {
  const [tableData, setTableData] = useState(data);

  const handleSave = (rowIndex, cellIndex, newValue) => {
    const updatedData = tableData.map((row, rIdx) => {
      if (rIdx === rowIndex) {
        return row.map((cell, cIdx) => (cIdx === cellIndex ? newValue : cell));
      }
      return row;
    });
    setTableData(updatedData);
  };

  return (
    <table className="events-table">
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index}>{column.label}</th>
          ))}
          <th></th> {/* Placeholder for the extra column */}
        </tr>
      </thead>
      <tbody>
        {tableData.map((rowData, rowIndex) => (
          <tr key={rowIndex}>
            {rowData.map((cellData, cellIndex) => {
              const column = columns[cellIndex];
              if (!column) return null;

              const cellType = column.type || "text";
              const isEditable =
                column.editable !== undefined ? column.editable : true;

              return (
                <td key={cellIndex}>
                  {cellType === "select" ? (
                    <TableOptionsCell
                      value={cellData}
                      onSave={(newValue) =>
                        handleSave(rowIndex, cellIndex, newValue)
                      }
                      fetchOptions={column.fetchOptions}
                    />
                  ) : (
                    <TableEditableCell
                      value={cellData}
                      onSave={(newValue) =>
                        handleSave(rowIndex, cellIndex, newValue)
                      }
                      type={cellType}
                      editable={isEditable}
                    />
                  )}
                </td>
              );
            })}
            <td>
              <ButtonDelete />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
