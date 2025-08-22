import React, { useEffect, useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Minus, Plus } from 'lucide-react';

interface CustomizedNumberInputProps {
  required?: boolean;
  value?: number;
  step?: number;
  min?: number;
  max?: number;
  label?: string;
  name?: string;
  error?: boolean;
  helperText?: string;
  size?: 'small' | 'medium';
  onChange?: (value: number, name?: string) => void;
}

const CustomizedNumberInput: React.FC<CustomizedNumberInputProps> = ({
  required = false,
  value = 0,
  step = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  label,
  name,
  error,
  helperText,
  size = 'small',
  onChange,
}) => {
  const [internalValue, setInternalValue] = useState<number>(value);

  const handleChange = (newValue: number) => {
    const clamped = Math.min(Math.max(newValue, min), max);
    setInternalValue(clamped);
    onChange?.(clamped, name);
  };

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <TextField
      required={required}
      label={label}
      name={name}
      type="number"
      value={internalValue}
      error={error}
      helperText={helperText}
      onChange={(e) => handleChange(Number(e.target.value))}
      size={size}
      sx={{
        width: 200,
        '& .MuiOutlinedInput-root': {
          p: 0,
        },
        '& .MuiOutlinedInput-input': {
          textAlign: 'center',
          m: 0,
          py: '8.5px', // 保持TextField默认的垂直padding
        },
        '& .MuiInputAdornment-root': {
          m: 0,
          height: '100%',
          maxHeight: 'none',
        },
        '& .MuiIconButton-root': {
          borderRadius: 0,
          // 使用负边距来扩展IconButton，让它覆盖整个TextField高度
          my: '-8.5px',
        },
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment
              position="start"
              sx={{
                m: 0,
                height: '100%',
                display: 'flex',
                alignItems: 'stretch',
              }}
            >
              <span className="notranslate" aria-hidden="true">​</span>
              <IconButton
                aria-label="decrement"
                size={size}
                onClick={() => handleChange(internalValue - step)}
                disabled={internalValue <= min}
                sx={{
                  // height: '100%',
                  minWidth: 36,
                  border: 0,
                  borderColor: 'divider',
                  borderRadius: 0,
                  p: 0,
                  my: '-8.5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Minus fontSize={size} />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment
              position="end"
              sx={{
                m: 0,
                height: '100%',
                display: 'flex',
                alignItems: 'stretch',
              }}
            >
              <span className="notranslate" aria-hidden="true">​</span>
              <IconButton
                aria-label="increment"
                size={size}
                onClick={() => handleChange(internalValue + step)}
                disabled={internalValue >= max}
                sx={{
                  // height: '100%',
                  minWidth: 36,
                  border: 0,
                  borderColor: 'divider',
                  borderRadius: 0,
                  p: 0,
                  my: '-8.5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Plus fontSize={size} />
              </IconButton>
            </InputAdornment>
          ),
        },
        htmlInput: {
          step,
          min,
          max,
          style: { textAlign: 'center' },
        },
      }}
    />
  );
};

export default CustomizedNumberInput;