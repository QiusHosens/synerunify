import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createMallProductSpu, listMallProductBrand, listMallProductCategory, MallProductBrandResponse, MallProductCategoryResponse, MallProductSpuRequest } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import SelectTree from '@/components/SelectTree';
import { uploadSystemFile } from '@/api/system_file';
import CustomizedFileUpload, { UploadFile } from '@/components/CustomizedFileUpload';
import CustomizedDictRadioGroup from '@/components/CustomizedDictRadioGroup';
import CustomizedDictCheckboxGroup from '@/components/CustomizedDictCheckboxGroup';
import CustomizedAnchor, { AnchorLinkProps } from '@/components/CustomizedAnchor';
import { Editor } from '@tinymce/tinymce-react';
import CustomizedNumberInput from '@/components/CustomizedNumberInput';

interface AttachmentValues {
  file_id?: number; // 文件ID

  file?: UploadFile | null;
}

interface FormSkuValues {
  properties?: string; // 属性数组，JSON 格式 [{propertId: , valueId: }, {propertId: , valueId: }]
  price?: number; // 商品价格，单位：分
  market_price?: number; // 市场价，单位：分
  cost_price?: number; // 成本价，单位： 分
  bar_code?: string; // SKU 的条形码
  file_id?: number; // 图片
  stock?: number; // 库存
  weight?: number; // 商品重量，单位：kg 千克
  volume?: number; // 商品体积，单位：m^3 平米
  first_brokerage_price?: number; // 一级分销的佣金，单位：分
  second_brokerage_price?: number; // 二级分销的佣金，单位：分
  sales_count?: number; // 商品销量

  file?: UploadFile | null;
}

interface FormValues {
  name: string; // 商品名称
  keyword: string; // 关键字
  introduction: string; // 商品简介
  description: string; // 商品详情
  category_id: number; // 商品分类编号
  brand_id: number; // 商品品牌编号
  file_id?: number; // 商品封面图
  slider_file_ids: string; // 商品轮播图地址数组，以逗号分隔最多上传15张
  sort: number; // 排序字段
  status: number; // 商品状态: 0 上架（开启） 1 下架（禁用） -1 回收
  spec_type: number; // 规格类型：0 单规格 1 多规格
  price: number; // 商品价格，单位使用：分
  market_price: number; // 市场价，单位使用：分
  cost_price: number; // 成本价，单位： 分
  stock: number; // 库存
  delivery_types: string; // 配送方式数组
  delivery_template_id: number; // 物流配置模板编号
  give_integral: number; // 赠送积分
  sub_commission_type: number; // 分销类型
  sales_count: number; // 商品销量
  virtual_sales_count: number; // 虚拟销量
  browse_count: number; // 商品点击量

  skus: FormSkuValues[]; // sku列表

  file?: UploadFile | null; // 商品封面文件
  slider_files: UploadFile[]; // 商品轮播图文件列表
}

interface FormSkuErrors {
  properties?: string; // 属性数组，JSON 格式 [{propertId: , valueId: }, {propertId: , valueId: }]
  price?: string; // 商品价格，单位：分
  market_price?: string; // 市场价，单位：分
  cost_price?: string; // 成本价，单位： 分
  bar_code?: string; // SKU 的条形码
  file_id?: string; // 图片
  stock?: string; // 库存
  weight?: string; // 商品重量，单位：kg 千克
  volume?: string; // 商品体积，单位：m^3 平米
  first_brokerage_price?: string; // 一级分销的佣金，单位：分
  second_brokerage_price?: string; // 二级分销的佣金，单位：分
  sales_count?: string; // 商品销量
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

  skus?: FormSkuErrors[];
}

interface TreeNode {
  id: string | number;
  parent_id: number; // 父菜单ID
  label: string;
  children: TreeNode[];
}

interface MallProductSpuAddProps {
  onSubmit: () => void;
}

const MallProductSpuAdd = forwardRef(({ onSubmit }: MallProductSpuAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('xl');
  const [brands, setBrands] = useState<MallProductBrandResponse[]>([]);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | number>(0);
  const [sliderFiles, setSliderFiles] = useState<AttachmentValues[]>([]);
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    keyword: '',
    introduction: '',
    description: '',
    category_id: 0,
    brand_id: 0,
    slider_file_ids: '',
    sort: 0,
    status: 0,
    spec_type: 0,
    price: 0,
    market_price: 0,
    cost_price: 0,
    stock: 0,
    delivery_types: '',
    delivery_template_id: 0,
    give_integral: 0,
    sub_commission_type: 0,
    sales_count: 0,
    virtual_sales_count: 0,
    browse_count: 0,
    skus: [{}],
    slider_files: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [fileWidth] = useState<number>(240);
  const [fileHeight] = useState<number>(160);

  const anchorContainerRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const editorRef = useRef<any>(null);

  const anchorItems: AnchorLinkProps[] = [
    {
      href: '#basic',
      title: t('page.mall.product.tab.basic.settings'),
    },
    {
      href: '#price',
      title: t('page.mall.product.tab.price.inventory'),
    },
    {
      href: '#logistics',
      title: t('page.mall.product.tab.logistics.settings'),
    },
    {
      href: '#product',
      title: t('page.mall.product.tab.product.detail'),
    },
    {
      href: '#other',
      title: t('page.mall.product.tab.other.settings'),
    },
  ];

  useImperativeHandle(ref, () => ({
    show() {
      listBrands();
      initCategorys();
      setOpen(true);

      setTimeout(() => {
        if (anchorContainerRef.current) {
          setIsMounted(true);
        }
      });
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formValues.name.trim()) {
      newErrors.name = t('global.error.input.please') + t('page.mall.product.title.name');
    }

    if (!formValues.category_id && formValues.category_id != 0) {
      newErrors.category_id = t('global.error.select.please') + t('page.mall.product.title.category');
    }

    if (!formValues.file_id && formValues.file_id != 0) {
      newErrors.file_id = t('global.error.select.please') + t('page.mall.product.title.fil');
    }

    if (!formValues.sort && formValues.sort != 0) {
      newErrors.sort = t('global.error.input.please') + t('page.mall.product.title.sort');
    }

    if (!formValues.price && formValues.price != 0) {
      newErrors.price = t('global.error.input.please') + t('page.mall.product.title.price');
    }

    if (!formValues.cost_price && formValues.cost_price != 0) {
      newErrors.cost_price = t('global.error.input.please') + t('page.mall.product.title.cost.price');
    }

    if (!formValues.stock && formValues.stock != 0) {
      newErrors.stock = t('global.error.input.please') + t('page.mall.product.title.stock');
    }

    if (!formValues.delivery_types.trim()) {
      newErrors.delivery_types = t('global.error.input.please') + t('page.mall.product.title.delivery.types');
    }

    if (!formValues.give_integral && formValues.give_integral != 0) {
      newErrors.give_integral = t('global.error.input.please') + t('page.mall.product.title.give.integral');
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
      slider_file_ids: '',
      sort: 0,
      status: 0,
      spec_type: 0,
      price: 0,
      market_price: 0,
      cost_price: 0,
      stock: 0,
      delivery_types: '',
      delivery_template_id: 0,
      give_integral: 0,
      sub_commission_type: 0,
      sales_count: 0,
      virtual_sales_count: 0,
      browse_count: 0,
      skus: [{}],
      slider_files: [],
    });
    setErrors({});
  }

  const listBrands = async () => {
    const result = await listMallProductBrand();
    if (result.length > 0) {
      setFormValues(prev => ({
        ...prev,
        brand_id: result[0].id
      }));
    }
    setBrands(result);
  }

  const initCategorys = async () => {
    const result = await listMallProductCategory();
    const root = findRoot(result);
    if (root) {
      setSelectedCategoryId(root.id);
      setFormValues(prev => ({
        ...prev,
        category_id: root.id
      }))
    }
    const tree = buildTree(result, root?.parent_id);
    setTreeData(tree);
  }

  const findRoot = (list: MallProductCategoryResponse[]): MallProductCategoryResponse | undefined => {
    const ids = list.map(item => item.id);
    const parentIds = list.map(item => item.parent_id);
    const rootIds = parentIds.filter(id => ids.indexOf(id) < 0);
    if (rootIds.length > 0) {
      const rootId = rootIds[0];
      return list.filter(item => rootId === item.parent_id)[0];
    }
    return undefined;
  }

  const buildTree = (list: MallProductCategoryResponse[], rootParentId: number | undefined): TreeNode[] => {
    const map: { [key: string]: TreeNode } = {};
    const tree: TreeNode[] = [];

    for (const item of list) {
      map[item.id] = {
        id: item.id,
        parent_id: item.parent_id,
        label: item.name,
        children: [],
      };
    }

    for (const item of list) {
      if (item.parent_id === rootParentId) {
        tree.push(map[item.id]);
      } else if (map[item.parent_id]) {
        map[item.parent_id].children.push(map[item.id]);
      }
    }

    return tree;
  }

  const handleSubmit = async () => {
    if (editorRef.current) {
      console.log('editor content', editorRef.current.getContent()); // 获取 HTML 内容
    }
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
    setFormValues((prev) => ({
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

  const handleNumberChange = (value: number, name?: string) => {
    if (name) {
      setFormValues((prev) => ({ ...prev, [name]: value }));

      if (errors[name as keyof FormErrors]) {
        setErrors(prev => ({
          ...prev,
          [name]: undefined
        }));
      }
    }
  };

  const handleSkuInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleCheckboxChange = (name: string | undefined, checkedValues: any[]) => {
    if (!name) {
      return;
    }
    const value = checkedValues.join(',');
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleChange = (name: string, node: TreeNode) => {
    setSelectedCategoryId(node.id);
    setFormValues(prev => ({
      ...prev,
      [name]: node.id
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleFileChange = useCallback(async (file: UploadFile | null, action: 'upload' | 'remove') => {
    if (action === 'upload' && file) {
      // 更新文件列表,增加一个附件,等待上传完成后在写入信息
      setFormValues((prev) => {
        return { ...prev, file };
      })

      // 上传文件
      try {
        const result = await uploadSystemFile(file.file, (progress) => {
          setFormValues((prev) => {
            return { ...prev, file: { ...prev.file!, progress } };
          });
        });

        // 上传完成
        setFormValues((prev) => {
          return { ...prev, file_id: result, file: { ...prev.file!, status: 'done' as const } };
        });
      } catch (error) {
        console.error('upload file error', error);
        // 上传失败
        setFormValues((prev) => {
          return { ...prev, file: { ...prev.file!, status: 'error' as const } };
        });
      }
    } else if (action === 'remove') {
      // 删除文件并移除上传框
      setFormValues((prev) => {
        return { ...prev, file: undefined };
      });
    }
  }, []);

  const handleSliderFileChange = useCallback(async (file: UploadFile | null, action: 'upload' | 'remove', index: number) => {
    if (action === 'upload' && file) {
      // 更新文件列表,增加一个附件,等待上传完成后在写入信息
      setSliderFiles((prev) => {
        return [...prev, { file }];
      })

      // 上传文件
      try {
        const result = await uploadSystemFile(file.file, (progress) => {
          setSliderFiles((prev) =>
            prev.map((item, idx) => {
              if (idx !== index) return item;
              const updatedItem = { ...item, file: { ...item.file!, progress } };
              return updatedItem;
            })
          );
        });

        // 上传完成
        setSliderFiles((prev) =>
          prev.map((item, idx) => {
            if (idx !== index) return item;
            const updatedItem = { ...item, file_id: result, file: { ...item.file!, status: 'done' as const } };
            return updatedItem;
          })
        );
      } catch (error) {
        console.error('upload file error', error);
        // 上传失败
        setSliderFiles((prev) =>
          prev.map((item, idx) => {
            if (idx !== index) return item;
            const updatedItem = { ...item, file: { ...item.file!, status: 'error' as const } };
            return updatedItem;
          })
        );
      }
    } else if (action === 'remove') {
      // 删除文件并移除上传框
      setSliderFiles((prev) =>
        prev.filter((_, idx) => idx !== index)
      );
    }
  }, []);

  const ProductBox = (({ sku, index }: { sku: FormSkuValues, index: number }) => {
    return (
      <Stack gap={2}>
        <CustomizedFileUpload
          canRemove={false}
          showFilename={false}
          id={'file-upload'}
          accept=".jpg,jpeg,.png"
          maxSize={100}
          onChange={(file, action) => handleFileChange(file, action)}
          file={sku.file}
          width={fileWidth}
          height={fileHeight}
        />
        <TextField
          required
          size="small"
          label={t("page.mall.product.sku.title.bar.code")}
          name='bar_code'
          value={sku.bar_code}
          onChange={handleSkuInputChange}
          error={!!(errors.skus && errors.skus[index].bar_code)}
          helperText={errors.skus && errors.skus[index].bar_code}
        />
        <TextField
          required
          size="small"
          type="number"
          label={t("page.mall.product.sku.title.price")}
          name='price'
          value={sku.price}
          onChange={handleSkuInputChange}
          error={!!(errors.skus && errors.skus[index].price)}
          helperText={errors.skus && errors.skus[index].price}
        />
        <TextField
          required
          size="small"
          type="number"
          label={t("page.mall.product.sku.title.market.price")}
          name='market_price'
          value={sku.market_price}
          onChange={handleSkuInputChange}
          error={!!(errors.skus && errors.skus[index].market_price)}
          helperText={errors.skus && errors.skus[index].market_price}
        />
        <TextField
          required
          size="small"
          type="number"
          label={t("page.mall.product.sku.title.cost.price")}
          name='cost_price'
          value={sku.cost_price}
          onChange={handleSkuInputChange}
          error={!!(errors.skus && errors.skus[index].cost_price)}
          helperText={errors.skus && errors.skus[index].cost_price}
        />
        <TextField
          required
          size="small"
          type="number"
          label={t("page.mall.product.sku.title.stock")}
          name='stock'
          value={sku.stock}
          onChange={handleSkuInputChange}
          error={!!(errors.skus && errors.skus[index].stock)}
          helperText={errors.skus && errors.skus[index].stock}
        />
        <TextField
          required
          size="small"
          type="number"
          label={t("page.mall.product.sku.title.weight")}
          name='weight'
          value={sku.weight}
          onChange={handleSkuInputChange}
          error={!!(errors.skus && errors.skus[index].weight)}
          helperText={errors.skus && errors.skus[index].weight}
        />
        <TextField
          required
          size="small"
          type="number"
          label={t("page.mall.product.sku.title.volume")}
          name='volume'
          value={sku.volume}
          onChange={handleSkuInputChange}
          error={!!(errors.skus && errors.skus[index].volume)}
          helperText={errors.skus && errors.skus[index].volume}
        />
      </Stack>
    );
  });

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
        // noValidate
        // component="form"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          height: '70vh'
          // alignItems: 'start',
          // flexDirection: 'column',
          // m: 'auto',
          // width: 'fit-content',
        }}
      >
        <Stack direction='row'>
          <Box
            sx={{
              width: 120,
              flexShrink: 0,
              // borderRight: 1,
              // borderColor: 'divider',
              pr: 2,
              mr: 2,
            }}
          >
            {isMounted && anchorContainerRef.current && <CustomizedAnchor
              showInkInFixed
              items={anchorItems}
              offsetTop={0}
              getContainer={() => {
                // 使用ref获取滚动容器，更加准确
                console.debug('container ref:', anchorContainerRef.current);
                return anchorContainerRef.current || window;
              }}
              onChange={(activeLink) => {
                console.debug('active link:', activeLink);
              }}
              onClick={(e, link) => {
                console.debug('click link:', link);
              }}
            />}
          </Box>
          <Box ref={anchorContainerRef} sx={{ flex: 1, overflow: 'auto' }}>
            <Box id="basic" sx={{ mb: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                {t('page.mall.product.tab.basic.settings')}
              </Typography>
              <Box
                noValidate
                component="form"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  // m: 'auto',
                  width: 'fit-content',
                }}
              >
                <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '240px' } }}>
                  <TextField
                    required
                    multiline
                    minRows={2}
                    size="small"
                    label={t("page.mall.product.title.name")}
                    name='name'
                    value={formValues.name}
                    onChange={handleInputChange}
                    error={!!errors.name}
                    helperText={errors.name}
                  />
                </FormControl>
                <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiSelect-root': { width: '240px' } }}>
                  <SelectTree
                    expandToSelected
                    name='parent_id'
                    size="small"
                    label={t('common.title.parent')}
                    treeData={treeData}
                    value={selectedCategoryId}
                    onChange={(name, node) => handleChange(name, node as TreeNode)}
                  />
                </FormControl>
                <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiSelect-root': { width: '240px' } }}>
                  <InputLabel required size="small" id="brand-select-label">{t("page.mall.product.title.brand")}</InputLabel>
                  <Select
                    required
                    size="small"
                    labelId="brand-select-label"
                    label={t("page.mall.product.title.brand")}
                    name='brand_id'
                    value={formValues.brand_id}
                    onChange={(e) => handleSelectChange(e)}
                  >
                    {brands.map(item => (<MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>))}
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '240px' } }}>
                  <TextField
                    size="small"
                    label={t("page.mall.product.title.keyword")}
                    name='keyword'
                    value={formValues.keyword}
                    onChange={handleInputChange}
                  />
                  <TextField
                    multiline
                    minRows={2}
                    size="small"
                    label={t("page.mall.product.title.introduction")}
                    name='introduction'
                    value={formValues.introduction}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  {t('page.mall.product.title.file')}
                </Typography>
                <CustomizedFileUpload
                  canRemove={false}
                  showFilename={false}
                  id={'file-upload'}
                  accept=".jpg,jpeg,.png"
                  maxSize={100}
                  onChange={(file, action) => handleFileChange(file, action)}
                  file={formValues.file}
                  width={fileWidth}
                  height={fileHeight}
                />
                <Typography sx={{ mt: 2, mb: 1 }}>
                  {t('page.mall.product.title.slider.files')}
                </Typography>
                <Box
                  gap={2}
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                  }}
                >
                  {sliderFiles.map((item, index) => (
                    <Box key={index}>
                      <CustomizedFileUpload
                        showFilename={false}
                        id={'file-upload-' + index}
                        accept=".jpg,jpeg,.png"
                        maxSize={100}
                        onChange={(files, action) => handleSliderFileChange(files, action, index)}
                        file={item.file}
                        width={fileWidth}
                        height={fileHeight}
                      />
                    </Box>
                  ))}
                  <Box>
                    <CustomizedFileUpload
                      showFilename={false}
                      id={'file-upload-' + sliderFiles.length}
                      accept=".jpg,jpeg,.png"
                      maxSize={100}
                      onChange={(file, action) => handleSliderFileChange(file, action, sliderFiles.length)}
                      width={fileWidth}
                      height={fileHeight}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box id="price" sx={{ mb: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                {t('page.mall.product.tab.price.inventory')}
              </Typography>
              <Box
                noValidate
                component="form"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  // m: 'auto',
                  width: 'fit-content',
                }}
              >
                <CustomizedDictRadioGroup
                  id="commission-row-radio-buttons-group-label"
                  name='sub_commission_type'
                  dict_type='sub_commission_type'
                  label={t('page.mall.product.title.sub.commission.type')}
                  value={formValues.sub_commission_type}
                  onChange={handleInputChange}
                />
                <CustomizedDictRadioGroup
                  id="spec-row-radio-buttons-group-label"
                  name='spec_type'
                  dict_type='spec_type'
                  label={t('page.mall.product.title.spec.type')}
                  value={formValues.spec_type}
                  onChange={handleInputChange}
                />
                {formValues.skus.map((sku, index) => (
                  <ProductBox key={index} sku={sku} index={index}></ProductBox>
                ))}
              </Box>
            </Box>
            <Box id="logistics" sx={{ mb: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                {t('page.mall.product.tab.logistics.settings')}
              </Typography>
              <Box
                noValidate
                component="form"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  // m: 'auto',
                  width: 'fit-content',
                }}
              >
                <CustomizedDictCheckboxGroup
                  id="delivery-row-checkbox-buttons-group-label"
                  label={t("page.mall.product.title.delivery.types")}
                  name='delivery_types'
                  value={formValues.delivery_types}
                  dict_type='delivery_type'
                  onChange={handleCheckboxChange}
                />
              </Box>
            </Box>
            <Box id="product" sx={{ mb: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                {t('page.mall.product.tab.product.detail')}
              </Typography>
              <Box sx={{
                width: 750,
                '& .tox-promotion-button': { display: 'none !important' },
                '& .tox-statusbar__branding': { display: 'none' }
              }}>
                <Editor
                  apiKey='f88rshir3x1vuar3lr0tj1vaq6muvonldxm25o6wxr23vy96'
                  onInit={(_evt, editor) => (editorRef.current = editor)}
                  initialValue="<p>在这里输入内容...</p>"
                  init={{
                    height: 600,
                    language: "zh_CN",
                    language_url: "/tinymce/langs/zh_CN.js",
                    plugins: [
                      // Core editing features
                      'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                      // Your account includes a free trial of TinyMCE premium features
                      // Try the most popular premium features until Sep 3, 2025:
                      // 'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'advtemplate', 'ai', 'uploadcare', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
                    ],
                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                    content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    // tinycomments_mode: 'embedded',
                    // tinycomments_author: 'Author name',
                    // mergetags_list: [
                    //   { value: 'First.Name', title: 'First Name' },
                    //   { value: 'Email', title: 'Email' },
                    // ],
                    // ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                    // uploadcare_public_key: '0768186df57eccd6ad6c',
                  }}
                // initialValue="Welcome to TinyMCE!"
                />
              </Box>
            </Box>
            <Box id="other" sx={{ mb: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                {t('page.mall.product.tab.other.settings')}
              </Typography>
              <Box
                noValidate
                component="form"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  // m: 'auto',
                  width: 'fit-content',
                }}
              >
                <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '240px' } }}>
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
                    required
                    size="small"
                    type="number"
                    label={t("page.mall.product.title.give.integral")}
                    name='give_integral'
                    value={formValues.give_integral}
                    onChange={handleInputChange}
                    error={!!errors.give_integral}
                    helperText={errors.give_integral}
                  />
                  <TextField
                    size="small"
                    type="number"
                    label={t("page.mall.product.title.virtual.sales.count")}
                    name='virtual_sales_count'
                    value={formValues.virtual_sales_count}
                    onChange={handleInputChange}
                  />
                  <CustomizedNumberInput
                    step={1}
                    min={0}
                    label={t("page.mall.product.title.virtual.sales.count")}
                    name='virtual_sales_count'
                    value={formValues.virtual_sales_count}
                    onChange={handleNumberChange}
                  />
                </FormControl>
              </Box>
            </Box>
          </Box>
          <Box>
            预览
          </Box>
        </Stack>
      </Box>
    </CustomizedDialog >
  )
});

export default MallProductSpuAdd;