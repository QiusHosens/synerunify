import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpCustomerRequest, ErpCustomerResponse, updateErpCustomer } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors { 
  customer_name?: string; // 客户名称
  status?: string; // 状态
  sort_order?: string; // 排序
  department_code?: string; // 部门编码
  department_id?: string; // 部门ID
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
    customer_name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    status: 0,
    sort_order: 0,
    tax_id: '',
    tax_rate: 0,
    bank_name: '',
    bank_account: '',
    bank_address: '',
    remarks: '',
    department_code: '',
    department_id: 0,
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
    
    if (!formValues.customer_name.trim()) {
      newErrors.customer_name = t('page.post.error.customer_name');
    }
    
    if (!formValues.status && formValues.status != 0) {
      newErrors.status = t('page.post.error.status');
    }
    
    if (!formValues.sort_order && formValues.sort_order != 0) {
      newErrors.sort_order = t('page.post.error.sort_order');
    }
    
    if (!formValues.department_code.trim()) {
      newErrors.department_code = t('page.post.error.department_code');
    }
    
    if (!formValues.department_id && formValues.department_id != 0) {
      newErrors.department_id = t('page.post.error.department_id');
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
      title={t('global.operate.edit') + t('global.page.post')}
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
        sx={ {display: 'flex',
          flexDirection: 'column',
          m: 'auto',
          width: 'fit-content',} }
      >
        <FormControl sx={ {minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '200px' }} }>
          <TextField
            required
            size="small"
            label={t("page.post.title.customer_name")}
            name='customer_name'
            value={ erpCustomer.customer_name}
            onChange={handleInputChange}
            error={!!errors.customer_name}
            helperText={errors.customer_name}
          />
          <TextField
            size="small"
            label={t("page.post.title.contact_person")}
            name='contact_person'
            value={ erpCustomer.contact_person}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.post.title.phone")}
            name='phone'
            value={ erpCustomer.phone}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.post.title.email")}
            name='email'
            value={ erpCustomer.email}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.post.title.address")}
            name='address'
            value={ erpCustomer.address}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.status")}
            name='status'
            value={ erpCustomer.status}
            onChange={handleInputChange}
            error={!!errors.status}
            helperText={errors.status}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.post.title.sort_order")}
            name='sort_order'
            value={ erpCustomer.sort_order}
            onChange={handleInputChange}
            error={!!errors.sort_order}
            helperText={errors.sort_order}
          />
          <TextField
            size="small"
            label={t("page.post.title.tax_id")}
            name='tax_id'
            value={ erpCustomer.tax_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.tax_rate")}
            name='tax_rate'
            value={ erpCustomer.tax_rate}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.post.title.bank_name")}
            name='bank_name'
            value={ erpCustomer.bank_name}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.post.title.bank_account")}
            name='bank_account'
            value={ erpCustomer.bank_account}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.post.title.bank_address")}
            name='bank_address'
            value={ erpCustomer.bank_address}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.post.title.remarks")}
            name='remarks'
            value={ erpCustomer.remarks}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.post.title.department_code")}
            name='department_code'
            value={ erpCustomer.department_code}
            onChange={handleInputChange}
            error={!!errors.department_code}
            helperText={errors.department_code}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.post.title.department_id")}
            name='department_id'
            value={ erpCustomer.department_id}
            onChange={handleInputChange}
            error={!!errors.department_id}
            helperText={errors.department_id}
          />
          </FormControl>
        <Box sx={ {mt: 2, display: 'flex', alignItems: 'center'} }>
          <Typography sx={ {mr: 4} }>{t("page.post.title.status")}</Typography>
          <Switch sx={ {mr: 2} } name='status' checked={!erpCustomer.status} onChange={handleStatusChange} />
          <Typography>{ erpCustomer.status == 0 ? t('page.post.switch.status.true') : t('page.post.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpCustomerEdit;