import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpOutboundRecordRequest, ErpOutboundRecordResponse, updateErpOutboundRecord } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors { 
  quantity?: string; // 出库数量
  outbound_date?: string; // 出库日期
  department_code?: string; // 部门编码
  department_id?: string; // 部门ID
}

interface ErpOutboundRecordEditProps {
  onSubmit: () => void;
}

const ErpOutboundRecordEdit = forwardRef(({ onSubmit }: ErpOutboundRecordEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [erpOutboundRecord, setErpOutboundRecord] = useState<ErpOutboundRecordRequest>({
    id: 0,
    order_id: 0,
    warehouse_id: 0,
    product_id: 0,
    quantity: 0,
    outbound_date: '',
    remarks: '',
    department_code: '',
    department_id: 0,
    });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(erpOutboundRecord: ErpOutboundRecordResponse) {
      initForm(erpOutboundRecord);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formValues.quantity && formValues.quantity != 0) {
      newErrors.quantity = t('page.post.error.quantity');
    }
    
    if (!formValues.outbound_date.trim()) {
      newErrors.outbound_date = t('page.post.error.outbound_date');
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

  const initForm = (erpOutboundRecord: ErpOutboundRecordResponse) => {
    setErpOutboundRecord({
      ...erpOutboundRecord,
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateErpOutboundRecord(erpOutboundRecord);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setErpOutboundRecord(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setErpOutboundRecord(prev => ({
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

    setErpOutboundRecord(prev => ({
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
            label={t("page.post.title.order_id")}
            name='order_id'
            value={ erpOutboundRecord.order_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.warehouse_id")}
            name='warehouse_id'
            value={ erpOutboundRecord.warehouse_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.product_id")}
            name='product_id'
            value={ erpOutboundRecord.product_id}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.post.title.quantity")}
            name='quantity'
            value={ erpOutboundRecord.quantity}
            onChange={handleInputChange}
            error={!!errors.quantity}
            helperText={errors.quantity}
          />
          <TextField
            required
            size="small"
            label={t("page.post.title.outbound_date")}
            name='outbound_date'
            value={ erpOutboundRecord.outbound_date}
            onChange={handleInputChange}
            error={!!errors.outbound_date}
            helperText={errors.outbound_date}
          />
          <TextField
            size="small"
            label={t("page.post.title.remarks")}
            name='remarks'
            value={ erpOutboundRecord.remarks}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.post.title.department_code")}
            name='department_code'
            value={ erpOutboundRecord.department_code}
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
            value={ erpOutboundRecord.department_id}
            onChange={handleInputChange}
            error={!!errors.department_id}
            helperText={errors.department_id}
          />
          </FormControl>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpOutboundRecordEdit;