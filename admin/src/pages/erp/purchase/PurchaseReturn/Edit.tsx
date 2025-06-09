import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpPurchaseReturnRequest, ErpPurchaseReturnResponse, updateErpPurchaseReturn } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors { 
  return_date?: string; // 退货日期
  total_amount?: string; // 退货总金额
  return_status?: string; // 状态 (0=pending, 1=completed, 2=cancelled)
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
    purchase_order_id: 0,
    supplier_id: 0,
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
            label={t("page.post.title.purchase_order_id")}
            name='purchase_order_id'
            value={ erpPurchaseReturn.purchase_order_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.supplier_id")}
            name='supplier_id'
            value={ erpPurchaseReturn.supplier_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.warehouse_id")}
            name='warehouse_id'
            value={ erpPurchaseReturn.warehouse_id}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.post.title.return_date")}
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
            label={t("page.post.title.total_amount")}
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
            label={t("page.post.title.return_status")}
            name='return_status'
            value={ erpPurchaseReturn.return_status}
            onChange={handleInputChange}
            error={!!errors.return_status}
            helperText={errors.return_status}
          />
          <TextField
            size="small"
            label={t("page.post.title.remarks")}
            name='remarks'
            value={ erpPurchaseReturn.remarks}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.post.title.department_code")}
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
            label={t("page.post.title.department_id")}
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