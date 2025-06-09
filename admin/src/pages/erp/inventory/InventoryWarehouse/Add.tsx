import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createErpWarehouse, ErpWarehouseRequest } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormValues {
  warehouse_name: string; // 仓库名称
  location: string; // 仓库位置
  status: number; // 状态
  sort_order: number; // 排序
  storage_fee: number; // 仓储费
  handling_fee: number; // 搬运费
  manager: string; // 负责人
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  }

interface FormErrors { 
  warehouse_name?: string; // 仓库名称
  status?: string; // 状态
  sort_order?: string; // 排序
  department_code?: string; // 部门编码
  department_id?: string; // 部门ID
}

interface ErpWarehouseAddProps {
  onSubmit: () => void;
}

const ErpWarehouseAdd = forwardRef(({ onSubmit }: ErpWarehouseAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [formValues, setFormValues] = useState<FormValues>({
    warehouse_name: '',
    location: '',
    status: 0,
    sort_order: 0,
    storage_fee: 0,
    handling_fee: 0,
    manager: '',
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
    
    if (!formValues.warehouse_name.trim()) {
      newErrors.warehouse_name = t('page.erp.inventory.warehouse.error.warehouse_name');
    }
    
    if (!formValues.status && formValues.status != 0) {
      newErrors.status = t('page.erp.inventory.warehouse.error.status');
    }
    
    if (!formValues.sort_order && formValues.sort_order != 0) {
      newErrors.sort_order = t('page.erp.inventory.warehouse.error.sort_order');
    }
    
    if (!formValues.department_code.trim()) {
      newErrors.department_code = t('page.erp.inventory.warehouse.error.department_code');
    }
    
    if (!formValues.department_id && formValues.department_id != 0) {
      newErrors.department_id = t('page.erp.inventory.warehouse.error.department_id');
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
      warehouse_name: '',
      location: '',
      status: 0,
      sort_order: 0,
      storage_fee: 0,
      handling_fee: 0,
      manager: '',
      remarks: '',
      department_code: '',
      department_id: 0,
      });
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await createErpWarehouse(formValues as ErpWarehouseRequest);
      handleClose();
      onSubmit();
    }
  };

  const handleSubmitAndContinue = async () => {
    if (validateForm()) {
      await createErpWarehouse(formValues as ErpWarehouseRequest);
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
      title={t('global.operate.add') + t('global.page.erp.inventory.warehouse')}
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
            label={t("page.erp.inventory.warehouse.title.warehouse_name")}
            name='warehouse_name'
            value={formValues.warehouse_name}
            onChange={handleInputChange}
            error={!!errors.warehouse_name}
            helperText={errors.warehouse_name}
          />
          <TextField
            size="small"
            label={t("page.erp.inventory.warehouse.title.location")}
            name='location'
            value={formValues.location}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.inventory.warehouse.title.status")}
            name='status'
            value={formValues.status}
            onChange={handleInputChange}
            error={!!errors.status}
            helperText={errors.status}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.erp.inventory.warehouse.title.sort_order")}
            name='sort_order'
            value={formValues.sort_order}
            onChange={handleInputChange}
            error={!!errors.sort_order}
            helperText={errors.sort_order}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.inventory.warehouse.title.storage_fee")}
            name='storage_fee'
            value={formValues.storage_fee}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.inventory.warehouse.title.handling_fee")}
            name='handling_fee'
            value={formValues.handling_fee}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.erp.inventory.warehouse.title.manager")}
            name='manager'
            value={formValues.manager}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.erp.inventory.warehouse.title.remarks")}
            name='remarks'
            value={formValues.remarks}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.erp.inventory.warehouse.title.department_code")}
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
            label={t("page.erp.inventory.warehouse.title.department_id")}
            name='department_id'
            value={formValues.department_id}
            onChange={handleInputChange}
            error={!!errors.department_id}
            helperText={errors.department_id}
          />
          </FormControl>
        <Box sx={ {mt: 2, display: 'flex', alignItems: 'center'} }>
          <Typography sx={ {mr: 4} }>{t("global.title.status")}</Typography>
          <Switch sx={ {mr: 2} } name='status' checked={!formValues.status} onChange={handleStatusChange} />
          <Typography>{formValues.status == 0 ? t('global.switch.status.true') : t('global.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpWarehouseAdd;