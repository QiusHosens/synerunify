import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { SystemTenantPackageRequest, SystemTenantPackageResponse, updateSystemTenantPackage } from '@/api';

interface FormErrors {
  name?: string; // 套餐名
}

interface TenantPackageEditProps {
  onSubmit: () => void;
}

const TenantPackageEdit = forwardRef(({ onSubmit }: TenantPackageEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [fullWidth] = useState(true);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [tenantPackage, setTenantPackage] = useState<SystemTenantPackageRequest>({
    id: 0,
    name: '',
    status: 0,
    remark: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(tenantPackage: SystemTenantPackageResponse) {
      initForm(tenantPackage);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!tenantPackage.name.trim()) {
      newErrors.name = t('page.tenant.package.error.name');
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

  const initForm = (tenantPackage: SystemTenantPackageResponse) => {
    setTenantPackage({
      ...tenantPackage,
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateSystemTenantPackage(tenantPackage);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('target', e.target);
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setTenantPackage(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setTenantPackage(prev => ({
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

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    // console.log('target', e.target, checked);
    const { name } = e.target;

    setTenantPackage(prev => ({
      ...prev,
      [name]: checked ? 0 : 1
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
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>{t('global.operate.add')}{t('global.page.tenant.package')}</DialogTitle>
      <DialogContent>
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
              label={t("page.tenant.package.title.name")}
              name='name'
              value={tenantPackage.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              size="small"
              label={t("page.tenant.package.title.remark")}
              name="remark"
              value={tenantPackage.remark}
              onChange={handleInputChange}
            />
          </FormControl>
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ mr: 4 }}>{t("page.tenant.package.title.status")}</Typography>
            <Switch sx={{ mr: 2 }} name='status' checked={!tenantPackage.status} onChange={handleStatusChange} />
            <Typography>{tenantPackage.status == 0 ? t('page.tenant.package.switch.status.true') : t('page.tenant.package.switch.status.false')}</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>{t('global.operate.update')}</Button>
        <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
      </DialogActions>
    </Dialog >
  )
});

export default TenantPackageEdit;