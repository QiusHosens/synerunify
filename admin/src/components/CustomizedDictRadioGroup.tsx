import { SystemDictDataResponse } from '@/api/dict';
import { useDictStore } from '@/store';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, RadioPropsSizeOverrides } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { OverridableStringUnion } from '@mui/types';
import { useEffect, useState } from 'react';

interface CustomizedDictRadioGroupProps {
  size?: OverridableStringUnion<'small' | 'medium', RadioPropsSizeOverrides>;
  id?: string;
  name?: string;
  dict_type: string;
  value: any;
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>, value: any) => void;
  sx?: SxProps<Theme>;
}

const CustomizedDictRadioGroup: React.FC<CustomizedDictRadioGroupProps> = ({
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

  useEffect(() => {
    const datas = dictOfType.get(dict_type);
    if (datas) {
      setDicts(datas);
    }
  }, [dictOfType, dict_type]);

  return (
    <>
      <FormControl sx={sx}>
        <FormLabel id={id}>{label}</FormLabel>
        <RadioGroup
          row
          aria-labelledby={id}
          name={name}
          value={value}
          onChange={onChange}
        >
          {dicts.map(item => (
            <FormControlLabel key={item.id} value={item.value} control={<Radio size={size} />} label={item.label} />
          ))}
        </RadioGroup>
      </FormControl>
    </>
  )
}

export default CustomizedDictRadioGroup;