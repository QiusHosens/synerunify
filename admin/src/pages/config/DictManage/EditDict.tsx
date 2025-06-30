import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { listDictType, SystemDictDataRequest, SystemDictDataResponse, SystemDictTypeResponse, updateDict } from '@/api/dict';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors {
  dict_type?: string;
  label?: string;
  value?: string;
  sort?: string;
}

interface DictEditProps {
  onSubmit: () => void;
}

const DictEdit = forwardRef(({ onSubmit }: DictEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [types, setTypes] = useState<SystemDictTypeResponse[]>([]);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [dict, setDict] = useState<SystemDictDataRequest>({
    id: 0,
    dict_type: '',
    label: '',
    value: '',
    sort: 0,
    color_type: '',
    css_class: '',
    remark: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(dict: SystemDictDataResponse) {
      listTypes();
      initForm(dict);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const listTypes = async () => {
    const types = await listDictType();
    setTypes(types);
    // if (types.length > 0) {
    //   setFormValues(prev => ({
    //     ...prev,
    //     dict_type: types[0].type
    //   }));
    // }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!dict.dict_type.trim()) {
      newErrors.dict_type = t('global.error.select.please') + t('page.dict.title.dict.type');
    }

    if (!dict.label.trim()) {
      newErrors.label = t('global.error.input.please') + t('page.dict.title.label');
    }

    if (!dict.value.trim()) {
      newErrors.value = t('global.error.input.please') + t('page.dict.title.value');
    }

    if (!dict.sort && dict.sort != 0) {
      newErrors.sort = t('global.error.input.please') + t('page.dict.title.sort');
    }

    console.log('errors', newErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    setOpen(false);
    // reset();
  };

  const handleClose = () => {
    setOpen(false);
    // reset();
  };

  const initForm = (dict: SystemDictDataResponse) => {
    setDict({
      ...dict,
      // id: dict.id,
      // dict_type: dict.dict_type,
      // label: dict.label,
      // value: dict.value,
      // sort: dict.sort,
      // color_type: dict.color_type as string,
      // css_class: dict.css_class as string,
      // remark: dict.remark as string,
    });
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateDict(dict);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('target', e.target);
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setDict(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setDict(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // console.log('formValues', formValues);

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setDict(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.edit') + t('global.page.dict')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.update')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          m: 'auto',
          width: 'fit-content',
        }}
      >
        <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiSelect-root': { width: '200px' } }}>
          <InputLabel required size="small" id="dict-type-select-label">{t("common.title.type")}</InputLabel>
          <Select
            required
            size="small"
            classes={{ select: 'CustomSelectSelect' }}
            labelId="dict-type-select-label"
            name="dict_type"
            value={dict.dict_type}
            onChange={event => handleSelectChange(event)}
            label={t("common.title.type")}
          >
            {types.map(item => (<MenuItem key={item.type} value={item.type}>{item.name}</MenuItem>))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '200px' } }}>
          <TextField
            required
            size="small"
            label={t("page.dict.title.label")}
            name="label"
            value={dict.label}
            onChange={handleInputChange}
            error={!!errors.label}
            helperText={errors.label}
          />
          <TextField
            required
            size="small"
            label={t("page.dict.title.value")}
            name="value"
            value={dict.value}
            onChange={handleInputChange}
            error={!!errors.value}
            helperText={errors.value}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("common.title.sort")}
            name="sort"
            value={dict.sort}
            onChange={handleInputChange}
            error={!!errors.sort}
            helperText={errors.sort}
          />
          <TextField
            size="small"
            label={t("common.title.remark")}
            name="remark"
            value={dict.remark}
            onChange={handleInputChange}
          />
        </FormControl>
      </Box>
    </CustomizedDialog>
  )
});

export default DictEdit;