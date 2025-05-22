import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createDict, listDictType, SystemDictDataRequest, SystemDictTypeResponse } from '@/api/dict';

interface FormValues {
  dict_type: string;
  label: string;
  value: string;
  sort: number;
  color_type: string;
  css_class: string;
  remark: string;
}

interface FormErrors {
  dict_type?: string;
  label?: string;
  value?: string;
  sort?: string;
}

interface DictAddProps {
  onSubmit: () => void;
}

const DictAdd = forwardRef(({ onSubmit }: DictAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [types, setTypes] = useState<SystemDictTypeResponse[]>([]);
  const [fullWidth] = useState(true);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [formValues, setFormValues] = useState<FormValues>({
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
    show() {
      listType();
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const listType = async () => {
    const types = await listDictType();
    setTypes(types);
    if (types.length > 0) {
      setFormValues(prev => ({
        ...prev,
        dict_type: types[0].type
      }));
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formValues.dict_type.trim()) {
      newErrors.dict_type = t('page.dict.error.dict.type');
    }

    if (!formValues.label.trim()) {
      newErrors.label = t('page.dict.error.label');
    }

    if (!formValues.value.trim()) {
      newErrors.value = t('page.dict.error.value');
    }

    if (!formValues.sort && formValues.sort != 0) {
      newErrors.sort = t('page.dict.error.sort');
    }

    console.log('errors', newErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    setOpen(false);
    reset();
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const reset = () => {
    setFormValues({
      dict_type: formValues.dict_type,
      label: '',
      value: '',
      sort: 0,
      color_type: '',
      css_class: '',
      remark: '',
    });
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await createDict(formValues as SystemDictDataRequest);
      handleClose();
      onSubmit();
    }
  };

  const handleSubmitAndContinue = async () => {
    if (validateForm()) {
      await createDict(formValues as SystemDictDataRequest);
      // reset();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('target', e.target);
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setFormValues(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setFormValues(prev => ({
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

  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>{t('global.operate.add')}{t('global.page.dict')}</DialogTitle>
      <DialogContent>
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
            <InputLabel required size="small" classes={{ root: 'CustomInputLabelRootSelect', shrink: 'CustomInputLabelShrinkSelect' }} id="dict-type-select-label">{t("page.dict.title.type")}</InputLabel>
            <Select
              required
              size="small"
              classes={{ select: 'CustomSelectSelect' }}
              labelId="dict-type-select-label"
              name="dict_type"
              value={formValues.dict_type}
              onChange={(e) => handleInputChange(e as any)}
              // value={type}
              // onChange={handleTypeChange}
              label={t("page.menu.title.type")}
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
              value={formValues.label}
              onChange={handleInputChange}
              error={!!errors.label}
              helperText={errors.label}
            />
            <TextField
              required
              size="small"
              label={t("page.dict.title.value")}
              name="value"
              value={formValues.value}
              onChange={handleInputChange}
              error={!!errors.value}
              helperText={errors.value}
            />
            <TextField
              required
              size="small"
              type="number"
              label={t("page.dict.title.sort")}
              name="sort"
              value={formValues.sort}
              onChange={handleInputChange}
              error={!!errors.sort}
              helperText={errors.sort}
            />
            <TextField
              size="small"
              label={t("page.dict.title.remark")}
              name="remark"
              value={formValues.remark}
              onChange={handleInputChange}
            />
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmitAndContinue}>{t('global.operate.confirm.continue')}</Button>
        <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
        <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
      </DialogActions>
    </Dialog>
  )
});

export default DictAdd;