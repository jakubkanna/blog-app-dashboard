// problems remove item, lack of focus on click delete button

import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { Option } from "../../types";
import _ from "lodash";

interface InputAutocompleteFieldProps {
  id: string;
  label: string;
  multiple?: boolean;
  freeSolo?: boolean;
  fetchOptions: () => Promise<Option[]>;
  onChange: (value: Option | Option[]) => void;
  initVal: Option | Option[];
}

const InputAutocompleteField: React.FC<InputAutocompleteFieldProps> = ({
  id,
  label,
  multiple,
  freeSolo,
  fetchOptions,
  onChange,
  initVal,
}) => {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<Option[]>([]);
  const loading = open && options.length === 0;
  const [value, setValue] = React.useState<Option | Option[]>(initVal);

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const data = await fetchOptions();
      if (active) {
        setOptions([...data]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);
  const filter = createFilterOptions<Option>();

  return (
    <Autocomplete
      options={options}
      loading={loading}
      multiple={multiple}
      freeSolo={freeSolo}
      selectOnFocus
      autoSelect
      fullWidth
      id={id + "-autocomplete-field"}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      value={value}
      onChange={(_event, newValue: any) => {
        setValue(newValue);
        onChange(newValue);
      }}
      isOptionEqualToValue={(option, value) => option.label === value.label}
      getOptionLabel={(option) => option.label}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some(
          (option) => inputValue === option.label
        );
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            value: inputValue,
            label: inputValue,
          });
        }

        return filtered;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default InputAutocompleteField;
