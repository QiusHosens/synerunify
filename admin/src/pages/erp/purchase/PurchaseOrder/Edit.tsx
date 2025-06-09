import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpPurchaseOrderRequest, ErpPurchaseOrderResponse, updateErpPurchaseOrder } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors { 
  order_number?: string; // 订单编号
  purchase_date?: string; // 采购日期
  total_amount?: string; // 总金额
  order_status?: string; // 订单状态 (0=pending, 1=completed, 2=cancelled)
  department_code?: string; // 部门编码
  department_id?: string; // 部门ID
}

interface ErpPurchaseOrderEditProps {
  onSubmit: () => void;
}

const ErpPurchaseOrderEdit = forwardRef(({ onSubmit }: ErpPurchaseOrderEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [erpPurchaseOrder, setErpPurchaseOrder] = useState<ErpPurchaseOrderRequest>({
    id: 0,
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
    show(erpPurchaseOrder: ErpPurchaseOrderResponse) {
      initForm(erpPurchaseOrder);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formValues.order_number.trim()) {
      newErrors.order_number = t('page.post.error.order_number');
    }
    
    if (!formValues.purchase_date.trim()) {
      newErrors.purchase_date = t('page.post.error.purchase_date');
    }
    
    if (!formValues.total_amount && formValues.total_amount != 0) {
      newErrors.total_amount = t('page.post.error.total_amount');
    }
    
    if (!formValues.order_status && formValues.order_status != 0) {
      newErrors.order_status = t('page.post.error.order_status');
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

  const initForm = (erpPurchaseOrder: ErpPurchaseOrderResponse) => {
    setErpPurchaseOrder({
      ...erpPurchaseOrder,
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateErpPurchaseOrder(erpPurchaseOrder);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setErpPurchaseOrder(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setErpPurchaseOrder(prev => ({
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

    setErpPurchaseOrder(prev => ({
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
            label={t("page.post.title.order_number")}
            name='order_number'
            value={ erpPurchaseOrder.order_number}
            onChange={handleInputChange}
            error={!!errors.order_number}
            helperText={errors.order_number}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.supplier_id")}
            name='supplier_id'
            value={ erpPurchaseOrder.supplier_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.user_id")}
            name='user_id'
            value={ erpPurchaseOrder.user_id}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.post.title.purchase_date")}
            name='purchase_date'
            value={ erpPurchaseOrder.purchase_date}
            onChange={handleInputChange}
            error={!!errors.purchase_date}
            helperText={errors.purchase_date}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.post.title.total_amount")}
            name='total_amount'
            value={ erpPurchaseOrder.total_amount}
            onChange={handleInputChange}
            error={!!errors.total_amount}
            helperText={errors.total_amount}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.post.title.order_status")}
            name='order_status'
            value={ erpPurchaseOrder.order_status}
            onChange={handleInputChange}
            error={!!errors.order_status}
            helperText={errors.order_status}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.discount_rate")}
            name='discount_rate'
            value={ erpPurchaseOrder.discount_rate}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.settlement_account_id")}
            name='settlement_account_id'
            value={ erpPurchaseOrder.settlement_account_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.deposit")}
            name='deposit'
            value={ erpPurchaseOrder.deposit}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.post.title.remarks")}
            name='remarks'
            value={ erpPurchaseOrder.remarks}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.post.title.department_code")}
            name='department_code'
            value={ erpPurchaseOrder.department_code}
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
            value={ erpPurchaseOrder.department_id}
            onChange={handleInputChange}
            error={!!errors.department_id}
            helperText={errors.department_id}
          />
          </FormControl>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpPurchaseOrderEdit;