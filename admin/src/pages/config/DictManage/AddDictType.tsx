import { Box, Button, FormControl, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createDictType, SystemDictTypeRequest } from '@/api/dict';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormValues {
  name: string;
  type: string;
  remark: string;
}

interface FormErrors {
  name?: string;
  type?: string;
}

interface DictTypeAddProps {
  onSubmit: () => void;
}

const DictTypeAdd = forwardRef(({ onSubmit }: DictTypeAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    type: '',
    remark: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show() {
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formValues.name.trim()) {
      newErrors.name = t('page.dict.error.name');
    }

    if (!formValues.type.trim()) {
      newErrors.type = t('page.dict.error.type');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    setOpen(false);
    setFormValues({ name: '', type: '', remark: '' });
    setErrors({});
  };

  const handleClose = () => {
    setOpen(false);
    setFormValues({ name: '', type: '', remark: '' });
    setErrors({});
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      await createDictType(formValues as SystemDictTypeRequest);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
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
      title={t('global.operate.add') + t('global.page.dict.type')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
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
            label={t("common.title.name")}
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            required
            size="small"
            label={t("common.title.type")}
            name="type"
            value={formValues.type}
            onChange={handleInputChange}
            error={!!errors.type}
            helperText={errors.type}
          />
          <TextField
            size="small"
            label={t("common.title.remark")}
            name="remark"
            value={formValues.remark}
            onChange={handleInputChange}
          />
        </FormControl>
      </Box>
    </CustomizedDialog>
  )
});

export default DictTypeAdd;