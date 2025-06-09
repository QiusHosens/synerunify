import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createErpSalesReturn, ErpSalesReturnRequest } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormValues {
  sales_order_id: number; // 销售订单ID
  customer_id: number; // 客户ID
  warehouse_id: number; // 仓库ID
  return_date: string; // 退货日期
  total_amount: number; // 退货总金额
  return_status: number; // 状态 (0=pending, 1=completed, 2=cancelled)
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  }

interface FormErrors { 
  return_date?: string; // 退货日期
  total_amount?: string; // 退货总金额
  return_status?: string; // 状态 (0=pending, 1=completed, 2=cancelled)
  department_code?: string; // 部门编码
  department_id?: string; // 部门ID
}

interface ErpSalesReturnAddProps {
  onSubmit: () => void;
}

const ErpSalesReturnAdd = forwardRef(({ onSubmit }: ErpSalesReturnAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [formValues, setFormValues] = useState<FormValues>({
    sales_order_id: 0,
    customer_id: 0,
    warehouse_id: 0,
    return_date: '',
    total_amount: 0,
    return_status: 0,
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
    
    if (!formValues.return_date.trim()) {
      newErrors.return_date = t('page.post.error.return_date');
    }
    
    if (!formValues.total_amount && formValues.total_amount != 0) {
      newErrors.total_amount = t('page.post.error.total_amount');
    }
    
    if (!formValues.return_status && formValues.return_status != 0) {
      newErrors.return_status = t('page.post.error.return_status');
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
      sales_order_id: 0,
      customer_id: 0,
      warehouse_id: 0,
      return_date: '',
      total_amount: 0,
      return_status: 0,
      remarks: '',
      department_code: '',
      department_id: 0,
      });
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await createErpSalesReturn(formValues as ErpSalesReturnRequest);
      handleClose();
      onSubmit();
    }
  };

  const handleSubmitAndContinue = async () => {
    if (validateForm()) {
      await createErpSalesReturn(formValues as ErpSalesReturnRequest);
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
            label={t("page.post.title.sales_order_id")}
            name='sales_order_id'
            value={formValues.sales_order_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.customer_id")}
            name='customer_id'
            value={formValues.customer_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.warehouse_id")}
            name='warehouse_id'
            value={formValues.warehouse_id}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.post.title.return_date")}
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
            label={t("page.post.title.total_amount")}
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
            label={t("page.post.title.return_status")}
            name='return_status'
            value={formValues.return_status}
            onChange={handleInputChange}
            error={!!errors.return_status}
            helperText={errors.return_status}
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

export default ErpSalesReturnAdd;