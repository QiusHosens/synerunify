import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { MallStoreRequest, MallStoreResponse, updateMallStore } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors {
  number?: string; // 店铺编号（业务唯一，例：S202410080001）
  name?: string; // 店铺名称
  file_id?: string; // 店铺封面ID
  status?: string; // 状态:0-待审核,1-营业中,2-暂停营业,3-审核驳回,4-永久关闭
}

interface MallStoreEditProps {
  onSubmit: () => void;
}

const MallStoreEdit = forwardRef(({ onSubmit }: MallStoreEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [mallStore, setMallStore] = useState<MallStoreRequest>({
    id: 0,
    number: '',
    name: '',
    short_name: '',
    file_id: 0,
    slider_file_ids: '',
    sort: 0,
    slogan: '',
    description: '',
    tags: '',
    status: 0,
    audit_remark: '',
    audit_time: '',
    score_desc: 0,
    score_service: 0,
    score_delivery: 0,
    total_sales_amount: 0,
    total_order_count: 0,
    total_goods_count: 0,
    total_fans_count: 0,
    is_recommend: 0,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(mallStore: MallStoreResponse) {
      initForm(mallStore);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!mallStore.number.trim()) {
      newErrors.number = t('page.mall.store.error.number');
    }

    if (!mallStore.name.trim()) {
      newErrors.name = t('page.mall.store.error.name');
    }

    if (!mallStore.file_id && mallStore.file_id != 0) {
      newErrors.file_id = t('page.mall.store.error.file_id');
    }

    if (!mallStore.status && mallStore.status != 0) {
      newErrors.status = t('page.mall.store.error.status');
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

  const initForm = (mallStore: MallStoreResponse) => {
    setMallStore({
      ...mallStore,
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateMallStore(mallStore);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setMallStore(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const { name } = e.target;

    setMallStore(prev => ({
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
      title={t('global.operate.edit') + t('global.page.mall.store')}
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
            label={t("page.mall.store.title.number")}
            name='number'
            value={mallStore.number}
            onChange={handleInputChange}
            error={!!errors.number}
            helperText={errors.number}
          />
          <TextField
            required
            size="small"
            label={t("page.mall.store.title.name")}
            name='name'
            value={mallStore.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            size="small"
            label={t("page.mall.store.title.short_name")}
            name='short_name'
            value={mallStore.short_name}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.store.title.file_id")}
            name='file_id'
            value={mallStore.file_id}
            onChange={handleInputChange}
            error={!!errors.file_id}
            helperText={errors.file_id}
          />
          <TextField
            size="small"
            label={t("page.mall.store.title.slider_file_ids")}
            name='slider_file_ids'
            value={mallStore.slider_file_ids}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.store.title.sort")}
            name='sort'
            value={mallStore.sort}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.mall.store.title.slogan")}
            name='slogan'
            value={mallStore.slogan}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.mall.store.title.description")}
            name='description'
            value={mallStore.description}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.mall.store.title.tags")}
            name='tags'
            value={mallStore.tags}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.store.title.status")}
            name='status'
            value={mallStore.status}
            onChange={handleInputChange}
            error={!!errors.status}
            helperText={errors.status}
          />
          <TextField
            size="small"
            label={t("page.mall.store.title.audit_remark")}
            name='audit_remark'
            value={mallStore.audit_remark}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.mall.store.title.audit_time")}
            name='audit_time'
            value={mallStore.audit_time}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.store.title.score_desc")}
            name='score_desc'
            value={mallStore.score_desc}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.store.title.score_service")}
            name='score_service'
            value={mallStore.score_service}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.store.title.score_delivery")}
            name='score_delivery'
            value={mallStore.score_delivery}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.store.title.total_sales_amount")}
            name='total_sales_amount'
            value={mallStore.total_sales_amount}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.store.title.total_order_count")}
            name='total_order_count'
            value={mallStore.total_order_count}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.store.title.total_goods_count")}
            name='total_goods_count'
            value={mallStore.total_goods_count}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.store.title.total_fans_count")}
            name='total_fans_count'
            value={mallStore.total_fans_count}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.store.title.is_recommend")}
            name='is_recommend'
            value={mallStore.is_recommend}
            onChange={handleInputChange}
          />
        </FormControl>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 4 }}>{t("global.title.status")}</Typography>
          <Switch sx={{ mr: 2 }} name='status' checked={!mallStore.status} onChange={handleStatusChange} />
          <Typography>{mallStore.status == 0 ? t('global.switch.status.true') : t('global.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default MallStoreEdit;