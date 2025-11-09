import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { MallStoreNoticeRequest, MallStoreNoticeResponse, updateMallStoreNotice } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors { 
  store_id?: string; // 店铺编号
  title?: string; // 公告标题
  content?: string; // 公告内容
  top?: string; // 是否置顶:0-置顶,1-不置顶
}

interface MallStoreNoticeEditProps {
  onSubmit: () => void;
}

const MallStoreNoticeEdit = forwardRef(({ onSubmit }: MallStoreNoticeEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [mallStoreNotice, setMallStoreNotice] = useState<MallStoreNoticeRequest>({
    id: 0,
    store_id: 0,
    title: '',
    content: '',
    top: 0,
    });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(mallStoreNotice: MallStoreNoticeResponse) {
      initForm(mallStoreNotice);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!mallStoreNotice.store_id && mallStoreNotice.store_id != 0) {
      newErrors.store_id = t('page.mall.store.notice.error.store');
    }
    
    if (!mallStoreNotice.title.trim()) {
      newErrors.title = t('page.mall.store.notice.error.title');
    }
    
    if (!mallStoreNotice.content.trim()) {
      newErrors.content = t('page.mall.store.notice.error.content');
    }
    
    if (!mallStoreNotice.top && mallStoreNotice.top != 0) {
      newErrors.top = t('page.mall.store.notice.error.top');
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

  const initForm = (mallStoreNotice: MallStoreNoticeResponse) => {
    setMallStoreNotice({
      ...mallStoreNotice,
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateMallStoreNotice(mallStoreNotice);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setMallStoreNotice(prev => ({
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

    setMallStoreNotice(prev => ({
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
      title={t('global.operate.edit') + t('global.page.mall.store.notice')}
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
            type="number"
            label={t("page.mall.store.notice.title.store")}
            name='store_id'
            value={ mallStoreNotice.store_id}
            onChange={handleInputChange}
            error={!!errors.store_id}
            helperText={errors.store_id}
          />
          <TextField
            required
            size="small"
            label={t("page.mall.store.notice.title.title")}
            name='title'
            value={ mallStoreNotice.title}
            onChange={handleInputChange}
            error={!!errors.title}
            helperText={errors.title}
          />
          <TextField
            required
            size="small"
            label={t("page.mall.store.notice.title.content")}
            name='content'
            value={ mallStoreNotice.content}
            onChange={handleInputChange}
            error={!!errors.content}
            helperText={errors.content}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.store.notice.title.top")}
            name='top'
            value={ mallStoreNotice.top}
            onChange={handleInputChange}
            error={!!errors.top}
            helperText={errors.top}
          />
          </FormControl>
      </Box>
    </CustomizedDialog>
  )
});

export default MallStoreNoticeEdit;