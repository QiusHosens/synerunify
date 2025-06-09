import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpReceiptRequest, ErpReceiptResponse, updateErpReceipt } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors { 
  amount?: string; // 收款金额
  receipt_date?: string; // 收款日期
  receipt_status?: string; // 状态 (0=pending, 1=completed, 2=cancelled)
  department_code?: string; // 部门编码
  department_id?: string; // 部门ID
}

interface ErpReceiptEditProps {
  onSubmit: () => void;
}

const ErpReceiptEdit = forwardRef(({ onSubmit }: ErpReceiptEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [erpReceipt, setErpReceipt] = useState<ErpReceiptRequest>({
    id: 0,
    sales_order_id: 0,
    customer_id: 0,
    user_id: 0,
    settlement_account_id: 0,
    amount: 0,
    discount_amount: 0,
    receipt_date: '',
    payment_method: '',
    description: '',
    receipt_status: 0,
    remarks: '',
    department_code: '',
    department_id: 0,
    });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(erpReceipt: ErpReceiptResponse) {
      initForm(erpReceipt);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formValues.amount && formValues.amount != 0) {
      newErrors.amount = t('page.post.error.amount');
    }
    
    if (!formValues.receipt_date.trim()) {
      newErrors.receipt_date = t('page.post.error.receipt_date');
    }
    
    if (!formValues.receipt_status && formValues.receipt_status != 0) {
      newErrors.receipt_status = t('page.post.error.receipt_status');
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

  const initForm = (erpReceipt: ErpReceiptResponse) => {
    setErpReceipt({
      ...erpReceipt,
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateErpReceipt(erpReceipt);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setErpReceipt(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setErpReceipt(prev => ({
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

    setErpReceipt(prev => ({
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
            size="small"
            type="number"
            label={t("page.post.title.sales_order_id")}
            name='sales_order_id'
            value={ erpReceipt.sales_order_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.customer_id")}
            name='customer_id'
            value={ erpReceipt.customer_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.user_id")}
            name='user_id'
            value={ erpReceipt.user_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.settlement_account_id")}
            name='settlement_account_id'
            value={ erpReceipt.settlement_account_id}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.post.title.amount")}
            name='amount'
            value={ erpReceipt.amount}
            onChange={handleInputChange}
            error={!!errors.amount}
            helperText={errors.amount}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.discount_amount")}
            name='discount_amount'
            value={ erpReceipt.discount_amount}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.post.title.receipt_date")}
            name='receipt_date'
            value={ erpReceipt.receipt_date}
            onChange={handleInputChange}
            error={!!errors.receipt_date}
            helperText={errors.receipt_date}
          />
          <TextField
            size="small"
            label={t("page.post.title.payment_method")}
            name='payment_method'
            value={ erpReceipt.payment_method}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.post.title.description")}
            name='description'
            value={ erpReceipt.description}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.post.title.receipt_status")}
            name='receipt_status'
            value={ erpReceipt.receipt_status}
            onChange={handleInputChange}
            error={!!errors.receipt_status}
            helperText={errors.receipt_status}
          />
          <TextField
            size="small"
            label={t("page.post.title.remarks")}
            name='remarks'
            value={ erpReceipt.remarks}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.post.title.department_code")}
            name='department_code'
            value={ erpReceipt.department_code}
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
            value={ erpReceipt.department_id}
            onChange={handleInputChange}
            error={!!errors.department_id}
            helperText={errors.department_id}
          />
          </FormControl>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpReceiptEdit;