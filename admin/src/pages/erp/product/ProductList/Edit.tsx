import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpProductCategoryResponse, ErpProductRequest, ErpProductResponse, ErpProductUnitResponse, listErpProductCategory, listErpProductUnit, updateErpProduct } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import SelectTree from '@/components/SelectTree';

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

interface ErpProductEditProps {
  onSubmit: () => void;
}

const ErpProductEdit = forwardRef(({ onSubmit }: ErpProductEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | number>(0);
  const [units, setUnits] = useState<ErpProductUnitResponse[]>([]);
  const [erpProduct, setErpProduct] = useState<ErpProductRequest>({
    id: 0,
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
    show(erpProduct: ErpProductResponse) {
      initForm(erpProduct);
      initCategorys(erpProduct);
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

  const initCategorys = async (erpProduct: ErpProductResponse) => {
    const result = await listErpProductCategory();
    setSelectedCategoryId(erpProduct.category_id);
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

    if (!erpProduct.name.trim()) {
      newErrors.name = t('page.erp.product.list.error.name');
    }

    if (!erpProduct.min_stock && erpProduct.min_stock != 0) {
      newErrors.min_stock = t('page.erp.product.list.error.min.stock');
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

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setErpProduct(prev => ({
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
    setErpProduct(prev => ({
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
      title={t('global.operate.edit') + t('global.page.erp.product.list')}
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
          <Grid container spacing={2} sx={{ '& .MuiGrid-root': { display: 'flex', justifyContent: "center", alignItems: "center", } }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                required
                size="small"
                label={t("page.erp.product.list.title.name")}
                name='name'
                value={erpProduct.name}
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
                value={erpProduct.product_code}
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
                  value={erpProduct.unit_id}
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
                value={erpProduct.barcode}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label={t("page.erp.product.list.title.specification")}
                name='specification'
                value={erpProduct.specification}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                type="number"
                label={t("page.erp.product.list.title.shelf.life.days")}
                name='shelf_life_days'
                value={erpProduct.shelf_life_days}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                type="number"
                label={t("page.erp.product.list.title.weight")}
                name='weight'
                value={erpProduct.weight}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                type="number"
                label={t("page.erp.product.list.title.purchase.price")}
                name='purchase_price'
                value={erpProduct.purchase_price}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                type="number"
                label={t("page.erp.product.list.title.sale.price")}
                name='sale_price'
                value={erpProduct.sale_price}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                type="number"
                label={t("page.erp.product.list.title.min.price")}
                name='min_price'
                value={erpProduct.min_price}
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
                value={erpProduct.min_stock}
                onChange={handleInputChange}
                error={!!errors.min_stock}
                helperText={errors.min_stock}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label={t("page.erp.product.list.title.remarks")}
                name='remarks'
                value={erpProduct.remarks}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 4 }}>{t("global.title.status")}</Typography>
                <Switch sx={{ mr: 2 }} name='status' checked={!erpProduct.status} onChange={handleStatusChange} />
                <Typography>{erpProduct.status == 0 ? t('global.switch.status.true') : t('global.switch.status.false')}</Typography>
              </Box>
            </Grid>
          </Grid>
        </FormControl>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpProductEdit;