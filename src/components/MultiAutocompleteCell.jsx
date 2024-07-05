import { Autocomplete, MenuItem, TextField } from "@mui/material";
import { CheckIcon } from "lucide-react";
import PropTypes from "prop-types";

const MultiAutocomplete = ({ options, params }) => {
  return (
    <Autocomplete
      sx={{ m: 1, width: 500 }}
      multiple
      id="tags-standard"
      options={options}
      getOptionLabel={(option) => option}
      defaultValue={[options[0], options[1]]}
      disableCloseOnSelect
      renderOption={(props, option, { selected }) => (
        <MenuItem
          key={option}
          value={option}
          sx={{ justifyContent: "space-between" }}
          {...props}>
          {option}
          {selected ? <CheckIcon color="info" /> : null}
        </MenuItem>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Multiple Autocomplete"
          placeholder="Favorites"
        />
      )}
    />
  );
};

MultiAutocomplete.propTypes = {
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

export default MultiAutocomplete;
