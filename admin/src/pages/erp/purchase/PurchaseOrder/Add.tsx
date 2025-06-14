import { Box, Button, Card, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, styled, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createErpPurchaseOrder, ErpProductResponse, ErpPurchaseOrderRequest, ErpSettlementAccountResponse, ErpSupplierResponse, listErpProduct, listErpSettlementAccount, listErpSupplier } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';
import DeleteIcon from '@/assets/image/svg/delete.svg';

interface FormProductValues {
  rowNumber: number; // 行号,用作key,避免失去焦点
  product_id?: number; // 产品ID
  quantity: number; // 数量
  unit_price: number; // 单价
  subtotal: number; // 小计
  tax_rate: number; // 税率,精确到万分位
  remarks: string; // 备注
  product?: ErpProductResponse | undefined; // 产品
}

interface FormAttachmentValues {
  file_id: number; // 文件ID
  remarks: string; // 备注
}

interface FormValues {
  supplier_id?: number; // 供应商ID
  purchase_date: string; // 采购日期
  total_amount: number; // 总金额
  discount_rate: number; // 优惠率（百分比，1000表示10.00%）
  settlement_account_id?: number; // 结算账户ID
  deposit: number; // 定金
  remarks: string; // 备注
  purchase_products: FormProductValues[]; // 采购的产品列表
  purchase_attachment: FormAttachmentValues[]; // 采购的附件列表
}

interface FormProductErrors {
  rowNumber: number; // 行号
  product_id?: string; // 产品ID
  quantity?: string; // 数量
  unit_price?: string; // 单价
  tax_rate?: string; // 税率,精确到万分位
}

interface FormErrors {
  supplier_id?: string; // 供应商
  purchase_date?: string; // 采购日期
  total_amount?: string; // 总金额
  order_status?: string; // 订单状态 (0=pending, 1=completed, 2=cancelled)

  purchase_products: FormProductErrors[]; // 采购的产品列表
}

interface ErpPurchaseOrderAddProps {
  onSubmit: () => void;
}

const ErpPurchaseOrderAdd = forwardRef(({ onSubmit }: ErpPurchaseOrderAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('xl');
  const [suppliers, setSuppliers] = useState<ErpSupplierResponse[]>([]);
  const [settlementAccounts, setSettlementAccounts] = useState<ErpSettlementAccountResponse[]>([]);
  const [products, setProducts] = useState<ErpProductResponse[]>([]);
  const [purchaseDate, setPurchaseDate] = useState<Dayjs | null>();
  const [formValues, setFormValues] = useState<FormValues>({
    purchase_date: '',
    total_amount: 0,
    discount_rate: 0,
    deposit: 0,
    remarks: '',
    purchase_products: [],
    purchase_attachment: [],
  });
  const [purchaseProducts, setPurchaseProducts] = useState<FormProductValues[]>([]);
  const [errors, setErrors] = useState<FormErrors>({
    purchase_products: []
  });
  // const [rowNumber, setRowNumber] = useState<number>(0);
  let rowNumber = 1;

  const TableContainer = styled(Box)({
    display: 'table',
    width: '100%',
    // tableLayout: 'fixed', // 确保列宽均分或固定
  });

  // 自定义 Table Row
  const TableRow = styled(Box)({
    display: 'table-row',
  });

  // 自定义 Table Cell
  const TableCell = styled(Box)(({ theme }) => ({
    display: 'table-cell',
    padding: theme.spacing(1),
    textAlign: 'center',
    // width: `${100 / 13}%`, // 每列宽度約為 100% / 13
  }));

  useImperativeHandle(ref, () => ({
    show() {
      initSuppliers();
      initSettlementAccounts();
      initProducts();
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const initSuppliers = async () => {
    const result = await listErpSupplier();
    setSuppliers(result);
  }

  const initSettlementAccounts = async () => {
    const result = await listErpSettlementAccount();
    setSettlementAccounts(result);
  }

  const initProducts = async () => {
    const result = await listErpProduct();
    setProducts(result);
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      purchase_products: []
    };

    if (!formValues.supplier_id && formValues.supplier_id != 0) {
      newErrors.supplier_id = t('page.erp.purchase.order.error.supplier');
    }

    if (!formValues.purchase_date.trim()) {
      newErrors.purchase_date = t('page.erp.purchase.order.error.purchase.date');
    }

    if (!formValues.total_amount && formValues.total_amount != 0) {
      newErrors.total_amount = t('page.erp.purchase.order.error.total.amount');
    }

    // 采购的产品列表
    for (let index = 0, len = formValues.purchase_products.length; index < len; index++) {
      const purchase_product = formValues.purchase_products[index];
      if (!purchase_product.product_id && purchase_product.product_id != 0) {
        if (newErrors.purchase_products && newErrors.purchase_products[index]) {
          newErrors.purchase_products[index].product_id = t('page.erp.purchase.order.detail.error.product');
        }
      }

      if (!purchase_product.quantity) {
        if (newErrors.purchase_products && newErrors.purchase_products[index]) {
          newErrors.purchase_products[index].quantity = t('page.erp.purchase.order.detail.error.quantity');
        }
      }

      if (!purchase_product.unit_price && purchase_product.unit_price != 0) {
        if (newErrors.purchase_products && newErrors.purchase_products[index]) {
          newErrors.purchase_products[index].unit_price = t('page.erp.purchase.order.detail.error.unit.price');
        }
      }

      if (!purchase_product.tax_rate && purchase_product.tax_rate != 0) {
        if (newErrors.purchase_products && newErrors.purchase_products[index]) {
          newErrors.purchase_products[index].tax_rate = t('page.erp.purchase.order.detail.error.tax.rate');
        }
      }
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
      purchase_date: '',
      total_amount: 0,
      discount_rate: 0,
      deposit: 0,
      remarks: '',
      purchase_products: [],
      purchase_attachment: [],
    });
    setErrors({
      purchase_products: []
    });
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await createErpPurchaseOrder(formValues as ErpPurchaseOrderRequest);
      handleClose();
      onSubmit();
    }
  };

  const handleSubmitAndContinue = async () => {
    if (validateForm()) {
      await createErpPurchaseOrder(formValues as ErpPurchaseOrderRequest);
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

  const handleDateTimeChange = (value: PickerValue) => {
    setPurchaseDate(value);
    if (!value) {
      return;
    }
    const name = 'purchase_date';
    const time = value.format('YYYY-MM-DD HH:mm:ss');
    setFormValues(prev => ({
      ...prev,
      [name]: time
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleAddPurchaseProduct = () => {
    // setRowNumber(rowNumber + 1);
    rowNumber += 1;
    // 设置error
    const newProductError: FormProductErrors = {
      rowNumber: rowNumber
    }
    let productErrors: FormProductErrors[] = [newProductError];
    if (errors.purchase_products) {
      productErrors = [...errors.purchase_products, newProductError];
    }
    setErrors(prev => ({
      ...prev,
      purchase_products: productErrors,
    }));
    // 设置产品

    // const newProduct: FormProductValues = {
    //   rowNumber: rowNumber + 1,
    //   quantity: 1,
    //   unit_price: 0,
    //   subtotal: 0,
    //   tax_rate: 0,
    //   remarks: '',
    // }
    // let products: FormProductValues[] = [newProduct];
    // if (formValues.purchase_products) {
    //   products = [...formValues.purchase_products, newProduct];
    // }
    // setFormValues(prev => ({
    //   ...prev,
    //   purchase_products: products,
    // }));
    const newProduct: FormProductValues = {
      rowNumber: rowNumber,
      product_id: products.length > 0 ? products[0].id : undefined,
      quantity: 1,
      unit_price: 0,
      subtotal: 0,
      tax_rate: 0,
      remarks: '',
    }
    setPurchaseProducts([...purchaseProducts, newProduct]);
  }

  const handleClickProductDelete = (index: number) => {
    // 设置error
    const productErrors = errors.purchase_products;
    if (productErrors) {
      productErrors.splice(index + 1, 1);
      setErrors(prev => ({
        ...prev,
        purchase_products: productErrors,
      }));
    }

    // 设置产品
    const products: FormProductValues[] = formValues.purchase_products;
    if (products) {
      products.splice(index + 1, 1);
      setFormValues(prev => ({
        ...prev,
        purchase_products: products,
      }));
    }
  }

  const findProduct = (product_id: number): ErpProductResponse | undefined => {
    for (const product of products) {
      if (product.id == product_id) {
        return product;
      }
    }
    return undefined;
  }

  const handleProductSelectChange = (e: SelectChangeEvent<number>, index: number) => {
    const { value } = e.target;

    const p = findProduct(value);
    // setFormValues((prev) => ({
    //   ...prev,
    //   purchase_products: prev.purchase_products.map((item, idx) =>
    //     idx == index ? { ...item, product_id: value, product: p } : item
    //   )
    // }));

    setPurchaseProducts(prev => prev.map((item, idx) =>
      idx == index ? { ...item, product_id: value, product: p } : item
    ));

    setErrors((prev) => ({
      ...prev,
      purchase_products: prev.purchase_products ? prev.purchase_products.map((item, idx) =>
        idx == index ? { ...item, product_id: undefined } : item
      ) : []
    }));
  };

  const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value, type } = e.target;

    if (type == 'number') {
      const numberValue = Number(value);
      // setFormValues((prev) => ({
      //   ...prev,
      //   purchase_products: prev.purchase_products.map((item, idx) =>
      //     idx == index ? { ...item, [name]: numberValue } : item
      //   )
      // }));
      setPurchaseProducts(prev => prev.map((item, idx) =>
        idx == index ? { ...item, [name]: numberValue } : item
      ));
    } else {
      // setFormValues((prev) => ({
      //   ...prev,
      //   purchase_products: prev.purchase_products.map((item, idx) =>
      //     idx == index ? { ...item, [name]: value } : item
      //   )
      // }));
      setPurchaseProducts(prev => prev.map((item, idx) =>
        idx == index ? { ...item, [name]: value } : item
      ));
    }

    // setErrors((prev) => ({
    //   ...prev,
    //   purchase_products: prev.purchase_products ? prev.purchase_products.map((item, idx) =>
    //     idx == index ? { ...item, [name]: undefined } : item
    //   ) : []
    // }));
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.add') + t('global.page.erp.purchase.order')}
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
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '100%' } }}>
          <Grid container rowSpacing={2} columnSpacing={4} sx={{ '& .MuiGrid-root': { display: 'flex', justifyContent: "center", alignItems: "center", } }}>
            <Grid size={{ xs: 12, md: 12 / 5 }}>
              <TextField
                size="small"
                label={t("page.erp.purchase.order.placeholder.order.number")}
                disabled
              />
            </Grid>
            <Grid size={{ xs: 12, md: 12 / 5 }}>
              <FormControl sx={{ mt: 2, minWidth: 120, width: '100%', '& .MuiSelect-root': { width: '100%' } }}>
                <InputLabel required size="small" id="supplier-select-label" htmlFor="supplier-helper">{t("page.erp.purchase.order.title.supplier")}</InputLabel>
                <Select
                  required
                  size="small"
                  id="supplier-helper"
                  labelId="supplier-select-label"
                  name="supplier_id"
                  value={formValues.supplier_id}
                  onChange={(e) => handleSelectChange(e)}
                  label={t("page.erp.purchase.order.title.supplier")}
                  error={!!errors.supplier_id}
                >
                  {suppliers.map(item => (<MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>))}
                </Select>
                <FormHelperText sx={{ color: 'error.main' }} id="supplier-helper">{errors.supplier_id}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 12 / 5 }}>
              <FormControl sx={{ minWidth: 120, width: '100%', '& .MuiPickersTextField-root': { mt: 2, width: '100%' } }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    name='purchase_date'
                    label={t("page.erp.purchase.order.title.purchase.date")}
                    value={purchaseDate}
                    onChange={(value) => handleDateTimeChange(value)}
                    slotProps={{
                      textField: {
                        size: 'small',
                        required: true,
                        error: !!errors.purchase_date,
                        helperText: errors.purchase_date,
                      },
                      openPickerButton: {
                        sx: {
                          mr: -1,
                          '& .MuiSvgIcon-root': {
                            fontSize: '1rem',
                          }
                        }
                      },
                    }}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 12 / 5 }}>
              <TextField
                required
                size="small"
                type="number"
                label={t("page.erp.purchase.order.title.total.amount")}
                name='total_amount'
                value={formValues.total_amount}
                onChange={handleInputChange}
                error={!!errors.total_amount}
                helperText={errors.total_amount}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 12 / 5 }}>
              <TextField
                size="small"
                type="number"
                label={t("page.erp.purchase.order.title.discount.rate")}
                name='discount_rate'
                value={formValues.discount_rate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 12 / 5 }}>
              <FormControl sx={{ mt: 2, minWidth: 120, width: '100%', '& .MuiSelect-root': { width: '100%' } }}>
                <InputLabel size="small" id="settlement-account-select-label">{t("page.erp.purchase.order.title.settlement.account")}</InputLabel>
                <Select
                  size="small"
                  labelId="settlement-account-select-label"
                  name="settlement_account_id"
                  value={formValues.settlement_account_id}
                  onChange={(e) => handleSelectChange(e)}
                  label={t("page.erp.purchase.order.title.settlement.account")}
                >
                  {settlementAccounts.map(item => (<MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 12 / 5 }}>
              <TextField
                size="small"
                type="number"
                label={t("page.erp.purchase.order.title.deposit")}
                name='deposit'
                value={formValues.deposit}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 12 / 5 }}>
              <TextField
                size="small"
                label={t("page.erp.purchase.order.title.remarks")}
                name='remarks'
                value={formValues.remarks}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </FormControl>

        <Typography variant="body1" sx={{ mt: 3, fontSize: '1rem', fontWeight: 500 }}>
          {t('page.erp.purchase.order.title.check.list')}
        </Typography>
        <Card variant="outlined" sx={{ width: "100%", mt: 1, p: 2 }}>
          <TableContainer>
            <TableRow>
              <TableCell sx={{ width: 50 }}>
                <Typography variant="body1">
                  {t('page.erp.purchase.order.detail.title.no')}
                </Typography>
              </TableCell>
              <TableCell sx={{ width: 100 }}>
                <Typography variant="body1">
                  {t('page.erp.purchase.order.detail.title.product')}
                </Typography>
              </TableCell>
              <TableCell sx={{ width: 100 }}>
                <Typography variant="body1">
                  {t('page.erp.purchase.order.detail.title.stock')}
                </Typography>
              </TableCell>
              <TableCell sx={{ width: 100 }}>
                <Typography variant="body1">
                  {t('page.erp.purchase.order.detail.title.barcode')}
                </Typography>
              </TableCell>
              <TableCell sx={{ width: 100 }}>
                <Typography variant="body1">
                  {t('page.erp.purchase.order.detail.title.unit')}
                </Typography>
              </TableCell>
              <TableCell sx={{ width: 200 }}>
                <Typography variant="body1">
                  {t('page.erp.purchase.order.detail.title.remarks')}
                </Typography>
              </TableCell>
              <TableCell sx={{ width: 150 }}>
                <Typography variant="body1">
                  {t('page.erp.purchase.order.detail.title.quantity')}
                </Typography>
              </TableCell>
              <TableCell sx={{ width: 150 }}>
                <Typography variant="body1">
                  {t('page.erp.purchase.order.detail.title.unit.price')}
                </Typography>
              </TableCell>
              <TableCell sx={{ width: 100 }}>
                <Typography variant="body1">
                  {t('page.erp.purchase.order.detail.title.subtotal')}
                </Typography>
              </TableCell>
              <TableCell sx={{ width: 100 }}>
                <Typography variant="body1">
                  {t('page.erp.purchase.order.detail.title.tax.rate')}
                </Typography>
              </TableCell>
              <TableCell sx={{ width: 100 }}>
                <Typography variant="body1">
                  {t('page.erp.purchase.order.detail.title.tax')}
                </Typography>
              </TableCell>
              <TableCell sx={{ width: 100 }}>
                <Typography variant="body1">
                  {t('page.erp.purchase.order.detail.title.tax.total')}
                </Typography>
              </TableCell>
              <TableCell sx={{ width: 50 }}>
                <Typography variant="body1">
                  {t('global.operate.actions')}
                </Typography>
              </TableCell>
            </TableRow>
            {/* {formValues.purchase_products.map((item, index) => ( */}
            {purchaseProducts.map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{ width: 50, verticalAlign: "middle" }}>
                  <Typography variant="body1">
                    {index + 1}
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: 100 }}>
                  <FormControl sx={{ minWidth: 120, width: '100%', '& .MuiSelect-root': { width: '100%' } }}>
                    {/* <InputLabel required size="small" id="product-select-label" htmlFor="product-helper">{t("page.erp.purchase.order.title.supplier")}</InputLabel> */}
                    <Select
                      // required
                      size="small"
                      id="product-helper"
                      // labelId="product-select-label"
                      name="product_id"
                      value={item.product_id}
                      onChange={(e) => handleProductSelectChange(e, item.rowNumber)}
                      // label={t("page.erp.purchase.order.detail.title.product")}
                      error={!!errors.purchase_products[index].product_id}
                    >
                      {products.map(item => (<MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>))}
                    </Select>
                    <FormHelperText sx={{ color: 'error.main' }} id="product-helper">{errors.purchase_products[index].product_id}</FormHelperText>
                  </FormControl>
                </TableCell>
                <TableCell sx={{ width: 50 }}>
                  <TextField
                    size="small"
                    value={item.product && item.product.stock_quantity}
                    disabled
                  />
                </TableCell>
                <TableCell sx={{ width: 50 }}>
                  <TextField
                    size="small"
                    value={item.product && item.product.barcode}
                    disabled
                  />
                </TableCell>
                <TableCell sx={{ width: 50 }}>
                  <TextField
                    size="small"
                    value={item.product && item.product.unit_name}
                    disabled
                  />
                </TableCell>
                <TableCell sx={{ width: 50 }}>
                  <TextField
                    size="small"
                    name="remarks"
                    value={item.remarks}
                    onChange={(e) => handleProductInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                  />
                </TableCell>
                <TableCell sx={{ width: 50 }}>
                  <TextField
                    size="small"
                    type="number"
                    name="quantity"
                    value={item.quantity}
                    // value={purchaseProducts[index].quantity}
                    onChange={(e) => handleProductInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                    error={!!errors.purchase_products[index].quantity}
                    helperText={errors.purchase_products[index].quantity}
                  />
                </TableCell>
                <TableCell sx={{ width: 50 }}>
                  <TextField
                    size="small"
                    type="number"
                    name="unit_price"
                    value={item.unit_price}
                    onChange={(e) => handleProductInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                    error={!!errors.purchase_products[index].unit_price}
                    helperText={errors.purchase_products[index].unit_price}
                  />
                </TableCell>
                <TableCell sx={{ width: 50 }}>
                  <TextField
                    size="small"
                    value={item.quantity * item.unit_price}
                    disabled
                  />
                </TableCell>
                <TableCell sx={{ width: 50 }}>
                  <TextField
                    size="small"
                    value={item.tax_rate}
                    disabled
                  />
                </TableCell>
                <TableCell sx={{ width: 50 }}>
                  <TextField
                    size="small"
                    value={item.quantity * item.unit_price * item.tax_rate / 100}
                    disabled
                  />
                </TableCell>
                <TableCell sx={{ width: 50 }}>
                  <TextField
                    size="small"
                    value={item.quantity * item.unit_price * (1 + item.tax_rate / 100)}
                    disabled
                  />
                </TableCell>
                <TableCell sx={{ width: 50, verticalAlign: "middle" }}>
                  <Button
                    sx={{ color: 'error.main' }}
                    size="small"
                    variant='customOperate'
                    title={t('global.operate.delete') + t('global.page.erp.purchase.order')}
                    startIcon={<DeleteIcon />}
                    onClick={() => handleClickProductDelete(index)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableContainer>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button variant="outlined" startIcon={<AddCircleSharpIcon />} onClick={() => handleAddPurchaseProduct()}>
              {t('page.erp.purchase.order.title.operate.add')}
            </Button>
          </Box>
        </Card>
      </Box >
    </CustomizedDialog >
  )
});

export default ErpPurchaseOrderAdd;