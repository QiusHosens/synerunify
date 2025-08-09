import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { MallProductSpuRequest, MallProductSpuResponse, updateMallProductSpu } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors {
  name?: string; // 商品名称
  category_id?: string; // 商品分类编号
  pic_url?: string; // 商品封面图
  sort?: string; // 排序字段
  status?: string; // 商品状态: 0 上架（开启） 1 下架（禁用） -1 回收
  price?: string; // 商品价格，单位使用：分
  cost_price?: string; // 成本价，单位： 分
  stock?: string; // 库存
  delivery_types?: string; // 配送方式数组
  give_integral?: string; // 赠送积分
}

interface MallProductSpuEditProps {
  onSubmit: () => void;
}

const MallProductSpuEdit = forwardRef(({ onSubmit }: MallProductSpuEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [mallProductSpu, setMallProductSpu] = useState<MallProductSpuRequest>({
    id: 0,
    name: '',
    keyword: '',
    introduction: '',
    description: '',
    category_id: 0,
    brand_id: 0,
    pic_url: '',
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
    show(mallProductSpu: MallProductSpuResponse) {
      initForm(mallProductSpu);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!mallProductSpu.name.trim()) {
      newErrors.name = t('page.mall.product.error.name');
    }

    if (!mallProductSpu.category_id && mallProductSpu.category_id != 0) {
      newErrors.category_id = t('page.mall.product.error.category_id');
    }

    if (!mallProductSpu.pic_url.trim()) {
      newErrors.pic_url = t('page.mall.product.error.pic_url');
    }

    if (!mallProductSpu.sort && mallProductSpu.sort != 0) {
      newErrors.sort = t('page.mall.product.error.sort');
    }

    if (!mallProductSpu.status && mallProductSpu.status != 0) {
      newErrors.status = t('page.mall.product.error.status');
    }

    if (!mallProductSpu.price && mallProductSpu.price != 0) {
      newErrors.price = t('page.mall.product.error.price');
    }

    if (!mallProductSpu.cost_price && mallProductSpu.cost_price != 0) {
      newErrors.cost_price = t('page.mall.product.error.cost_price');
    }

    if (!mallProductSpu.stock && mallProductSpu.stock != 0) {
      newErrors.stock = t('page.mall.product.error.stock');
    }

    if (!mallProductSpu.delivery_types.trim()) {
      newErrors.delivery_types = t('page.mall.product.error.delivery_types');
    }

    if (!mallProductSpu.give_integral && mallProductSpu.give_integral != 0) {
      newErrors.give_integral = t('page.mall.product.error.give_integral');
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

  const initForm = (mallProductSpu: MallProductSpuResponse) => {
    setMallProductSpu({
      ...mallProductSpu,
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateMallProductSpu(mallProductSpu);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setMallProductSpu(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setMallProductSpu(prev => ({
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

    setMallProductSpu(prev => ({
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
      title={t('global.operate.edit') + t('global.page.mall.product')}
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
            label={t("page.mall.product.title.name")}
            name='name'
            value={mallProductSpu.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            size="small"
            label={t("page.mall.product.title.keyword")}
            name='keyword'
            value={mallProductSpu.keyword}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.mall.product.title.introduction")}
            name='introduction'
            value={mallProductSpu.introduction}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.mall.product.title.description")}
            name='description'
            value={mallProductSpu.description}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.product.title.category_id")}
            name='category_id'
            value={mallProductSpu.category_id}
            onChange={handleInputChange}
            error={!!errors.category_id}
            helperText={errors.category_id}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.product.title.brand_id")}
            name='brand_id'
            value={mallProductSpu.brand_id}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.mall.product.title.pic_url")}
            name='pic_url'
            value={mallProductSpu.pic_url}
            onChange={handleInputChange}
            error={!!errors.pic_url}
            helperText={errors.pic_url}
          />
          <TextField
            size="small"
            label={t("page.mall.product.title.slider_pic_urls")}
            name='slider_pic_urls'
            value={mallProductSpu.slider_pic_urls}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.product.title.sort")}
            name='sort'
            value={mallProductSpu.sort}
            onChange={handleInputChange}
            error={!!errors.sort}
            helperText={errors.sort}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.product.title.status")}
            name='status'
            value={mallProductSpu.status}
            onChange={handleInputChange}
            error={!!errors.status}
            helperText={errors.status}
          />
          <TextField
            size="small"
            label={t("page.mall.product.title.spec_type")}
            name='spec_type'
            value={mallProductSpu.spec_type}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.product.title.price")}
            name='price'
            value={mallProductSpu.price}
            onChange={handleInputChange}
            error={!!errors.price}
            helperText={errors.price}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.product.title.market_price")}
            name='market_price'
            value={mallProductSpu.market_price}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.product.title.cost_price")}
            name='cost_price'
            value={mallProductSpu.cost_price}
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
            value={mallProductSpu.stock}
            onChange={handleInputChange}
            error={!!errors.stock}
            helperText={errors.stock}
          />
          <TextField
            required
            size="small"
            label={t("page.mall.product.title.delivery_types")}
            name='delivery_types'
            value={mallProductSpu.delivery_types}
            onChange={handleInputChange}
            error={!!errors.delivery_types}
            helperText={errors.delivery_types}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.product.title.delivery_template_id")}
            name='delivery_template_id'
            value={mallProductSpu.delivery_template_id}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.product.title.give_integral")}
            name='give_integral'
            value={mallProductSpu.give_integral}
            onChange={handleInputChange}
            error={!!errors.give_integral}
            helperText={errors.give_integral}
          />
          <TextField
            size="small"
            label={t("page.mall.product.title.sub_commission_type")}
            name='sub_commission_type'
            value={mallProductSpu.sub_commission_type}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.product.title.sales_count")}
            name='sales_count'
            value={mallProductSpu.sales_count}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.product.title.virtual_sales_count")}
            name='virtual_sales_count'
            value={mallProductSpu.virtual_sales_count}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.product.title.browse_count")}
            name='browse_count'
            value={mallProductSpu.browse_count}
            onChange={handleInputChange}
          />
        </FormControl>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 4 }}>{t("global.title.status")}</Typography>
          <Switch sx={{ mr: 2 }} name='status' checked={!mallProductSpu.status} onChange={handleStatusChange} />
          <Typography>{mallProductSpu.status == 0 ? t('global.switch.status.true') : t('global.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default MallProductSpuEdit;