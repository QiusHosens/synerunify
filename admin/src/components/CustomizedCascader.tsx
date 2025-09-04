import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TextField, InputAdornment, IconButton, Popover, List, ListItemButton, ListItemText, Box } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { X } from "lucide-react";

export interface CascaderOption {
  label: string;
  value: string;
  disabled?: boolean;
  children?: CascaderOption[];
}

export interface CascaderProps {
  options: CascaderOption[];
  label?: string;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[], selectedOptions: CascaderOption[]) => void;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium";
  separator?: string;
  error?: boolean;
  helperText?: React.ReactNode;
}

const findOptionByValue = (options: CascaderOption[], value: string | undefined): CascaderOption | undefined => {
  if (!value) return undefined;
  return options.find((opt) => opt.value === value);
};

const findPathOptions = (options: CascaderOption[], pathValues: string[]): CascaderOption[] => {
  const selected: CascaderOption[] = [];
  let currentLevel = options;
  for (const val of pathValues) {
    const opt = findOptionByValue(currentLevel, val);
    if (!opt) break;
    selected.push(opt);
    currentLevel = opt.children || [];
  }
  return selected;
};

const flattenPaths = (options: CascaderOption[], base: CascaderOption[] = []): CascaderOption[][] => {
  const acc: CascaderOption[][] = [];
  for (const opt of options) {
    const path = [...base, opt];
    if (opt.children && opt.children.length > 0) {
      acc.push(...flattenPaths(opt.children, path));
    } else {
      acc.push(path);
    }
  }
  return acc;
};

const CustomizedCascader: React.FC<CascaderProps> = ({
  options,
  label,
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled,
  fullWidth,
  size = "medium",
  separator = " / ",
  error,
  helperText,
}) => {
  const [open, setOpen] = useState(false);
  const [over, setOver] = useState(false);
  const anchorRef = useRef<HTMLDivElement | null>(null);

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(defaultValue || []);
  const selectedValues = isControlled ? (value as string[]) : uncontrolledValue;

  const allLeafPaths = useMemo(() => flattenPaths(options), [options]);

  const selectedOptions = useMemo(() => findPathOptions(options, selectedValues), [options, selectedValues]);

  const displayLabel = useMemo(() => {
    return selectedOptions.map((o) => o.label).join(separator);
  }, [selectedOptions, separator]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const handleOpen = useCallback(() => {
    if (disabled) return;
    setOpen(true);
  }, [disabled]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const setPath = useCallback(
    (next: string[], opts: CascaderOption[]) => {
      if (isControlled) {
        onChange?.(next, opts);
      } else {
        setUncontrolledValue(next);
        onChange?.(next, opts);
      }
    },
    [isControlled, onChange]
  );

  const [hoverPath, setHoverPath] = useState<string[]>([]);

  useEffect(() => {
    if (!open) {
      setHoverPath(selectedValues);
    }
  }, [open, selectedValues]);

  const panels: CascaderOption[][] = useMemo(() => {
    const result: CascaderOption[][] = [];
    let levelOptions = options;
    let index = 0;
    while (levelOptions && levelOptions.length > 0) {
      const term = search.trim().toLowerCase();
      const filtered = term
        ? levelOptions.filter((o) => o.label.toLowerCase().includes(term))
        : levelOptions;
      result.push(filtered);
      const chosenValue = hoverPath[index];
      const chosen = findOptionByValue(levelOptions, chosenValue);
      if (!chosen || !chosen.children || chosen.children.length === 0) break;
      levelOptions = chosen.children;
      index += 1;
    }
    return result;
  }, [options, hoverPath, search]);

  const handleItemClick = (levelIndex: number, option: CascaderOption) => {
    if (option.disabled) return;
    const nextPath = [...hoverPath.slice(0, levelIndex), option.value];
    setHoverPath(nextPath);
    if (option.children && option.children.length > 0) return;
    const selected = findPathOptions(options, nextPath);
    setPath(nextPath, selected);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPath([], []);
  };

  const quickSelectIfExactMatch = useCallback(
    (term: string) => {
      const trimmed = term.trim();
      if (!trimmed) return;
      const hit = allLeafPaths.find((p) => p.map((x) => x.label).join(separator) === trimmed);
      if (hit) {
        const values = hit.map((x) => x.value);
        setPath(values, hit);
        setOpen(false);
      }
    },
    [allLeafPaths, separator, setPath]
  );

  return (
    <>
      <TextField
        label={label}
        inputRef={(el) => (anchorRef.current = el)}
        value={open ? search : displayLabel}
        onChange={(e) => setSearch(e.target.value)}
        onClick={handleOpen}
        onMouseEnter={() => setOver(true)}
        onMouseLeave={() => setOver(false)}
        placeholder={placeholder}
        disabled={disabled}
        fullWidth={fullWidth}
        size={size}
        error={error}
        helperText={helperText}
        slotProps={{
          input: {
            readOnly: !open && over,
            endAdornment: (
              <InputAdornment position="end">
                {displayLabel && !open && over ? (
                  <IconButton size="small" onClick={handleClear} disabled={disabled} sx={{ ':hover': { backgroundColor: 'transparent' } }}>
                    <X />
                  </IconButton>
                ) : null}
              </InputAdornment>
            ),
          },
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            quickSelectIfExactMatch(search);
          }
          if (e.key === "Escape") {
            handleClose();
          }
        }}
        sx={{
          '& .MuiInputBase-root': {
            paddingRight: 0,
          },
        }}
      />

      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{ paper: { sx: { p: 1 } } }}
      >
        <Box sx={{ display: "flex", gap: 1, maxHeight: 360 }}>
          {panels.map((panelOptions, level) => (
            <List key={level} dense sx={{ minWidth: 180, overflow: "auto", maxHeight: 360 }}>
              {panelOptions.map((opt) => {
                const active = hoverPath[level] === opt.value;
                const isLeaf = !opt.children || opt.children.length === 0;
                return (
                  <ListItemButton
                    key={opt.value}
                    disabled={opt.disabled}
                    selected={active}
                    onClick={() => handleItemClick(level, opt)}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                      <ListItemText primary={opt.label} />
                      {!isLeaf ? (active ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />) : null}
                    </Box>
                  </ListItemButton>
                );
              })}
            </List>
          ))}
        </Box>
      </Popover>
    </>
  );
};

export default CustomizedCascader;