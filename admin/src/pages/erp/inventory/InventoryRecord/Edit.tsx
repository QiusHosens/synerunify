import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpInventoryRecordRequest, ErpInventoryRecordResponse, updateErpInventoryRecord } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors { 
  quantity?: string; // 数量
  record_type?: string; // 记录类型 (0=in, 1=out)
  record_date?: string; // 记录日期
  department_code?: string; // 部门编码
  department_id?: string; // 部门ID
}

interface ErpInventoryRecordEditProps {
  onSubmit: () => void;
}

const ErpInventoryRecordEdit = forwardRef(({ onSubmit }: ErpInventoryRecordEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [erpInventoryRecord, setErpInventoryRecord] = useState<ErpInventoryRecordRequest>({
    id: 0,
    product_id: 0,
    warehouse_id: 0,
    quantity: 0,
    record_type: 0,
    record_date: '',
    remarks: '',
    department_code: '',
    department_id: 0,
    });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(erpInventoryRecord: ErpInventoryRecordResponse) {
      initForm(erpInventoryRecord);
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
    
    if (!formValues.record_type && formValues.record_type != 0) {
      newErrors.record_type = t('page.post.error.record_type');
    }
    
    if (!formValues.record_date.trim()) {
      newErrors.record_date = t('page.post.error.record_date');
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

  const initForm = (erpInventoryRecord: ErpInventoryRecordResponse) => {
    setErpInventoryRecord({
      ...erpInventoryRecord,
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateErpInventoryRecord(erpInventoryRecord);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setErpInventoryRecord(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setErpInventoryRecord(prev => ({
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

    setErpInventoryRecord(prev => ({
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
            label={t("page.post.title.product_id")}
            name='product_id'
            value={ erpInventoryRecord.product_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.warehouse_id")}
            name='warehouse_id'
            value={ erpInventoryRecord.warehouse_id}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.post.title.quantity")}
            name='quantity'
            value={ erpInventoryRecord.quantity}
            onChange={handleInputChange}
            error={!!errors.quantity}
            helperText={errors.quantity}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.post.title.record_type")}
            name='record_type'
            value={ erpInventoryRecord.record_type}
            onChange={handleInputChange}
            error={!!errors.record_type}
            helperText={errors.record_type}
          />
          <TextField
            required
            size="small"
            label={t("page.post.title.record_date")}
            name='record_date'
            value={ erpInventoryRecord.record_date}
            onChange={handleInputChange}
            error={!!errors.record_date}
            helperText={errors.record_date}
          />
          <TextField
            size="small"
            label={t("page.post.title.remarks")}
            name='remarks'
            value={ erpInventoryRecord.remarks}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.post.title.department_code")}
            name='department_code'
            value={ erpInventoryRecord.department_code}
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
            value={ erpInventoryRecord.department_id}
            onChange={handleInputChange}
            error={!!errors.department_id}
            helperText={errors.department_id}
          />
          </FormControl>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpInventoryRecordEdit;