import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpInventoryTransferRequest, ErpInventoryTransferResponse, updateErpInventoryTransfer } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors { 
  from_warehouse_id?: string; // 调出仓库ID
  to_warehouse_id?: string; // 调入仓库ID
  product_id?: string; // 产品ID
  quantity?: string; // 调拨数量
  transfer_date?: string; // 调拨日期
  department_code?: string; // 部门编码
  department_id?: string; // 部门ID
}

interface ErpInventoryTransferEditProps {
  onSubmit: () => void;
}

const ErpInventoryTransferEdit = forwardRef(({ onSubmit }: ErpInventoryTransferEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [erpInventoryTransfer, setErpInventoryTransfer] = useState<ErpInventoryTransferRequest>({
    id: 0,
    from_warehouse_id: 0,
    to_warehouse_id: 0,
    product_id: 0,
    quantity: 0,
    transfer_date: '',
    remarks: '',
    department_code: '',
    department_id: 0,
    });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(erpInventoryTransfer: ErpInventoryTransferResponse) {
      initForm(erpInventoryTransfer);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!erpInventoryTransfer.from_warehouse_id && erpInventoryTransfer.from_warehouse_id != 0) {
      newErrors.from_warehouse_id = t('page.mark_translation.error.from_warehouse_id');
    }
    
    if (!erpInventoryTransfer.to_warehouse_id && erpInventoryTransfer.to_warehouse_id != 0) {
      newErrors.to_warehouse_id = t('page.mark_translation.error.to_warehouse_id');
    }
    
    if (!erpInventoryTransfer.product_id && erpInventoryTransfer.product_id != 0) {
      newErrors.product_id = t('page.mark_translation.error.product_id');
    }
    
    if (!erpInventoryTransfer.quantity && erpInventoryTransfer.quantity != 0) {
      newErrors.quantity = t('page.mark_translation.error.quantity');
    }
    
    if (!erpInventoryTransfer.transfer_date.trim()) {
      newErrors.transfer_date = t('page.mark_translation.error.transfer_date');
    }
    
    if (!erpInventoryTransfer.department_code.trim()) {
      newErrors.department_code = t('page.mark_translation.error.department_code');
    }
    
    if (!erpInventoryTransfer.department_id && erpInventoryTransfer.department_id != 0) {
      newErrors.department_id = t('page.mark_translation.error.department_id');
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

  const initForm = (erpInventoryTransfer: ErpInventoryTransferResponse) => {
    setErpInventoryTransfer({
      ...erpInventoryTransfer,
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateErpInventoryTransfer(erpInventoryTransfer);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setErpInventoryTransfer(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setErpInventoryTransfer(prev => ({
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

    setErpInventoryTransfer(prev => ({
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
      title={t('global.operate.edit') + t('global.page.mark_translation')}
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
            label={t("page.mark_translation.title.from_warehouse_id")}
            name='from_warehouse_id'
            value={ erpInventoryTransfer.from_warehouse_id}
            onChange={handleInputChange}
            error={!!errors.from_warehouse_id}
            helperText={errors.from_warehouse_id}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mark_translation.title.to_warehouse_id")}
            name='to_warehouse_id'
            value={ erpInventoryTransfer.to_warehouse_id}
            onChange={handleInputChange}
            error={!!errors.to_warehouse_id}
            helperText={errors.to_warehouse_id}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mark_translation.title.product_id")}
            name='product_id'
            value={ erpInventoryTransfer.product_id}
            onChange={handleInputChange}
            error={!!errors.product_id}
            helperText={errors.product_id}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mark_translation.title.quantity")}
            name='quantity'
            value={ erpInventoryTransfer.quantity}
            onChange={handleInputChange}
            error={!!errors.quantity}
            helperText={errors.quantity}
          />
          <TextField
            required
            size="small"
            label={t("page.mark_translation.title.transfer_date")}
            name='transfer_date'
            value={ erpInventoryTransfer.transfer_date}
            onChange={handleInputChange}
            error={!!errors.transfer_date}
            helperText={errors.transfer_date}
          />
          <TextField
            size="small"
            label={t("page.mark_translation.title.remarks")}
            name='remarks'
            value={ erpInventoryTransfer.remarks}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.mark_translation.title.department_code")}
            name='department_code'
            value={ erpInventoryTransfer.department_code}
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
            value={ erpInventoryTransfer.department_id}
            onChange={handleInputChange}
            error={!!errors.department_id}
            helperText={errors.department_id}
          />
          </FormControl>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpInventoryTransferEdit;