import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createErpProduct, ErpProductCategoryResponse, ErpProductRequest, ErpProductUnitResponse, listErpProductCategory, listErpProductUnit } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import SelectTree from '@/components/SelectTree';

interface FormValues {
  product_code: string; // 产品编码
  name: string; // 产品名称
  category_id?: number; // 产品分类ID
  unit_id?: number; // 产品单位ID
  status: number; // 状态
  barcode: string; // 条码
  specification: string; // 规格
  shelf_life_days: number; // 保质期天数
  weight: number; // 重量,kg,精确到百分位
  purchase_price: number; // 采购价格
  sale_price: number; // 销售价格
  min_price: number; // 最低价格
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

interface TreeNode {
  id: string | number;
  parent_id: number;
  label: string;
  children: TreeNode[];
}

interface ErpProductAddProps {
  onSubmit: () => void;
}

const ErpProductAdd = forwardRef(({ onSubmit }: ErpProductAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | number>(0);
  const [units, setUnits] = useState<ErpProductUnitResponse[]>([]);
  const [formValues, setFormValues] = useState<FormValues>({
    product_code: '',
    name: '',
    status: 0,
    barcode: '',
    specification: '',
    shelf_life_days: 0,
    weight: 0,
    purchase_price: 0,
    sale_price: 0,
    min_price: 0,
    min_stock: 0,
    remarks: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show() {
      initCategorys();
      initUnits();
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const initUnits = async () => {
    const result = await listErpProductUnit();
    setUnits(result);
  }

  const initCategorys = async () => {
    const result = await listErpProductCategory();
    const tree = buildTree(result, 0);
    setTreeData(tree);
  }

  const buildTree = (list: ErpProductCategoryResponse[], rootParentId: number | undefined): TreeNode[] => {
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formValues.name.trim()) {
      newErrors.name = t('global.error.input.please') + t('common.title.name');
    }

    if (!formValues.min_stock && formValues.min_stock != 0) {
      newErrors.min_stock = t('global.error.input.please') + t('page.erp.product.list.title.min.stock');
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
      status: 0,
      barcode: '',
      specification: '',
      shelf_life_days: 0,
      weight: 0,
      purchase_price: 0,
      sale_price: 0,
      min_price: 0,
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

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
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

    // Clear error when user starts typing
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
          <Grid container spacing={2} sx={{ '& .MuiGrid-root': { display: 'flex', justifyContent: "center", alignItems: "center", } }}>
            <Grid size={{ xs: 12, md: 6 }}>
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
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label={t("page.erp.product.list.title.product.code")}
                name='product_code'
                value={formValues.product_code}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiSelect-root': { width: '200px' } }}>
                <SelectTree
                  expandToSelected
                  size="small"
                  name='category_id'
                  label={t("page.erp.product.list.title.category")}
                  treeData={treeData}
                  value={selectedCategoryId}
                  onChange={(name, node) => handleChange(name, node as TreeNode)}
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiSelect-root': { width: '200px' } }}>
                <InputLabel size="small" id="unit-select-label">{t("page.erp.product.list.title.unit")}</InputLabel>
                <Select
                  size="small"
                  labelId="unit-select-label"
                  name="unit_id"
                  value={formValues.unit_id}
                  onChange={(e) => handleSelectChange(e)}
                  label={t("page.erp.product.list.title.unit")}
                >
                  {units.map(item => (<MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label={t("page.erp.product.list.title.barcode")}
                name='barcode'
                value={formValues.barcode}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label={t("page.erp.product.list.title.specification")}
                name='specification'
                value={formValues.specification}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                type="number"
                label={t("page.erp.product.list.title.shelf.life.days")}
                name='shelf_life_days'
                value={formValues.shelf_life_days}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                type="number"
                label={t("page.erp.product.list.title.weight")}
                name='weight'
                value={formValues.weight}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                type="number"
                label={t("page.erp.product.list.title.purchase.price")}
                name='purchase_price'
                value={formValues.purchase_price}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                type="number"
                label={t("page.erp.product.list.title.sale.price")}
                name='sale_price'
                value={formValues.sale_price}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                type="number"
                label={t("page.erp.product.list.title.min.price")}
                name='min_price'
                value={formValues.min_price}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
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
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label={t("common.title.remark")}
                name='remarks'
                value={formValues.remarks}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 4 }}>{t("common.title.status")}</Typography>
                <Switch sx={{ mr: 2 }} name='status' checked={!formValues.status} onChange={handleStatusChange} />
                <Typography>{formValues.status == 0 ? t('common.switch.status.true') : t('common.switch.status.false')}</Typography>
              </Box>
            </Grid>
          </Grid>
        </FormControl>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpProductAdd;