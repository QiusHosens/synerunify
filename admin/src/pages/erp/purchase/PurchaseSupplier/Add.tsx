import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createErpSupplier, ErpSupplierRequest } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormValues {
  supplier_name: string; // 供应商名称
  contact_person: string; // 联系人
  phone: string; // 电话
  email: string; // 邮箱
  address: string; // 地址
  status: number; // 状态
  tax_id: string; // 纳税人识别号
  tax_rate: number; // 税率,精确到万分位
  bank_name: string; // 开户行
  bank_account: string; // 银行账号
  bank_address: string; // 开户地址
  remarks: string; // 备注
  sort_order: number; // 排序
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  }

interface FormErrors { 
  supplier_name?: string; // 供应商名称
  status?: string; // 状态
  sort_order?: string; // 排序
  department_code?: string; // 部门编码
  department_id?: string; // 部门ID
}

interface ErpSupplierAddProps {
  onSubmit: () => void;
}

const ErpSupplierAdd = forwardRef(({ onSubmit }: ErpSupplierAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [formValues, setFormValues] = useState<FormValues>({
    supplier_name: '',
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
    sort_order: 0,
    department_code: '',
    department_id: 0,
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
    
    if (!formValues.supplier_name.trim()) {
      newErrors.supplier_name = t('page.post.error.supplier_name');
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
    reset();
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const reset = () => {
    setFormValues({
      supplier_name: '',
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
      sort_order: 0,
      department_code: '',
      department_id: 0,
      });
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await createErpSupplier(formValues as ErpSupplierRequest);
      handleClose();
      onSubmit();
    }
  };

  const handleSubmitAndContinue = async () => {
    if (validateForm()) {
      await createErpSupplier(formValues as ErpSupplierRequest);
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
      title={t('global.operate.add') + t('global.page.post')}
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
        sx={ {display: 'flex',
          flexDirection: 'column',
          m: 'auto',
          width: 'fit-content',} }
      >
        <FormControl sx={ {minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '200px' }} }>
          <TextField
            required
            size="small"
            label={t("page.post.title.supplier_name")}
            name='supplier_name'
            value={formValues.supplier_name}
            onChange={handleInputChange}
            error={!!errors.supplier_name}
            helperText={errors.supplier_name}
          />
          <TextField
            size="small"
            label={t("page.post.title.contact_person")}
            name='contact_person'
            value={formValues.contact_person}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.post.title.phone")}
            name='phone'
            value={formValues.phone}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.post.title.email")}
            name='email'
            value={formValues.email}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.post.title.address")}
            name='address'
            value={formValues.address}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.status")}
            name='status'
            value={formValues.status}
            onChange={handleInputChange}
            error={!!errors.status}
            helperText={errors.status}
          />
          <TextField
            size="small"
            label={t("page.post.title.tax_id")}
            name='tax_id'
            value={formValues.tax_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.tax_rate")}
            name='tax_rate'
            value={formValues.tax_rate}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.post.title.bank_name")}
            name='bank_name'
            value={formValues.bank_name}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.post.title.bank_account")}
            name='bank_account'
            value={formValues.bank_account}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.post.title.bank_address")}
            name='bank_address'
            value={formValues.bank_address}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.post.title.remarks")}
            name='remarks'
            value={formValues.remarks}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.post.title.sort_order")}
            name='sort_order'
            value={formValues.sort_order}
            onChange={handleInputChange}
            error={!!errors.sort_order}
            helperText={errors.sort_order}
          />
          <TextField
            required
            size="small"
            label={t("page.post.title.department_code")}
            name='department_code'
            value={formValues.department_code}
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
            value={formValues.department_id}
            onChange={handleInputChange}
            error={!!errors.department_id}
            helperText={errors.department_id}
          />
          </FormControl>
        <Box sx={ {mt: 2, display: 'flex', alignItems: 'center'} }>
          <Typography sx={ {mr: 4} }>{t("page.post.title.status")}</Typography>
          <Switch sx={ {mr: 2} } name='status' checked={!formValues.status} onChange={handleStatusChange} />
          <Typography>{formValues.status == 0 ? t('page.post.switch.status.true') : t('page.post.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpSupplierAdd;