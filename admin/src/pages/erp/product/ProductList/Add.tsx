import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createErpProduct, ErpProductRequest } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormValues {
  product_code: string; // 产品编码
  name: string; // 产品名称
  category_id: number; // 产品分类ID
  unit_id: number; // 产品单位ID
  status: number; // 状态
  barcode: string; // 条码
  specification: string; // 规格
  shelf_life_days: number; // 保质期天数
  weight: number; // 重量,kg,精确到百分位
  purchase_price: number; // 采购价格
  sale_price: number; // 销售价格
  min_price: number; // 最低价格
  stock_quantity: number; // 库存数量
  min_stock: number; // 最低库存
  remarks: string; // 备注
}

interface FormErrors {
  name?: string; // 产品名称
  unit_id?: string; // 产品单位ID
  status?: string; // 状态
  stock_quantity?: string; // 库存数量
  min_stock?: string; // 最低库存
}

interface ErpProductAddProps {
  onSubmit: () => void;
}

const ErpProductAdd = forwardRef(({ onSubmit }: ErpProductAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [formValues, setFormValues] = useState<FormValues>({
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
      newErrors.name = t('page.erp.product.list.error.name');
    }

    if (!formValues.unit_id && formValues.unit_id != 0) {
      newErrors.unit_id = t('page.erp.product.list.error.unit');
    }

    if (!formValues.stock_quantity && formValues.stock_quantity != 0) {
      newErrors.stock_quantity = t('page.erp.product.list.error.stock.quantity');
    }

    if (!formValues.min_stock && formValues.min_stock != 0) {
      newErrors.min_stock = t('page.erp.product.list.error.min.stock');
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
    });
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await createErpProduct(formValues as ErpProductRequest);
      handleClose();
      onSubmit();
    }
  };

  const handleSubmitAndContinue = async () => {
    if (validateForm()) {
      await createErpProduct(formValues as ErpProductRequest);
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
      title={t('global.operate.add') + t('global.page.erp.product.list')}
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
            size="small"
            label={t("page.erp.product.list.title.product.code")}
            name='product_code'
            value={formValues.product_code}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.erp.product.list.title.name")}
            name='name'
            value={formValues.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.product.list.title.category")}
            name='category_id'
            value={formValues.category_id}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.erp.product.list.title.unit")}
            name='unit_id'
            value={formValues.unit_id}
            onChange={handleInputChange}
            error={!!errors.unit_id}
            helperText={errors.unit_id}
          />
          <TextField
            size="small"
            label={t("page.erp.product.list.title.barcode")}
            name='barcode'
            value={formValues.barcode}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.erp.product.list.title.specification")}
            name='specification'
            value={formValues.specification}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.product.list.title.shelf.life.days")}
            name='shelf_life_days'
            value={formValues.shelf_life_days}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.product.list.title.weight")}
            name='weight'
            value={formValues.weight}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.product.list.title.purchase.price")}
            name='purchase_price'
            value={formValues.purchase_price}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.product.list.title.sale.price")}
            name='sale_price'
            value={formValues.sale_price}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.product.list.title.min.price")}
            name='min_price'
            value={formValues.min_price}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.erp.product.list.title.stock.quantity")}
            name='stock_quantity'
            value={formValues.stock_quantity}
            onChange={handleInputChange}
            error={!!errors.stock_quantity}
            helperText={errors.stock_quantity}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.erp.product.list.title.min.stock")}
            name='min_stock'
            value={formValues.min_stock}
            onChange={handleInputChange}
            error={!!errors.min_stock}
            helperText={errors.min_stock}
          />
          <TextField
            size="small"
            label={t("page.erp.product.list.title.remarks")}
            name='remarks'
            value={formValues.remarks}
            onChange={handleInputChange}
          />
        </FormControl>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 4 }}>{t("global.title.status")}</Typography>
          <Switch sx={{ mr: 2 }} name='status' checked={!formValues.status} onChange={handleStatusChange} />
          <Typography>{formValues.status == 0 ? t('global.switch.status.true') : t('global.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpProductAdd;