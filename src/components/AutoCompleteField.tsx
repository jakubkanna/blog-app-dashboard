import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { Option } from "../../types";

interface AutoCompleteFieldProps {
  id: string;
  label: string;
  multiple: boolean;
  fetchOptions: () => Promise<Option[]>;
  onBlur: (value: Option | Option[] | undefined) => void;
  initVal?: Option | Option[];
}

const AutoCompleteField: React.FC<AutoCompleteFieldProps> = ({
  id,
  label,
  multiple,
  fetchOptions,
  onBlur,
  initVal,
}) => {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<Option[]>([]);
  const loading = open && options.length === 0;
  const [value, setValue] = React.useState<Option | Option[] | undefined>(
    multiple ? [] : undefined
  );
  React.useEffect(() => setValue(initVal), [initVal]);

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

  return (
    <Autocomplete
      multiple={multiple}
      id={id + "-autocomplete-field"}
      sx={{ width: 300 }}
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
      }}
      onBlur={() => onBlur(value)}
      isOptionEqualToValue={(option, value) => option.label === value.label}
      getOptionLabel={(option) => option.label}
      options={options}
      loading={loading}
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

export default AutoCompleteField;
