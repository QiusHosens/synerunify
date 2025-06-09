import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createErpPayment, ErpPaymentRequest } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormValues {
  purchase_order_id: number; // 采购订单ID
  supplier_id: number; // 供应商ID
  user_id: number; // 关联用户ID
  settlement_account_id: number; // 结算账户ID
  amount: number; // 付款金额
  discount_amount: number; // 优惠金额
  payment_date: string; // 付款日期
  payment_method: string; // 付款方式 (如 bank_transfer, cash, credit)
  description: string; // 描述
  payment_status: number; // 状态 (0=pending, 1=completed, 2=cancelled)
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  }

interface FormErrors { 
  amount?: string; // 付款金额
  payment_date?: string; // 付款日期
  payment_status?: string; // 状态 (0=pending, 1=completed, 2=cancelled)
  department_code?: string; // 部门编码
  department_id?: string; // 部门ID
}

interface ErpPaymentAddProps {
  onSubmit: () => void;
}

const ErpPaymentAdd = forwardRef(({ onSubmit }: ErpPaymentAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [formValues, setFormValues] = useState<FormValues>({
    purchase_order_id: 0,
    supplier_id: 0,
    user_id: 0,
    settlement_account_id: 0,
    amount: 0,
    discount_amount: 0,
    payment_date: '',
    payment_method: '',
    description: '',
    payment_status: 0,
    remarks: '',
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
    
    if (!formValues.amount && formValues.amount != 0) {
      newErrors.amount = t('page.post.error.amount');
    }
    
    if (!formValues.payment_date.trim()) {
      newErrors.payment_date = t('page.post.error.payment_date');
    }
    
    if (!formValues.payment_status && formValues.payment_status != 0) {
      newErrors.payment_status = t('page.post.error.payment_status');
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
      purchase_order_id: 0,
      supplier_id: 0,
      user_id: 0,
      settlement_account_id: 0,
      amount: 0,
      discount_amount: 0,
      payment_date: '',
      payment_method: '',
      description: '',
      payment_status: 0,
      remarks: '',
      department_code: '',
      department_id: 0,
      });
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await createErpPayment(formValues as ErpPaymentRequest);
      handleClose();
      onSubmit();
    }
  };

  const handleSubmitAndContinue = async () => {
    if (validateForm()) {
      await createErpPayment(formValues as ErpPaymentRequest);
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
            size="small"
            type="number"
            label={t("page.post.title.purchase_order_id")}
            name='purchase_order_id'
            value={formValues.purchase_order_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.supplier_id")}
            name='supplier_id'
            value={formValues.supplier_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.user_id")}
            name='user_id'
            value={formValues.user_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.settlement_account_id")}
            name='settlement_account_id'
            value={formValues.settlement_account_id}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.post.title.amount")}
            name='amount'
            value={formValues.amount}
            onChange={handleInputChange}
            error={!!errors.amount}
            helperText={errors.amount}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.discount_amount")}
            name='discount_amount'
            value={formValues.discount_amount}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.post.title.payment_date")}
            name='payment_date'
            value={formValues.payment_date}
            onChange={handleInputChange}
            error={!!errors.payment_date}
            helperText={errors.payment_date}
          />
          <TextField
            size="small"
            label={t("page.post.title.payment_method")}
            name='payment_method'
            value={formValues.payment_method}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.post.title.description")}
            name='description'
            value={formValues.description}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.post.title.payment_status")}
            name='payment_status'
            value={formValues.payment_status}
            onChange={handleInputChange}
            error={!!errors.payment_status}
            helperText={errors.payment_status}
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
      </Box>
    </CustomizedDialog>
  )
});

export default ErpPaymentAdd;