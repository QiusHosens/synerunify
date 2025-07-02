import { Box, Button, FormControl, Grid, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createErpCustomer, ErpCustomerRequest } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormValues {
  name: string; // 客户名称
  contact_person: string; // 联系人
  phone: string; // 电话
  email: string; // 邮箱
  address: string; // 地址
  status: number; // 状态
  sort: number; // 排序
  tax_id: string; // 纳税人识别号
  tax_rate: number; // 税率,精确到万分位
  bank_name: string; // 开户行
  bank_account: string; // 银行账号
  bank_address: string; // 开户地址
  remarks: string; // 备注
}

interface FormErrors {
  name?: string; // 客户名称
  status?: string; // 状态
  sort?: string; // 排序
}

interface ErpCustomerAddProps {
  onSubmit: () => void;
}

const ErpCustomerAdd = forwardRef(({ onSubmit }: ErpCustomerAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    status: 0,
    sort: 0,
    tax_id: '',
    tax_rate: 0,
    bank_name: '',
    bank_account: '',
    bank_address: '',
    remarks: '',
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
      newErrors.name = t('global.error.input.please') + t('common.title.name');
    }

    if (!formValues.sort && formValues.sort != 0) {
      newErrors.sort = t('global.error.input.please') + t('common.title.sort');
    }

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
      name: '',
      contact_person: '',
      phone: '',
      email: '',
      address: '',
      status: 0,
      sort: 0,
      tax_id: '',
      tax_rate: 0,
      bank_name: '',
      bank_account: '',
      bank_address: '',
      remarks: '',
    });
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await createErpCustomer(formValues as ErpCustomerRequest);
      handleClose();
      onSubmit();
    }
  };

  const handleSubmitAndContinue = async () => {
    if (validateForm()) {
      await createErpCustomer(formValues as ErpCustomerRequest);
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const { name } = e.target;

    setFormValues(prev => ({
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
      title={t('global.operate.add') + t('global.page.erp.sale.customer')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmitAndContinue}>{t('global.operate.confirm.continue')}</Button>
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
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
                label={t("page.erp.sale.customer.title.name")}
                name='name'
                value={formValues.name}
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
                value={formValues.contact_person}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label={t("common.title.phone")}
                name='phone'
                value={formValues.phone}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label={t("common.title.email")}
                name='email'
                value={formValues.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label={t("common.title.address")}
                name='address'
                value={formValues.address}
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
                value={formValues.sort}
                onChange={handleInputChange}
                error={!!errors.sort}
                helperText={errors.sort}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label={t("page.erp.sale.customer.title.tax.id")}
                name='tax_id'
                value={formValues.tax_id}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                type="number"
                label={t("page.erp.sale.customer.title.tax.rate")}
                name='tax_rate'
                value={formValues.tax_rate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label={t("page.erp.financial.account.title.bank.name")}
                name='bank_name'
                value={formValues.bank_name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label={t("page.erp.financial.account.title.bank.account")}
                name='bank_account'
                value={formValues.bank_account}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label={t("page.erp.sale.customer.title.bank.address")}
                name='bank_address'
                value={formValues.bank_address}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label={t("common.title.remark")}
                name='remarks'
                value={formValues.remarks}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 4 }}>{t("common.title.status")}</Typography>
                <Switch sx={{ mr: 2 }} name='status' checked={!formValues.status} onChange={handleStatusChange} />
                <Typography>{formValues.status == 0 ? t('common.switch.status.true') : t('common.switch.status.false')}</Typography>
              </Box>
            </Grid>
          </Grid>
        </FormControl>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpCustomerAdd;