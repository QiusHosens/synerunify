import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpProductCategoryRequest, ErpProductCategoryResponse, updateErpProductCategory } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors { 
  category_name?: string; // 分类名称
  status?: string; // 状态
  sort_order?: string; // 排序
  department_code?: string; // 部门编码
  department_id?: string; // 部门ID
}

interface ErpProductCategoryEditProps {
  onSubmit: () => void;
}

const ErpProductCategoryEdit = forwardRef(({ onSubmit }: ErpProductCategoryEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [erpProductCategory, setErpProductCategory] = useState<ErpProductCategoryRequest>({
    id: 0,
    category_code: '',
    category_name: '',
    parent_id: 0,
    status: 0,
    sort_order: 0,
    remarks: '',
    department_code: '',
    department_id: 0,
    });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(erpProductCategory: ErpProductCategoryResponse) {
      initForm(erpProductCategory);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formValues.category_name.trim()) {
      newErrors.category_name = t('page.post.error.category_name');
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

  const initForm = (erpProductCategory: ErpProductCategoryResponse) => {
    setErpProductCategory({
      ...erpProductCategory,
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateErpProductCategory(erpProductCategory);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setErpProductCategory(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setErpProductCategory(prev => ({
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

    setErpProductCategory(prev => ({
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
            size="small"
            label={t("page.post.title.category_code")}
            name='category_code'
            value={ erpProductCategory.category_code}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.post.title.category_name")}
            name='category_name'
            value={ erpProductCategory.category_name}
            onChange={handleInputChange}
            error={!!errors.category_name}
            helperText={errors.category_name}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.parent_id")}
            name='parent_id'
            value={ erpProductCategory.parent_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.status")}
            name='status'
            value={ erpProductCategory.status}
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
            value={ erpProductCategory.sort_order}
            onChange={handleInputChange}
            error={!!errors.sort_order}
            helperText={errors.sort_order}
          />
          <TextField
            size="small"
            label={t("page.post.title.remarks")}
            name='remarks'
            value={ erpProductCategory.remarks}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.post.title.department_code")}
            name='department_code'
            value={ erpProductCategory.department_code}
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
            value={ erpProductCategory.department_id}
            onChange={handleInputChange}
            error={!!errors.department_id}
            helperText={errors.department_id}
          />
          </FormControl>
        <Box sx={ {mt: 2, display: 'flex', alignItems: 'center'} }>
          <Typography sx={ {mr: 4} }>{t("page.post.title.status")}</Typography>
          <Switch sx={ {mr: 2} } name='status' checked={!erpProductCategory.status} onChange={handleStatusChange} />
          <Typography>{ erpProductCategory.status == 0 ? t('page.post.switch.status.true') : t('page.post.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpProductCategoryEdit;