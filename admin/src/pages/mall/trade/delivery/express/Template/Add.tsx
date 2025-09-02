import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createMallTradeDeliveryExpressTemplate, MallTradeDeliveryExpressTemplateRequest } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import CustomizedDictRadioGroup from '@/components/CustomizedDictRadioGroup';
import AreaCascader from '@/components/AreaCascader';

interface FormValues {
  name: string; // 模板名称
  charge_mode: number; // 配送计费方式
  sort: number; // 排序
  status: number; // 状态
}

interface FormErrors {
  name?: string; // 模板名称
  charge_mode?: string; // 配送计费方式
  sort?: string; // 排序
  status?: string; // 状态
}

interface MallTradeDeliveryExpressTemplateAddProps {
  onSubmit: () => void;
}

const MallTradeDeliveryExpressTemplateAdd = forwardRef(({ onSubmit }: MallTradeDeliveryExpressTemplateAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    charge_mode: 0,
    sort: 0,
    status: 0,
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

    if (!formValues.name.trim()) {
      newErrors.name = t('page.mall.trade.delivery.express.template.error.name');
    }

    if (!formValues.charge_mode && formValues.charge_mode != 0) {
      newErrors.charge_mode = t('page.mall.trade.delivery.express.template.error.charge.mode');
    }

    if (!formValues.sort && formValues.sort != 0) {
      newErrors.sort = t('page.mall.trade.delivery.express.template.error.sort');
    }

    if (!formValues.status && formValues.status != 0) {
      newErrors.status = t('page.mall.trade.delivery.express.template.error.status');
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
      name: '',
      charge_mode: 0,
      sort: 0,
      status: 0,
    });
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await createMallTradeDeliveryExpressTemplate(formValues as MallTradeDeliveryExpressTemplateRequest);
      handleClose();
      onSubmit();
    }
  };

  const handleSubmitAndContinue = async () => {
    if (validateForm()) {
      await createMallTradeDeliveryExpressTemplate(formValues as MallTradeDeliveryExpressTemplateRequest);
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

  const handleAreaChange = (name: string, value: string[]) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.add') + t('global.page.mall.trade.delivery.express.template')}
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
            label={t("page.mall.trade.delivery.express.template.title.name")}
            name='name'
            value={formValues.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          {/* <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.trade.delivery.express.template.title.charge.mode")}
            name='charge_mode'
            value={formValues.charge_mode}
            onChange={handleInputChange}
            error={!!errors.charge_mode}
            helperText={errors.charge_mode}
          /> */}
          <CustomizedDictRadioGroup
            id="charge-row-radio-buttons-group-label"
            name='charge_mode'
            dict_type='charge_type'
            label={t("page.mall.trade.delivery.express.template.title.charge.mode")}
            value={formValues.charge_mode}
            onChange={handleInputChange}
            sx={{ mt: 2 }}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.trade.delivery.express.template.title.sort")}
            name='sort'
            value={formValues.sort}
            onChange={handleInputChange}
            error={!!errors.sort}
            helperText={errors.sort}
          />
        </FormControl>
        <AreaCascader name='area' onChange={handleAreaChange} />
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 4 }}>{t("global.title.status")}</Typography>
          <Switch sx={{ mr: 2 }} name='status' checked={!formValues.status} onChange={handleStatusChange} />
          <Typography>{formValues.status == 0 ? t('global.switch.status.true') : t('global.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default MallTradeDeliveryExpressTemplateAdd;