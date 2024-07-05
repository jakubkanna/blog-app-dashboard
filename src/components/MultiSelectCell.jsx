import { useEffect, useState } from "react";
import { FormControl, MenuItem, OutlinedInput, Select } from "@mui/material";
import { GridCheckIcon, useGridApiContext } from "@mui/x-data-grid";
import PropTypes from "prop-types";

const MultiSelect = ({ options, params }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const apiRef = useGridApiContext();

  useEffect(() => {
    const currentValue = apiRef.current.getCellValue(params.id, params.field);
    setSelectedOptions(currentValue || []);
  }, [apiRef, params.id, params.field]);

  const handleSelectChange = (event) => {
    setSelectedOptions(event.target.value);
  };

  const renderValue = (selected) => {
    const selectedItems = selected.map((id) =>
      options.find((opt) => opt.id === id)
    );

    if (selectedItems.length === 0) {
      return <em>Select options</em>;
    }

    if (selectedItems.length === 1) {
      return selectedItems[0].label;
    }

    return (
      <>
        {selectedItems[0].label} + <em>{`${selectedItems.length - 1} more`}</em>
      </>
    );
  };

  return (
    <FormControl sx={{ width: "100%" }}>
      <Select
        multiple
        value={selectedOptions}
        onChange={handleSelectChange}
        input={<OutlinedInput id="multiple-select" />}
        renderValue={() => renderValue(selectedOptions)}
        sx={{ width: "100%", height: "100%" }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 300,
            },
          },
        }}
        onBlur={() => {
          apiRef.current.setEditCellValue({
            id: params.id,
            field: params.field,
            value: selectedOptions,
          });
        }}>
        {options.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.label}
            {selectedOptions.includes(option.id) ? (
              <GridCheckIcon color="info" />
            ) : null}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

MultiSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  params: PropTypes.shape({
    id: PropTypes.any.isRequired,
    field: PropTypes.string.isRequired,
  }).isRequired,
};

export default MultiSelect;
