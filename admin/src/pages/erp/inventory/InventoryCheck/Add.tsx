import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createErpInventoryCheck, ErpInventoryCheckRequest } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormValues {
  warehouse_id: number; // 仓库ID
  product_id: number; // 产品ID
  checked_quantity: number; // 盘点数量
  check_date: string; // 盘点日期
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  }

interface FormErrors { 
  checked_quantity?: string; // 盘点数量
  check_date?: string; // 盘点日期
  department_code?: string; // 部门编码
  department_id?: string; // 部门ID
}

interface ErpInventoryCheckAddProps {
  onSubmit: () => void;
}

const ErpInventoryCheckAdd = forwardRef(({ onSubmit }: ErpInventoryCheckAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [formValues, setFormValues] = useState<FormValues>({
    warehouse_id: 0,
    product_id: 0,
    checked_quantity: 0,
    check_date: '',
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
    
    if (!formValues.checked_quantity && formValues.checked_quantity != 0) {
      newErrors.checked_quantity = t('page.post.error.checked_quantity');
    }
    
    if (!formValues.check_date.trim()) {
      newErrors.check_date = t('page.post.error.check_date');
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
      warehouse_id: 0,
      product_id: 0,
      checked_quantity: 0,
      check_date: '',
      remarks: '',
      department_code: '',
      department_id: 0,
      });
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await createErpInventoryCheck(formValues as ErpInventoryCheckRequest);
      handleClose();
      onSubmit();
    }
  };

  const handleSubmitAndContinue = async () => {
    if (validateForm()) {
      await createErpInventoryCheck(formValues as ErpInventoryCheckRequest);
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
            label={t("page.post.title.warehouse_id")}
            name='warehouse_id'
            value={formValues.warehouse_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.product_id")}
            name='product_id'
            value={formValues.product_id}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.post.title.checked_quantity")}
            name='checked_quantity'
            value={formValues.checked_quantity}
            onChange={handleInputChange}
            error={!!errors.checked_quantity}
            helperText={errors.checked_quantity}
          />
          <TextField
            required
            size="small"
            label={t("page.post.title.check_date")}
            name='check_date'
            value={formValues.check_date}
            onChange={handleInputChange}
            error={!!errors.check_date}
            helperText={errors.check_date}
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

export default ErpInventoryCheckAdd;