import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createErpPurchaseOrder, ErpPurchaseOrderRequest } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormValues {
  order_number: string; // 订单编号
  supplier_id: number; // 供应商ID
  user_id: number; // 用户ID
  purchase_date: string; // 采购日期
  total_amount: number; // 总金额
  order_status: number; // 订单状态 (0=pending, 1=completed, 2=cancelled)
  discount_rate: number; // 优惠率（百分比，1000表示10.00%）
  settlement_account_id: number; // 结算账户ID
  deposit: number; // 定金
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  }

interface FormErrors { 
  order_number?: string; // 订单编号
  purchase_date?: string; // 采购日期
  total_amount?: string; // 总金额
  order_status?: string; // 订单状态 (0=pending, 1=completed, 2=cancelled)
  department_code?: string; // 部门编码
  department_id?: string; // 部门ID
}

interface ErpPurchaseOrderAddProps {
  onSubmit: () => void;
}

const ErpPurchaseOrderAdd = forwardRef(({ onSubmit }: ErpPurchaseOrderAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [formValues, setFormValues] = useState<FormValues>({
    order_number: '',
    supplier_id: 0,
    user_id: 0,
    purchase_date: '',
    total_amount: 0,
    order_status: 0,
    discount_rate: 0,
    settlement_account_id: 0,
    deposit: 0,
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
    
    if (!formValues.order_number.trim()) {
      newErrors.order_number = t('page.mark_translation.error.order_number');
    }
    
    if (!formValues.purchase_date.trim()) {
      newErrors.purchase_date = t('page.mark_translation.error.purchase_date');
    }
    
    if (!formValues.total_amount && formValues.total_amount != 0) {
      newErrors.total_amount = t('page.mark_translation.error.total_amount');
    }
    
    if (!formValues.order_status && formValues.order_status != 0) {
      newErrors.order_status = t('page.mark_translation.error.order_status');
    }
    
    if (!formValues.department_code.trim()) {
      newErrors.department_code = t('page.mark_translation.error.department_code');
    }
    
    if (!formValues.department_id && formValues.department_id != 0) {
      newErrors.department_id = t('page.mark_translation.error.department_id');
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
      order_number: '',
      supplier_id: 0,
      user_id: 0,
      purchase_date: '',
      total_amount: 0,
      order_status: 0,
      discount_rate: 0,
      settlement_account_id: 0,
      deposit: 0,
      remarks: '',
      department_code: '',
      department_id: 0,
      });
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await createErpPurchaseOrder(formValues as ErpPurchaseOrderRequest);
      handleClose();
      onSubmit();
    }
  };

  const handleSubmitAndContinue = async () => {
    if (validateForm()) {
      await createErpPurchaseOrder(formValues as ErpPurchaseOrderRequest);
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
      title={t('global.operate.add') + t('global.page.mark_translation')}
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
            label={t("page.mark_translation.title.order_number")}
            name='order_number'
            value={formValues.order_number}
            onChange={handleInputChange}
            error={!!errors.order_number}
            helperText={errors.order_number}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mark_translation.title.supplier_id")}
            name='supplier_id'
            value={formValues.supplier_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mark_translation.title.user_id")}
            name='user_id'
            value={formValues.user_id}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.mark_translation.title.purchase_date")}
            name='purchase_date'
            value={formValues.purchase_date}
            onChange={handleInputChange}
            error={!!errors.purchase_date}
            helperText={errors.purchase_date}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mark_translation.title.total_amount")}
            name='total_amount'
            value={formValues.total_amount}
            onChange={handleInputChange}
            error={!!errors.total_amount}
            helperText={errors.total_amount}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mark_translation.title.order_status")}
            name='order_status'
            value={formValues.order_status}
            onChange={handleInputChange}
            error={!!errors.order_status}
            helperText={errors.order_status}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mark_translation.title.discount_rate")}
            name='discount_rate'
            value={formValues.discount_rate}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mark_translation.title.settlement_account_id")}
            name='settlement_account_id'
            value={formValues.settlement_account_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mark_translation.title.deposit")}
            name='deposit'
            value={formValues.deposit}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.mark_translation.title.remarks")}
            name='remarks'
            value={formValues.remarks}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.mark_translation.title.department_code")}
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
            label={t("page.mark_translation.title.department_id")}
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

export default ErpPurchaseOrderAdd;