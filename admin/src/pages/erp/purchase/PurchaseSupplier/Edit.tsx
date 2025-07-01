import { Box, Button, FormControl, Grid, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpSupplierRequest, ErpSupplierResponse, updateErpSupplier } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors {
  name?: string; // 供应商名称
  status?: string; // 状态
  sort?: string; // 排序
}

interface ErpSupplierEditProps {
  onSubmit: () => void;
}

const ErpSupplierEdit = forwardRef(({ onSubmit }: ErpSupplierEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [erpSupplier, setErpSupplier] = useState<ErpSupplierRequest>({
    id: 0,
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    status: 0,
    tax_id: '',
    tax_rate: 0,
    bank_name: '',
    bank_account: '',
    bank_address: '',
    remarks: '',
    sort: 0,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(erpSupplier: ErpSupplierResponse) {
      initForm(erpSupplier);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!erpSupplier.name.trim()) {
      newErrors.name = t('global.error.input.please') + t('common.title.name');
    }

    if (!erpSupplier.sort && erpSupplier.sort != 0) {
      newErrors.sort = t('global.error.input.please') + t('common.title.sort');
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

  const initForm = (erpSupplier: ErpSupplierResponse) => {
    setErpSupplier({
      ...erpSupplier,
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateErpSupplier(erpSupplier);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setErpSupplier(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setErpSupplier(prev => ({
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

    setErpSupplier(prev => ({
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
      title={t('global.operate.edit') + t('global.page.erp.purchase.supplier')}
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
          <Grid container spacing={2} sx={{ '& .MuiGrid-root': { display: 'flex', justifyContent: "center", alignItems: "center", } }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                required
                size="small"
                label={t("common.title.name")}
                name='name'
                value={erpSupplier.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label={t("common.title.contact.person")}
                name='contact_person'
                value={erpSupplier.contact_person}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label={t("common.title.phone")}
                name='phone'
                value={erpSupplier.phone}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label={t("common.title.email")}
                name='email'
                value={erpSupplier.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label={t("common.title.address")}
                name='address'
                value={erpSupplier.address}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label={t("page.erp.purchase.supplier.title.tax.id")}
                name='tax_id'
                value={erpSupplier.tax_id}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                type="number"
                label={t("page.erp.purchase.supplier.title.tax.rate")}
                name='tax_rate'
                value={erpSupplier.tax_rate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label={t("page.erp.financial.account.title.bank.name")}
                name='bank_name'
                value={erpSupplier.bank_name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label={t("page.erp.financial.account.title.bank.account")}
                name='bank_account'
                value={erpSupplier.bank_account}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label={t("page.erp.purchase.supplier.title.bank.address")}
                name='bank_address'
                value={erpSupplier.bank_address}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label={t("common.title.remark")}
                name='remarks'
                value={erpSupplier.remarks}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                required
                size="small"
                type="number"
                label={t("common.title.sort")}
                name='sort'
                value={erpSupplier.sort}
                onChange={handleInputChange}
                error={!!errors.sort}
                helperText={errors.sort}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 4 }}>{t("common.title.status")}</Typography>
                <Switch sx={{ mr: 2 }} name='status' checked={!erpSupplier.status} onChange={handleStatusChange} />
                <Typography>{erpSupplier.status == 0 ? t('common.switch.status.true') : t('common.switch.status.false')}</Typography>
              </Box>
            </Grid>
          </Grid>
        </FormControl>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpSupplierEdit;