import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { MallProductCategoryRequest, MallProductCategoryResponse, updateMallProductCategory } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors { 
  parent_id?: string; // 父分类编号
  name?: string; // 分类名称
  pic_url?: string; // 移动端分类图
  status?: string; // 状态
}

interface MallProductCategoryEditProps {
  onSubmit: () => void;
}

const MallProductCategoryEdit = forwardRef(({ onSubmit }: MallProductCategoryEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [mallProductCategory, setMallProductCategory] = useState<MallProductCategoryRequest>({
    id: 0,
    parent_id: 0,
    name: '',
    pic_url: '',
    sort: 0,
    status: 0,
    });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(mallProductCategory: MallProductCategoryResponse) {
      initForm(mallProductCategory);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!mallProductCategory.parent_id && mallProductCategory.parent_id != 0) {
      newErrors.parent_id = t('common.error.parent');
    }
    
    if (!mallProductCategory.name.trim()) {
      newErrors.name = t('common.error.name');
    }
    
    if (!mallProductCategory.pic_url.trim()) {
      newErrors.pic_url = t('page.mall.product.category.error.pic.url');
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

  const initForm = (mallProductCategory: MallProductCategoryResponse) => {
    setMallProductCategory({
      ...mallProductCategory,
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateMallProductCategory(mallProductCategory);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setMallProductCategory(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setMallProductCategory(prev => ({
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

    setMallProductCategory(prev => ({
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
      title={t('global.operate.edit') + t('global.page.mall.product.category')}
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
            label={t("common.title.parent")}
            name='parent_id'
            value={ mallProductCategory.parent_id}
            onChange={handleInputChange}
            error={!!errors.parent_id}
            helperText={errors.parent_id}
          />
          <TextField
            required
            size="small"
            label={t("common.title.name")}
            name='name'
            value={ mallProductCategory.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            required
            size="small"
            label={t("page.mall.product.category.title.pic.url")}
            name='pic_url'
            value={ mallProductCategory.pic_url}
            onChange={handleInputChange}
            error={!!errors.pic_url}
            helperText={errors.pic_url}
          />
          <TextField
            size="small"
            type="number"
            label={t("common.title.sort")}
            name='sort'
            value={ mallProductCategory.sort}
            onChange={handleInputChange}
          />
          </FormControl>
        <Box sx={ {mt: 2, display: 'flex', alignItems: 'center'} }>
          <Typography sx={ {mr: 4} }>{t("global.title.status")}</Typography>
          <Switch sx={ {mr: 2} } name='status' checked={!mallProductCategory.status} onChange={handleStatusChange} />
          <Typography>{ mallProductCategory.status == 0 ? t('global.switch.status.true') : t('global.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default MallProductCategoryEdit;