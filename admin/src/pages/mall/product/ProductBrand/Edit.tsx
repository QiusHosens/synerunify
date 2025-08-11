import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { MallProductBrandRequest, MallProductBrandResponse, updateMallProductBrand } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors {
  name?: string; // 品牌名称
  file_id?: string; // 品牌图片
  status?: string; // 状态
}

interface MallProductBrandEditProps {
  onSubmit: () => void;
}

const MallProductBrandEdit = forwardRef(({ onSubmit }: MallProductBrandEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [mallProductBrand, setMallProductBrand] = useState<MallProductBrandRequest>({
    id: 0,
    name: '',
    file_id: '',
    sort: 0,
    description: '',
    status: 0,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(mallProductBrand: MallProductBrandResponse) {
      initForm(mallProductBrand);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!mallProductBrand.name.trim()) {
      newErrors.name = t('common.error.name');
    }

    if (!mallProductBrand.file_id.trim()) {
      newErrors.file_id = t('page.mall.product.brand.error.pic.url');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const initForm = (mallProductBrand: MallProductBrandResponse) => {
    setMallProductBrand({
      ...mallProductBrand,
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateMallProductBrand(mallProductBrand);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setMallProductBrand(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setMallProductBrand(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const { name } = e.target;

    setMallProductBrand(prev => ({
      ...prev,
      [name]: checked ? 0 : 1
    }));

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
      title={t('global.operate.edit') + t('global.page.mall.product.brand')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.update')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
      <Box
        noValidate
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          m: 'auto',
          width: 'fit-content',
        }}
      >
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '200px' } }}>
          <TextField
            required
            size="small"
            label={t("common.title.name")}
            name='name'
            value={mallProductBrand.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            required
            size="small"
            label={t("page.mall.product.brand.title.pic.url")}
            name='file_id'
            value={mallProductBrand.file_id}
            onChange={handleInputChange}
            error={!!errors.file_id}
            helperText={errors.file_id}
          />
          <TextField
            size="small"
            type="number"
            label={t("common.title.sort")}
            name='sort'
            value={mallProductBrand.sort}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("common.title.description")}
            name='description'
            value={mallProductBrand.description}
            onChange={handleInputChange}
          />
        </FormControl>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 4 }}>{t("global.title.status")}</Typography>
          <Switch sx={{ mr: 2 }} name='status' checked={!mallProductBrand.status} onChange={handleStatusChange} />
          <Typography>{mallProductBrand.status == 0 ? t('global.switch.status.true') : t('global.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default MallProductBrandEdit;