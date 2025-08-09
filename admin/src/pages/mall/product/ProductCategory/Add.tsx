import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createMallProductCategory, MallProductCategoryRequest } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormValues {
  parent_id: number; // 父分类编号
  name: string; // 分类名称
  pic_url: string; // 移动端分类图
  sort: number; // 分类排序
  status: number; // 状态
  }

interface FormErrors { 
  parent_id?: string; // 父分类编号
  name?: string; // 分类名称
  pic_url?: string; // 移动端分类图
  status?: string; // 状态
}

interface MallProductCategoryAddProps {
  onSubmit: () => void;
}

const MallProductCategoryAdd = forwardRef(({ onSubmit }: MallProductCategoryAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [formValues, setFormValues] = useState<FormValues>({
    parent_id: 0,
    name: '',
    pic_url: '',
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
    
    if (!formValues.parent_id && formValues.parent_id != 0) {
      newErrors.parent_id = t('common.error.parent');
    }
    
    if (!formValues.name.trim()) {
      newErrors.name = t('common.error.name');
    }
    
    if (!formValues.pic_url.trim()) {
      newErrors.pic_url = t('page.mall.product.category.error.pic.url');
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
      parent_id: 0,
      name: '',
      pic_url: '',
      sort: 0,
      status: 0,
      });
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await createMallProductCategory(formValues as MallProductCategoryRequest);
      handleClose();
      onSubmit();
    }
  };

  const handleSubmitAndContinue = async () => {
    if (validateForm()) {
      await createMallProductCategory(formValues as MallProductCategoryRequest);
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
      title={t('global.operate.add') + t('global.page.mall.product.category')}
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
            type="number"
            label={t("common.title.parent")}
            name='parent_id'
            value={formValues.parent_id}
            onChange={handleInputChange}
            error={!!errors.parent_id}
            helperText={errors.parent_id}
          />
          <TextField
            required
            size="small"
            label={t("common.title.name")}
            name='name'
            value={formValues.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            required
            size="small"
            label={t("page.mall.product.category.title.pic.url")}
            name='pic_url'
            value={formValues.pic_url}
            onChange={handleInputChange}
            error={!!errors.pic_url}
            helperText={errors.pic_url}
          />
          <TextField
            size="small"
            type="number"
            label={t("common.title.sort")}
            name='sort'
            value={formValues.sort}
            onChange={handleInputChange}
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

export default MallProductCategoryAdd;