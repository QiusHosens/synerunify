import { SystemDictDataResponse } from '@/api/dict';
import { useDictStore } from '@/store';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { ReactNode, useEffect, useState } from 'react';

interface DictSelectProps {
    type: string;
    value: number;
    label: string;
    onChange: (event: SelectChangeEvent<number>, child: ReactNode) => void;
    sx?: SxProps<Theme>;
}

const DictSelect: React.FC<DictSelectProps> = ({
    type,
    value,
    label,
    onChange,
    sx
}) => {
    const { dictOfType } = useDictStore();
    const [dicts, setDicts] = useState<SystemDictDataResponse[]>([]);

    useEffect(() => {
        const datas = dictOfType.get(type);
        if (datas) {
            setDicts(datas);
        }
    }, [dictOfType]);

    return (
        <FormControl sx={{ minWidth: 120, '& .MuiSelect-root': { width: '200px' }, ...sx }}>
            <InputLabel size="small" id="custom-dict-select-label">{label}</InputLabel>
            <Select
                size="small"
                labelId="custom-dict-select-label"
                name="dict_type"
                value={value}
                onChange={onChange}
                label={label}
            >
                <MenuItem value="">请选择</MenuItem>
                {dicts.map(item => (
                    <MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default DictSelect;