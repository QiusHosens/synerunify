import React, { useState } from "react";
import { TextField, IconButton, Box } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

interface CustomizedNumberInputProps {
  value?: number;
  step?: number;
  min?: number;
  max?: number;
  label?: string;
  name?: string;
  onChange?: (value: number, name?: string) => void;
}

const CustomizedNumberInput: React.FC<CustomizedNumberInputProps> = ({
  value = 0,
  step = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  label,
  name,
  onChange,
}) => {
  const [internalValue, setInternalValue] = useState<number>(value);

  const handleChange = (newValue: number) => {
    const clamped = Math.min(Math.max(newValue, min), max);
    setInternalValue(clamped);
    onChange?.(clamped, name);
  };

  return (
    <Box display="flex" alignItems="center">
      <IconButton
        onClick={() => handleChange(internalValue - step)}
        disabled={internalValue <= min}
      >
        <Remove />
      </IconButton>

      <TextField
        label={label}
        name={name}
        type="number"
        value={internalValue}
        onChange={(e) => handleChange(Number(e.target.value))}
        size="small"
        sx={{ width: 120, mx: 1 }}
        slotProps={{
          input: {
            step,
            min,
            max,
            style: { textAlign: "center" },
          },
        }}
      />

      <IconButton
        onClick={() => handleChange(internalValue + step)}
        disabled={internalValue >= max}
      >
        <Add />
      </IconButton>
    </Box>
  );
};

export default CustomizedNumberInput;
