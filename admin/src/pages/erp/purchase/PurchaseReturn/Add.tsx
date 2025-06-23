import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createErpPurchaseReturn, ErpPurchaseReturnRequest } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormValues {
  order_number: number; // 订单编号
  purchase_order_id: number; // 采购订单ID
  supplier_id: number; // 供应商ID
  return_date: string; // 退货日期
  total_amount: number; // 总金额
  order_status: number; // 订单状态
  discount_rate: number; // 优惠率（百分比，1000表示10.00%）
  settlement_account_id: number; // 结算账户ID
  deposit: number; // 定金
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  }

interface FormErrors { 
  order_number?: string; // 订单编号
  purchase_order_id?: string; // 采购订单ID
  supplier_id?: string; // 供应商ID
  return_date?: string; // 退货日期
  total_amount?: string; // 总金额
  order_status?: string; // 订单状态
  department_code?: string; // 部门编码
  department_id?: string; // 部门ID
}

interface ErpPurchaseReturnAddProps {
  onSubmit: () => void;
}

const ErpPurchaseReturnAdd = forwardRef(({ onSubmit }: ErpPurchaseReturnAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [formValues, setFormValues] = useState<FormValues>({
    order_number: 0,
    purchase_order_id: 0,
    supplier_id: 0,
    return_date: '',
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
    
    if (!formValues.order_number && formValues.order_number != 0) {
      newErrors.order_number = t('page.erp.purchase.return.error.order_number');
    }
    
    if (!formValues.purchase_order_id && formValues.purchase_order_id != 0) {
      newErrors.purchase_order_id = t('page.erp.purchase.return.error.purchase_order_id');
    }
    
    if (!formValues.supplier_id && formValues.supplier_id != 0) {
      newErrors.supplier_id = t('page.erp.purchase.return.error.supplier_id');
    }
    
    if (!formValues.return_date.trim()) {
      newErrors.return_date = t('page.erp.purchase.return.error.return_date');
    }
    
    if (!formValues.total_amount && formValues.total_amount != 0) {
      newErrors.total_amount = t('page.erp.purchase.return.error.total_amount');
    }
    
    if (!formValues.order_status && formValues.order_status != 0) {
      newErrors.order_status = t('page.erp.purchase.return.error.order_status');
    }
    
    if (!formValues.department_code.trim()) {
      newErrors.department_code = t('page.erp.purchase.return.error.department_code');
    }
    
    if (!formValues.department_id && formValues.department_id != 0) {
      newErrors.department_id = t('page.erp.purchase.return.error.department_id');
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
      order_number: 0,
      purchase_order_id: 0,
      supplier_id: 0,
      return_date: '',
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
      await createErpPurchaseReturn(formValues as ErpPurchaseReturnRequest);
      handleClose();
      onSubmit();
    }
  };

  const handleSubmitAndContinue = async () => {
    if (validateForm()) {
      await createErpPurchaseReturn(formValues as ErpPurchaseReturnRequest);
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
      title={t('global.operate.add') + t('global.page.erp.purchase.return')}
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
            type="number"
            label={t("page.erp.purchase.return.title.order_number")}
            name='order_number'
            value={formValues.order_number}
            onChange={handleInputChange}
            error={!!errors.order_number}
            helperText={errors.order_number}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.erp.purchase.return.title.purchase_order_id")}
            name='purchase_order_id'
            value={formValues.purchase_order_id}
            onChange={handleInputChange}
            error={!!errors.purchase_order_id}
            helperText={errors.purchase_order_id}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.erp.purchase.return.title.supplier_id")}
            name='supplier_id'
            value={formValues.supplier_id}
            onChange={handleInputChange}
            error={!!errors.supplier_id}
            helperText={errors.supplier_id}
          />
          <TextField
            required
            size="small"
            label={t("page.erp.purchase.return.title.return_date")}
            name='return_date'
            value={formValues.return_date}
            onChange={handleInputChange}
            error={!!errors.return_date}
            helperText={errors.return_date}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.erp.purchase.return.title.total_amount")}
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
            label={t("page.erp.purchase.return.title.order_status")}
            name='order_status'
            value={formValues.order_status}
            onChange={handleInputChange}
            error={!!errors.order_status}
            helperText={errors.order_status}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.purchase.return.title.discount_rate")}
            name='discount_rate'
            value={formValues.discount_rate}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.purchase.return.title.settlement_account_id")}
            name='settlement_account_id'
            value={formValues.settlement_account_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.purchase.return.title.deposit")}
            name='deposit'
            value={formValues.deposit}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.erp.purchase.return.title.remarks")}
            name='remarks'
            value={formValues.remarks}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.erp.purchase.return.title.department_code")}
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
            label={t("page.erp.purchase.return.title.department_id")}
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

export default ErpPurchaseReturnAdd;