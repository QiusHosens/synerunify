import { SystemDictDataResponse } from '@/api/dict';
import { useDictStore } from '@/store';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { ReactNode, useEffect, useState } from 'react';

interface DictSelectProps {
    name?: string;
    dict_type: string;
    hasEmpty?: boolean;
    value: string;
    label: string;
    onChange: (event: SelectChangeEvent<string>, child: ReactNode) => void;
    sx?: SxProps<Theme>;
}

const DictSelect: React.FC<DictSelectProps> = ({
    name,
    dict_type,
    hasEmpty,
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
    }, [dictOfType]);

    return (
        <>
            <InputLabel size="small" id="custom-dict-select-label">{label}</InputLabel>
            <Select
                size="small"
                labelId="custom-dict-select-label"
                name={name}
                value={value}
                onChange={onChange}
                label={label}
            >
                {hasEmpty && <MenuItem value="">请选择</MenuItem>}
                {dicts.map(item => (
                    <MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>
                ))}
            </Select>
        </>
    )
}

export default DictSelect;