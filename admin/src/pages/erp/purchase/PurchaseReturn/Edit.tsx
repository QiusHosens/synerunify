import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpPurchaseReturnRequest, ErpPurchaseReturnResponse, updateErpPurchaseReturn } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

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

interface ErpPurchaseReturnEditProps {
  onSubmit: () => void;
}

const ErpPurchaseReturnEdit = forwardRef(({ onSubmit }: ErpPurchaseReturnEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [erpPurchaseReturn, setErpPurchaseReturn] = useState<ErpPurchaseReturnRequest>({
    id: 0,
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
    show(erpPurchaseReturn: ErpPurchaseReturnResponse) {
      initForm(erpPurchaseReturn);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!erpPurchaseReturn.order_number && erpPurchaseReturn.order_number != 0) {
      newErrors.order_number = t('page.erp.purchase.return.error.order_number');
    }
    
    if (!erpPurchaseReturn.purchase_order_id && erpPurchaseReturn.purchase_order_id != 0) {
      newErrors.purchase_order_id = t('page.erp.purchase.return.error.purchase_order_id');
    }
    
    if (!erpPurchaseReturn.supplier_id && erpPurchaseReturn.supplier_id != 0) {
      newErrors.supplier_id = t('page.erp.purchase.return.error.supplier_id');
    }
    
    if (!erpPurchaseReturn.return_date.trim()) {
      newErrors.return_date = t('page.erp.purchase.return.error.return_date');
    }
    
    if (!erpPurchaseReturn.total_amount && erpPurchaseReturn.total_amount != 0) {
      newErrors.total_amount = t('page.erp.purchase.return.error.total_amount');
    }
    
    if (!erpPurchaseReturn.order_status && erpPurchaseReturn.order_status != 0) {
      newErrors.order_status = t('page.erp.purchase.return.error.order_status');
    }
    
    if (!erpPurchaseReturn.department_code.trim()) {
      newErrors.department_code = t('page.erp.purchase.return.error.department_code');
    }
    
    if (!erpPurchaseReturn.department_id && erpPurchaseReturn.department_id != 0) {
      newErrors.department_id = t('page.erp.purchase.return.error.department_id');
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

  const initForm = (erpPurchaseReturn: ErpPurchaseReturnResponse) => {
    setErpPurchaseReturn({
      ...erpPurchaseReturn,
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateErpPurchaseReturn(erpPurchaseReturn);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setErpPurchaseReturn(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setErpPurchaseReturn(prev => ({
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

    setErpPurchaseReturn(prev => ({
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
      title={t('global.operate.edit') + t('global.page.erp.purchase.return')}
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
            type="number"
            label={t("page.erp.purchase.return.title.order_number")}
            name='order_number'
            value={ erpPurchaseReturn.order_number}
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
            value={ erpPurchaseReturn.purchase_order_id}
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
            value={ erpPurchaseReturn.supplier_id}
            onChange={handleInputChange}
            error={!!errors.supplier_id}
            helperText={errors.supplier_id}
          />
          <TextField
            required
            size="small"
            label={t("page.erp.purchase.return.title.return_date")}
            name='return_date'
            value={ erpPurchaseReturn.return_date}
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
            value={ erpPurchaseReturn.total_amount}
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
            value={ erpPurchaseReturn.order_status}
            onChange={handleInputChange}
            error={!!errors.order_status}
            helperText={errors.order_status}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.purchase.return.title.discount_rate")}
            name='discount_rate'
            value={ erpPurchaseReturn.discount_rate}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.purchase.return.title.settlement_account_id")}
            name='settlement_account_id'
            value={ erpPurchaseReturn.settlement_account_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.purchase.return.title.deposit")}
            name='deposit'
            value={ erpPurchaseReturn.deposit}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.erp.purchase.return.title.remarks")}
            name='remarks'
            value={ erpPurchaseReturn.remarks}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.erp.purchase.return.title.department_code")}
            name='department_code'
            value={ erpPurchaseReturn.department_code}
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
            value={ erpPurchaseReturn.department_id}
            onChange={handleInputChange}
            error={!!errors.department_id}
            helperText={errors.department_id}
          />
          </FormControl>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpPurchaseReturnEdit;