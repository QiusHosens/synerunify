import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { MallTradeDeliveryExpressTemplateRequest, MallTradeDeliveryExpressTemplateResponse, updateMallTradeDeliveryExpressTemplate } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors { 
  name?: string; // 模板名称
  charge_mode?: string; // 配送计费方式
  sort?: string; // 排序
  status?: string; // 状态
}

interface MallTradeDeliveryExpressTemplateEditProps {
  onSubmit: () => void;
}

const MallTradeDeliveryExpressTemplateEdit = forwardRef(({ onSubmit }: MallTradeDeliveryExpressTemplateEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [mallTradeDeliveryExpressTemplate, setMallTradeDeliveryExpressTemplate] = useState<MallTradeDeliveryExpressTemplateRequest>({
    id: 0,
    name: '',
    charge_mode: 0,
    sort: 0,
    status: 0,
    });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(mallTradeDeliveryExpressTemplate: MallTradeDeliveryExpressTemplateResponse) {
      initForm(mallTradeDeliveryExpressTemplate);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!mallTradeDeliveryExpressTemplate.name.trim()) {
      newErrors.name = t('page.mall.trade.delivery.express.template.error.name');
    }
    
    if (!mallTradeDeliveryExpressTemplate.charge_mode && mallTradeDeliveryExpressTemplate.charge_mode != 0) {
      newErrors.charge_mode = t('page.mall.trade.delivery.express.template.error.charge.mode');
    }
    
    if (!mallTradeDeliveryExpressTemplate.sort && mallTradeDeliveryExpressTemplate.sort != 0) {
      newErrors.sort = t('page.mall.trade.delivery.express.template.error.sort');
    }
    
    if (!mallTradeDeliveryExpressTemplate.status && mallTradeDeliveryExpressTemplate.status != 0) {
      newErrors.status = t('page.mall.trade.delivery.express.template.error.status');
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

  const initForm = (mallTradeDeliveryExpressTemplate: MallTradeDeliveryExpressTemplateResponse) => {
    setMallTradeDeliveryExpressTemplate({
      ...mallTradeDeliveryExpressTemplate,
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateMallTradeDeliveryExpressTemplate(mallTradeDeliveryExpressTemplate);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setMallTradeDeliveryExpressTemplate(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setMallTradeDeliveryExpressTemplate(prev => ({
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

    setMallTradeDeliveryExpressTemplate(prev => ({
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
      title={t('global.operate.edit') + t('global.page.mall.trade.delivery.express.template')}
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
            label={t("page.mall.trade.delivery.express.template.title.name")}
            name='name'
            value={ mallTradeDeliveryExpressTemplate.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.trade.delivery.express.template.title.charge.mode")}
            name='charge_mode'
            value={ mallTradeDeliveryExpressTemplate.charge_mode}
            onChange={handleInputChange}
            error={!!errors.charge_mode}
            helperText={errors.charge_mode}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.trade.delivery.express.template.title.sort")}
            name='sort'
            value={ mallTradeDeliveryExpressTemplate.sort}
            onChange={handleInputChange}
            error={!!errors.sort}
            helperText={errors.sort}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.trade.delivery.express.template.title.status")}
            name='status'
            value={ mallTradeDeliveryExpressTemplate.status}
            onChange={handleInputChange}
            error={!!errors.status}
            helperText={errors.status}
          />
          </FormControl>
        <Box sx={ {mt: 2, display: 'flex', alignItems: 'center'} }>
          <Typography sx={ {mr: 4} }>{t("global.title.status")}</Typography>
          <Switch sx={ {mr: 2} } name='status' checked={!mallTradeDeliveryExpressTemplate.status} onChange={handleStatusChange} />
          <Typography>{ mallTradeDeliveryExpressTemplate.status == 0 ? t('global.switch.status.true') : t('global.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default MallTradeDeliveryExpressTemplateEdit;