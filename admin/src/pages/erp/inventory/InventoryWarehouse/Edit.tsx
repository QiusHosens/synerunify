import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpWarehouseRequest, ErpWarehouseResponse, updateErpWarehouse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors { 
  warehouse_name?: string; // 仓库名称
  status?: string; // 状态
  sort_order?: string; // 排序
  department_code?: string; // 部门编码
  department_id?: string; // 部门ID
}

interface ErpWarehouseEditProps {
  onSubmit: () => void;
}

const ErpWarehouseEdit = forwardRef(({ onSubmit }: ErpWarehouseEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [erpWarehouse, setErpWarehouse] = useState<ErpWarehouseRequest>({
    id: 0,
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
    show(erpWarehouse: ErpWarehouseResponse) {
      initForm(erpWarehouse);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formValues.warehouse_name.trim()) {
      newErrors.warehouse_name = t('page.post.error.warehouse_name');
    }
    
    if (!formValues.status && formValues.status != 0) {
      newErrors.status = t('page.post.error.status');
    }
    
    if (!formValues.sort_order && formValues.sort_order != 0) {
      newErrors.sort_order = t('page.post.error.sort_order');
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

  const initForm = (erpWarehouse: ErpWarehouseResponse) => {
    setErpWarehouse({
      ...erpWarehouse,
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateErpWarehouse(erpWarehouse);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setErpWarehouse(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setErpWarehouse(prev => ({
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

    setErpWarehouse(prev => ({
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
            label={t("page.post.title.warehouse_name")}
            name='warehouse_name'
            value={ erpWarehouse.warehouse_name}
            onChange={handleInputChange}
            error={!!errors.warehouse_name}
            helperText={errors.warehouse_name}
          />
          <TextField
            size="small"
            label={t("page.post.title.location")}
            name='location'
            value={ erpWarehouse.location}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.status")}
            name='status'
            value={ erpWarehouse.status}
            onChange={handleInputChange}
            error={!!errors.status}
            helperText={errors.status}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.post.title.sort_order")}
            name='sort_order'
            value={ erpWarehouse.sort_order}
            onChange={handleInputChange}
            error={!!errors.sort_order}
            helperText={errors.sort_order}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.storage_fee")}
            name='storage_fee'
            value={ erpWarehouse.storage_fee}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.handling_fee")}
            name='handling_fee'
            value={ erpWarehouse.handling_fee}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.post.title.manager")}
            name='manager'
            value={ erpWarehouse.manager}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.post.title.remarks")}
            name='remarks'
            value={ erpWarehouse.remarks}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.post.title.department_code")}
            name='department_code'
            value={ erpWarehouse.department_code}
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
            value={ erpWarehouse.department_id}
            onChange={handleInputChange}
            error={!!errors.department_id}
            helperText={errors.department_id}
          />
          </FormControl>
        <Box sx={ {mt: 2, display: 'flex', alignItems: 'center'} }>
          <Typography sx={ {mr: 4} }>{t("page.post.title.status")}</Typography>
          <Switch sx={ {mr: 2} } name='status' checked={!erpWarehouse.status} onChange={handleStatusChange} />
          <Typography>{ erpWarehouse.status == 0 ? t('page.post.switch.status.true') : t('page.post.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpWarehouseEdit;