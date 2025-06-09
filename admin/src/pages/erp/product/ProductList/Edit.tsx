import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpProductRequest, ErpProductResponse, updateErpProduct } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors { 
  name?: string; // 产品名称
  unit_id?: string; // 产品单位ID
  status?: string; // 状态
  stock_quantity?: string; // 库存数量
  min_stock?: string; // 最低库存
  department_code?: string; // 部门编码
  department_id?: string; // 部门ID
}

interface ErpProductEditProps {
  onSubmit: () => void;
}

const ErpProductEdit = forwardRef(({ onSubmit }: ErpProductEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [erpProduct, setErpProduct] = useState<ErpProductRequest>({
    id: 0,
    product_code: '',
    name: '',
    category_id: 0,
    unit_id: 0,
    status: 0,
    barcode: '',
    specification: '',
    shelf_life_days: 0,
    weight: 0,
    purchase_price: 0,
    sale_price: 0,
    min_price: 0,
    stock_quantity: 0,
    min_stock: 0,
    remarks: '',
    department_code: '',
    department_id: 0,
    });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(erpProduct: ErpProductResponse) {
      initForm(erpProduct);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formValues.name.trim()) {
      newErrors.name = t('page.post.error.name');
    }
    
    if (!formValues.unit_id && formValues.unit_id != 0) {
      newErrors.unit_id = t('page.post.error.unit_id');
    }
    
    if (!formValues.status && formValues.status != 0) {
      newErrors.status = t('page.post.error.status');
    }
    
    if (!formValues.stock_quantity && formValues.stock_quantity != 0) {
      newErrors.stock_quantity = t('page.post.error.stock_quantity');
    }
    
    if (!formValues.min_stock && formValues.min_stock != 0) {
      newErrors.min_stock = t('page.post.error.min_stock');
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

  const initForm = (erpProduct: ErpProductResponse) => {
    setErpProduct({
      ...erpProduct,
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateErpProduct(erpProduct);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setErpProduct(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setErpProduct(prev => ({
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

    setErpProduct(prev => ({
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
            label={t("page.post.title.product_code")}
            name='product_code'
            value={ erpProduct.product_code}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.post.title.name")}
            name='name'
            value={ erpProduct.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.category_id")}
            name='category_id'
            value={ erpProduct.category_id}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.post.title.unit_id")}
            name='unit_id'
            value={ erpProduct.unit_id}
            onChange={handleInputChange}
            error={!!errors.unit_id}
            helperText={errors.unit_id}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.status")}
            name='status'
            value={ erpProduct.status}
            onChange={handleInputChange}
            error={!!errors.status}
            helperText={errors.status}
          />
          <TextField
            size="small"
            label={t("page.post.title.barcode")}
            name='barcode'
            value={ erpProduct.barcode}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.post.title.specification")}
            name='specification'
            value={ erpProduct.specification}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.shelf_life_days")}
            name='shelf_life_days'
            value={ erpProduct.shelf_life_days}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.weight")}
            name='weight'
            value={ erpProduct.weight}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.purchase_price")}
            name='purchase_price'
            value={ erpProduct.purchase_price}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.sale_price")}
            name='sale_price'
            value={ erpProduct.sale_price}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.post.title.min_price")}
            name='min_price'
            value={ erpProduct.min_price}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.post.title.stock_quantity")}
            name='stock_quantity'
            value={ erpProduct.stock_quantity}
            onChange={handleInputChange}
            error={!!errors.stock_quantity}
            helperText={errors.stock_quantity}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.post.title.min_stock")}
            name='min_stock'
            value={ erpProduct.min_stock}
            onChange={handleInputChange}
            error={!!errors.min_stock}
            helperText={errors.min_stock}
          />
          <TextField
            size="small"
            label={t("page.post.title.remarks")}
            name='remarks'
            value={ erpProduct.remarks}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.post.title.department_code")}
            name='department_code'
            value={ erpProduct.department_code}
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
            value={ erpProduct.department_id}
            onChange={handleInputChange}
            error={!!errors.department_id}
            helperText={errors.department_id}
          />
          </FormControl>
        <Box sx={ {mt: 2, display: 'flex', alignItems: 'center'} }>
          <Typography sx={ {mr: 4} }>{t("page.post.title.status")}</Typography>
          <Switch sx={ {mr: 2} } name='status' checked={!erpProduct.status} onChange={handleStatusChange} />
          <Typography>{ erpProduct.status == 0 ? t('page.post.switch.status.true') : t('page.post.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpProductEdit;