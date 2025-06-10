import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpWarehouseRequest, ErpWarehouseResponse, updateErpWarehouse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors {
  name?: string; // 仓库名称
  status?: string; // 状态
  sort?: string; // 排序
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
    name: '',
    location: '',
    status: 0,
    sort: 0,
    storage_fee: 0,
    handling_fee: 0,
    manager: '',
    remarks: '',
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

    if (!erpWarehouse.name.trim()) {
      newErrors.name = t('page.erp.inventory.warehouse.error.name');
    }

    if (!erpWarehouse.sort && erpWarehouse.sort != 0) {
      newErrors.sort = t('page.erp.inventory.warehouse.error.sort');
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
      title={t('global.operate.edit') + t('global.page.erp.inventory.warehouse')}
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
        sx={{
          display: 'flex',
          flexDirection: 'column',
          m: 'auto',
          width: 'fit-content',
        }}
      >
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '200px' } }}>
          <TextField
            required
            size="small"
            label={t("page.erp.inventory.warehouse.title.name")}
            name='name'
            value={erpWarehouse.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            size="small"
            label={t("page.erp.inventory.warehouse.title.location")}
            name='location'
            value={erpWarehouse.location}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.erp.inventory.warehouse.title.sort")}
            name='sort'
            value={erpWarehouse.sort}
            onChange={handleInputChange}
            error={!!errors.sort}
            helperText={errors.sort}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.inventory.warehouse.title.storage.fee")}
            name='storage_fee'
            value={erpWarehouse.storage_fee}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.inventory.warehouse.title.handling.fee")}
            name='handling_fee'
            value={erpWarehouse.handling_fee}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.erp.inventory.warehouse.title.manager")}
            name='manager'
            value={erpWarehouse.manager}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.erp.inventory.warehouse.title.remarks")}
            name='remarks'
            value={erpWarehouse.remarks}
            onChange={handleInputChange}
          />
        </FormControl>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 4 }}>{t("global.title.status")}</Typography>
          <Switch sx={{ mr: 2 }} name='status' checked={!erpWarehouse.status} onChange={handleStatusChange} />
          <Typography>{erpWarehouse.status == 0 ? t('global.switch.status.true') : t('global.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpWarehouseEdit;