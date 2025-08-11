import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createMallProductSpu, MallProductSpuRequest } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormValues {
  name: string; // 商品名称
  keyword: string; // 关键字
  introduction: string; // 商品简介
  description: string; // 商品详情
  category_id: number; // 商品分类编号
  brand_id: number; // 商品品牌编号
  file_id: string; // 商品封面图
  slider_pic_urls: string; // 商品轮播图地址数组，以逗号分隔最多上传15张
  sort: number; // 排序字段
  status: number; // 商品状态: 0 上架（开启） 1 下架（禁用） -1 回收
  spec_type: boolean; // 规格类型：0 单规格 1 多规格
  price: number; // 商品价格，单位使用：分
  market_price: number; // 市场价，单位使用：分
  cost_price: number; // 成本价，单位： 分
  stock: number; // 库存
  delivery_types: string; // 配送方式数组
  delivery_template_id: number; // 物流配置模板编号
  give_integral: number; // 赠送积分
  sub_commission_type: boolean; // 分销类型
  sales_count: number; // 商品销量
  virtual_sales_count: number; // 虚拟销量
  browse_count: number; // 商品点击量
}

interface FormErrors {
  name?: string; // 商品名称
  category_id?: string; // 商品分类编号
  file_id?: string; // 商品封面图
  sort?: string; // 排序字段
  status?: string; // 商品状态: 0 上架（开启） 1 下架（禁用） -1 回收
  price?: string; // 商品价格，单位使用：分
  cost_price?: string; // 成本价，单位： 分
  stock?: string; // 库存
  delivery_types?: string; // 配送方式数组
  give_integral?: string; // 赠送积分
}

interface MallProductSpuAddProps {
  onSubmit: () => void;
}

const MallProductSpuAdd = forwardRef(({ onSubmit }: MallProductSpuAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    keyword: '',
    introduction: '',
    description: '',
    category_id: 0,
    brand_id: 0,
    file_id: '',
    slider_pic_urls: '',
    sort: 0,
    status: 0,
    spec_type: '',
    price: 0,
    market_price: 0,
    cost_price: 0,
    stock: 0,
    delivery_types: '',
    delivery_template_id: 0,
    give_integral: 0,
    sub_commission_type: '',
    sales_count: 0,
    virtual_sales_count: 0,
    browse_count: 0,
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
      newErrors.name = t('page.mall.product.error.name');
    }

    if (!formValues.category_id && formValues.category_id != 0) {
      newErrors.category_id = t('page.mall.product.error.category_id');
    }

    if (!formValues.file_id.trim()) {
      newErrors.file_id = t('page.mall.product.error.file_id');
    }

    if (!formValues.sort && formValues.sort != 0) {
      newErrors.sort = t('page.mall.product.error.sort');
    }

    if (!formValues.status && formValues.status != 0) {
      newErrors.status = t('page.mall.product.error.status');
    }

    if (!formValues.price && formValues.price != 0) {
      newErrors.price = t('page.mall.product.error.price');
    }

    if (!formValues.cost_price && formValues.cost_price != 0) {
      newErrors.cost_price = t('page.mall.product.error.cost_price');
    }

    if (!formValues.stock && formValues.stock != 0) {
      newErrors.stock = t('page.mall.product.error.stock');
    }

    if (!formValues.delivery_types.trim()) {
      newErrors.delivery_types = t('page.mall.product.error.delivery_types');
    }

    if (!formValues.give_integral && formValues.give_integral != 0) {
      newErrors.give_integral = t('page.mall.product.error.give_integral');
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
      keyword: '',
      introduction: '',
      description: '',
      category_id: 0,
      brand_id: 0,
      file_id: '',
      slider_pic_urls: '',
      sort: 0,
      status: 0,
      spec_type: '',
      price: 0,
      market_price: 0,
      cost_price: 0,
      stock: 0,
      delivery_types: '',
      delivery_template_id: 0,
      give_integral: 0,
      sub_commission_type: '',
      sales_count: 0,
      virtual_sales_count: 0,
      browse_count: 0,
    });
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await createMallProductSpu(formValues as MallProductSpuRequest);
      handleClose();
      onSubmit();
    }
  };

  const handleSubmitAndContinue = async () => {
    if (validateForm()) {
      await createMallProductSpu(formValues as MallProductSpuRequest);
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
      title={t('global.operate.add') + t('global.page.mall.product')}
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
            label={t("page.mall.product.title.name")}
            name='name'
            value={formValues.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            size="small"
            label={t("page.mall.product.title.keyword")}
            name='keyword'
            value={formValues.keyword}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.mall.product.title.introduction")}
            name='introduction'
            value={formValues.introduction}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.mall.product.title.description")}
            name='description'
            value={formValues.description}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.product.title.category_id")}
            name='category_id'
            value={formValues.category_id}
            onChange={handleInputChange}
            error={!!errors.category_id}
            helperText={errors.category_id}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.product.title.brand_id")}
            name='brand_id'
            value={formValues.brand_id}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.mall.product.title.file_id")}
            name='file_id'
            value={formValues.file_id}
            onChange={handleInputChange}
            error={!!errors.file_id}
            helperText={errors.file_id}
          />
          <TextField
            size="small"
            label={t("page.mall.product.title.slider_pic_urls")}
            name='slider_pic_urls'
            value={formValues.slider_pic_urls}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.product.title.sort")}
            name='sort'
            value={formValues.sort}
            onChange={handleInputChange}
            error={!!errors.sort}
            helperText={errors.sort}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.product.title.status")}
            name='status'
            value={formValues.status}
            onChange={handleInputChange}
            error={!!errors.status}
            helperText={errors.status}
          />
          <TextField
            size="small"
            label={t("page.mall.product.title.spec_type")}
            name='spec_type'
            value={formValues.spec_type}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.product.title.price")}
            name='price'
            value={formValues.price}
            onChange={handleInputChange}
            error={!!errors.price}
            helperText={errors.price}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.product.title.market_price")}
            name='market_price'
            value={formValues.market_price}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.product.title.cost_price")}
            name='cost_price'
            value={formValues.cost_price}
            onChange={handleInputChange}
            error={!!errors.cost_price}
            helperText={errors.cost_price}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.product.title.stock")}
            name='stock'
            value={formValues.stock}
            onChange={handleInputChange}
            error={!!errors.stock}
            helperText={errors.stock}
          />
          <TextField
            required
            size="small"
            label={t("page.mall.product.title.delivery_types")}
            name='delivery_types'
            value={formValues.delivery_types}
            onChange={handleInputChange}
            error={!!errors.delivery_types}
            helperText={errors.delivery_types}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.product.title.delivery_template_id")}
            name='delivery_template_id'
            value={formValues.delivery_template_id}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.product.title.give_integral")}
            name='give_integral'
            value={formValues.give_integral}
            onChange={handleInputChange}
            error={!!errors.give_integral}
            helperText={errors.give_integral}
          />
          <TextField
            size="small"
            label={t("page.mall.product.title.sub_commission_type")}
            name='sub_commission_type'
            value={formValues.sub_commission_type}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.product.title.sales_count")}
            name='sales_count'
            value={formValues.sales_count}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.product.title.virtual_sales_count")}
            name='virtual_sales_count'
            value={formValues.virtual_sales_count}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.product.title.browse_count")}
            name='browse_count'
            value={formValues.browse_count}
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

export default MallProductSpuAdd;