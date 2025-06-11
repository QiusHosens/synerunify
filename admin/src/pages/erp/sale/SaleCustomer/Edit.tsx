import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpCustomerRequest, ErpCustomerResponse, updateErpCustomer } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors {
  name?: string; // 客户名称
  status?: string; // 状态
  sort?: string; // 排序
}

interface ErpCustomerEditProps {
  onSubmit: () => void;
}

const ErpCustomerEdit = forwardRef(({ onSubmit }: ErpCustomerEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [erpCustomer, setErpCustomer] = useState<ErpCustomerRequest>({
    id: 0,
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
    show(erpCustomer: ErpCustomerResponse) {
      initForm(erpCustomer);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!erpCustomer.name.trim()) {
      newErrors.name = t('page.erp.sale.customer.error.name');
    }

    if (!erpCustomer.sort && erpCustomer.sort != 0) {
      newErrors.sort = t('page.erp.sale.customer.error.sort');
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

  const initForm = (erpCustomer: ErpCustomerResponse) => {
    setErpCustomer({
      ...erpCustomer,
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateErpCustomer(erpCustomer);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setErpCustomer(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setErpCustomer(prev => ({
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

    setErpCustomer(prev => ({
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
      title={t('global.operate.edit') + t('global.page.erp.sale.customer')}
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
            label={t("page.erp.sale.customer.title.name")}
            name='name'
            value={erpCustomer.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            size="small"
            label={t("page.erp.sale.customer.title.contact.person")}
            name='contact_person'
            value={erpCustomer.contact_person}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.erp.sale.customer.title.phone")}
            name='phone'
            value={erpCustomer.phone}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.erp.sale.customer.title.email")}
            name='email'
            value={erpCustomer.email}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.erp.sale.customer.title.address")}
            name='address'
            value={erpCustomer.address}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.erp.sale.customer.title.sort")}
            name='sort'
            value={erpCustomer.sort}
            onChange={handleInputChange}
            error={!!errors.sort}
            helperText={errors.sort}
          />
          <TextField
            size="small"
            label={t("page.erp.sale.customer.title.tax.id")}
            name='tax_id'
            value={erpCustomer.tax_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.sale.customer.title.tax.rate")}
            name='tax_rate'
            value={erpCustomer.tax_rate}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.erp.sale.customer.title.bank.name")}
            name='bank_name'
            value={erpCustomer.bank_name}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.erp.sale.customer.title.bank.account")}
            name='bank_account'
            value={erpCustomer.bank_account}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.erp.sale.customer.title.bank.address")}
            name='bank_address'
            value={erpCustomer.bank_address}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.erp.sale.customer.title.remarks")}
            name='remarks'
            value={erpCustomer.remarks}
            onChange={handleInputChange}
          />
        </FormControl>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 4 }}>{t("global.title.status")}</Typography>
          <Switch sx={{ mr: 2 }} name='status' checked={!erpCustomer.status} onChange={handleStatusChange} />
          <Typography>{erpCustomer.status == 0 ? t('global.switch.status.true') : t('global.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpCustomerEdit;