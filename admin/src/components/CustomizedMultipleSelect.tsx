import { Box, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";
import CustomizedTag from "./CustomizedTag";

export interface Item {
  value: string | number;
  label: string;
  status: number;
}

interface CustomizedMultipleSelectProps {
  name?: string;
  value: number[];
  label: string;
  items: Item[];
  onChange: (event: SelectChangeEvent<string | number[]>, child: ReactNode) => void;
  sx?: SxProps<Theme>;
}

const CustomizedMultipleSelect = ({ name, value, label, items, onChange, sx }: CustomizedMultipleSelectProps) => {

  const getLableByValue = (value: string | number) => {
    for (let item of items) {
      if (value === item.value) {
        return item.label;
      }
    }
    return '';
  }

  return (
    <>
      <InputLabel size="small" id="custom-multiple-select-label">{label}</InputLabel>
      <Select
        size="small"
        labelId="custom-multiple-select-label"
        multiple
        name={name}
        value={value}
        onChange={onChange}
        // label={label}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <CustomizedTag label={getLableByValue(value)} />
            ))}
          </Box>
        )}
      >
        {items.map(item => (
          <MenuItem key={item.value} value={item.value} disabled={!!item.status}>{item.label}</MenuItem>
        ))}
      </Select>
    </>
  )
}

export default CustomizedMultipleSelect;