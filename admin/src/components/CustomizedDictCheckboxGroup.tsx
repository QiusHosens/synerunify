import { SystemDictDataResponse } from '@/api/dict';
import { useDictStore } from '@/store';
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, RadioPropsSizeOverrides } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { OverridableStringUnion } from '@mui/types';
import { useEffect, useState } from 'react';

interface CustomizedDictCheckboxGroupProps {
  size?: OverridableStringUnion<'small' | 'medium', RadioPropsSizeOverrides>;
  id?: string;
  name?: string;
  dict_type: string;
  value: any[];
  label: string;
  onChange?: (name: string | undefined, checkedValues: any[]) => void;
  sx?: SxProps<Theme>;
}

const CustomizedDictCheckboxGroup: React.FC<CustomizedDictCheckboxGroupProps> = ({
  size = 'small',
  id = 'custom-row-radio-buttons-group-label',
  name,
  dict_type,
  value,
  label,
  onChange,
  sx
}) => {
  const { dictOfType } = useDictStore();
  const [dicts, setDicts] = useState<SystemDictDataResponse[]>([]);
  const [checkedValues, setCheckedValues] = useState<any[]>([]);

  useEffect(() => {
    if (value) {
      setCheckedValues(value);
    }
    const datas = dictOfType.get(dict_type);
    if (datas) {
      setDicts(datas);
    }
  }, [dictOfType, dict_type, value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const { value } = event.target as HTMLInputElement;
    const values = checkedValues.includes(value) ? checkedValues.filter(item => item !== value) : [...checkedValues, value];
    setCheckedValues(values);
    onChange?.(name, values);
  }

  return (
    <>
      <FormControl>
        <FormLabel id={id}>{label}</FormLabel>
        <FormGroup row={true}>
          {dicts.map(item => (
            <FormControlLabel key={item.id} value={item.value} control={<Checkbox size={size} checked={checkedValues.includes(item.value)} onChange={handleChange} />} label={item.label} />
          ))}
        </FormGroup>
      </FormControl>
    </>
  )
}

export default CustomizedDictCheckboxGroup;