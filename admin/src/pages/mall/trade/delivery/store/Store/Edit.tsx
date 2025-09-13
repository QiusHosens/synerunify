import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { MallTradeDeliveryPickUpStoreRequest, MallTradeDeliveryPickUpStoreResponse, updateMallTradeDeliveryPickUpStore } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors { 
  name?: string; // 门店名称
  phone?: string; // 门店手机
  area_id?: string; // 区域编号
  detail_address?: string; // 门店详细地址
  file_id?: string; // 门店 file_id
  opening_time?: string; // 营业开始时间
  closing_time?: string; // 营业结束时间
  latitude?: string; // 纬度
  longitude?: string; // 经度
  status?: string; // 门店状态
}

interface MallTradeDeliveryPickUpStoreEditProps {
  onSubmit: () => void;
}

const MallTradeDeliveryPickUpStoreEdit = forwardRef(({ onSubmit }: MallTradeDeliveryPickUpStoreEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [mallTradeDeliveryPickUpStore, setMallTradeDeliveryPickUpStore] = useState<MallTradeDeliveryPickUpStoreRequest>({
    id: 0,
    name: '',
    introduction: '',
    phone: '',
    area_id: 0,
    detail_address: '',
    file_id: 0,
    opening_time: '',
    closing_time: '',
    latitude: 0,
    longitude: 0,
    verify_user_ids: '',
    status: 0,
    });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(mallTradeDeliveryPickUpStore: MallTradeDeliveryPickUpStoreResponse) {
      initForm(mallTradeDeliveryPickUpStore);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!mallTradeDeliveryPickUpStore.name.trim()) {
      newErrors.name = t('page.mall.trade.delivery.store.error.name');
    }
    
    if (!mallTradeDeliveryPickUpStore.phone.trim()) {
      newErrors.phone = t('page.mall.trade.delivery.store.error.phone');
    }
    
    if (!mallTradeDeliveryPickUpStore.area_id && mallTradeDeliveryPickUpStore.area_id != 0) {
      newErrors.area_id = t('page.mall.trade.delivery.store.error.area_id');
    }
    
    if (!mallTradeDeliveryPickUpStore.detail_address.trim()) {
      newErrors.detail_address = t('page.mall.trade.delivery.store.error.detail_address');
    }
    
    if (!mallTradeDeliveryPickUpStore.file_id.trim()) {
      newErrors.file_id = t('page.mall.trade.delivery.store.error.file_id');
    }
    
    if (!mallTradeDeliveryPickUpStore.opening_time.trim()) {
      newErrors.opening_time = t('page.mall.trade.delivery.store.error.opening_time');
    }
    
    if (!mallTradeDeliveryPickUpStore.closing_time.trim()) {
      newErrors.closing_time = t('page.mall.trade.delivery.store.error.closing_time');
    }
    
    if (!mallTradeDeliveryPickUpStore.latitude && mallTradeDeliveryPickUpStore.latitude != 0) {
      newErrors.latitude = t('page.mall.trade.delivery.store.error.latitude');
    }
    
    if (!mallTradeDeliveryPickUpStore.longitude && mallTradeDeliveryPickUpStore.longitude != 0) {
      newErrors.longitude = t('page.mall.trade.delivery.store.error.longitude');
    }
    
    if (!mallTradeDeliveryPickUpStore.status && mallTradeDeliveryPickUpStore.status != 0) {
      newErrors.status = t('page.mall.trade.delivery.store.error.status');
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

  const initForm = (mallTradeDeliveryPickUpStore: MallTradeDeliveryPickUpStoreResponse) => {
    setMallTradeDeliveryPickUpStore({
      ...mallTradeDeliveryPickUpStore,
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateMallTradeDeliveryPickUpStore(mallTradeDeliveryPickUpStore);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setMallTradeDeliveryPickUpStore(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setMallTradeDeliveryPickUpStore(prev => ({
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

    setMallTradeDeliveryPickUpStore(prev => ({
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
      title={t('global.operate.edit') + t('global.page.mall.trade.delivery.store')}
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
            label={t("page.mall.trade.delivery.store.title.name")}
            name='name'
            value={ mallTradeDeliveryPickUpStore.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            size="small"
            label={t("page.mall.trade.delivery.store.title.introduction")}
            name='introduction'
            value={ mallTradeDeliveryPickUpStore.introduction}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.mall.trade.delivery.store.title.phone")}
            name='phone'
            value={ mallTradeDeliveryPickUpStore.phone}
            onChange={handleInputChange}
            error={!!errors.phone}
            helperText={errors.phone}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.trade.delivery.store.title.area_id")}
            name='area_id'
            value={ mallTradeDeliveryPickUpStore.area_id}
            onChange={handleInputChange}
            error={!!errors.area_id}
            helperText={errors.area_id}
          />
          <TextField
            required
            size="small"
            label={t("page.mall.trade.delivery.store.title.detail_address")}
            name='detail_address'
            value={ mallTradeDeliveryPickUpStore.detail_address}
            onChange={handleInputChange}
            error={!!errors.detail_address}
            helperText={errors.detail_address}
          />
          <TextField
            required
            size="small"
            label={t("page.mall.trade.delivery.store.title.file_id")}
            name='file_id'
            value={ mallTradeDeliveryPickUpStore.file_id}
            onChange={handleInputChange}
            error={!!errors.file_id}
            helperText={errors.file_id}
          />
          <TextField
            required
            size="small"
            label={t("page.mall.trade.delivery.store.title.opening_time")}
            name='opening_time'
            value={ mallTradeDeliveryPickUpStore.opening_time}
            onChange={handleInputChange}
            error={!!errors.opening_time}
            helperText={errors.opening_time}
          />
          <TextField
            required
            size="small"
            label={t("page.mall.trade.delivery.store.title.closing_time")}
            name='closing_time'
            value={ mallTradeDeliveryPickUpStore.closing_time}
            onChange={handleInputChange}
            error={!!errors.closing_time}
            helperText={errors.closing_time}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.trade.delivery.store.title.latitude")}
            name='latitude'
            value={ mallTradeDeliveryPickUpStore.latitude}
            onChange={handleInputChange}
            error={!!errors.latitude}
            helperText={errors.latitude}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.trade.delivery.store.title.longitude")}
            name='longitude'
            value={ mallTradeDeliveryPickUpStore.longitude}
            onChange={handleInputChange}
            error={!!errors.longitude}
            helperText={errors.longitude}
          />
          <TextField
            size="small"
            label={t("page.mall.trade.delivery.store.title.verify_user_ids")}
            name='verify_user_ids'
            value={ mallTradeDeliveryPickUpStore.verify_user_ids}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.trade.delivery.store.title.status")}
            name='status'
            value={ mallTradeDeliveryPickUpStore.status}
            onChange={handleInputChange}
            error={!!errors.status}
            helperText={errors.status}
          />
          </FormControl>
        <Box sx={ {mt: 2, display: 'flex', alignItems: 'center'} }>
          <Typography sx={ {mr: 4} }>{t("global.title.status")}</Typography>
          <Switch sx={ {mr: 2} } name='status' checked={!mallTradeDeliveryPickUpStore.status} onChange={handleStatusChange} />
          <Typography>{ mallTradeDeliveryPickUpStore.status == 0 ? t('global.switch.status.true') : t('global.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default MallTradeDeliveryPickUpStoreEdit;