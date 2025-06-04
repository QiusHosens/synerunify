import { Box, Button, FormControl, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { getDictType, SystemDictTypeRequest, updateDictType } from '@/api/dict';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors {
  name?: string;
  type?: string;
}

interface DictTypeEditProps {
  onSubmit: () => void;
}

const DictTypeEdit = forwardRef(({ onSubmit }: DictTypeEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [dictType, setDictType] = useState<SystemDictTypeRequest>({
    id: 0,
    name: '',
    type: '',
    remark: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(id: number) {
      initForm(id);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!dictType.name.trim()) {
      newErrors.name = t('page.dict.error.name');
    }

    if (!dictType.type.trim()) {
      newErrors.type = t('page.dict.error.type');
    }

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

  const initForm = (id: number) => {
    getDictType(id).then((data) => {
      setDictType({
        id: data.id,
        name: data.name,
        type: data.type,
        remark: data.remark as string,
      });
      setErrors({});
    })
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateDictType(dictType as SystemDictTypeRequest);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('target', e.target);
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setDictType(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setDictType(prev => ({
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
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.edit') + t('global.page.dict.type')}
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
        <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '200px' } }}>
          <TextField
            required
            size="small"
            label={t("page.dict.title.name")}
            name="name"
            value={dictType.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            required
            size="small"
            label={t("page.dict.title.type")}
            name="type"
            value={dictType.type}
            onChange={handleInputChange}
            error={!!errors.type}
            helperText={errors.type}
          />
          <TextField
            size="small"
            label={t("page.dict.title.remark")}
            name="remark"
            value={dictType.remark}
            onChange={handleInputChange}
          />
        </FormControl>
      </Box>
    </CustomizedDialog>
  )
});

export default DictTypeEdit;