import { Box, Button, Card, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, styled, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createErpPurchaseOrder, ErpProductResponse, ErpPurchaseOrderRequest, ErpSettlementAccountResponse, ErpSupplierResponse, listErpProduct, listErpSettlementAccount, listErpSupplier } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import CustomizedFileUpload, { UploadFile } from '@/components/CustomizedFileUpload';
import { uploadSystemFile } from '@/api/system_file';

interface FormProductValues {
  rowNumber: number;
  product_id?: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  tax_rate: number;
  remarks: string;
  product?: ErpProductResponse;
}

interface FormAttachmentValues {
  file_id?: number;
  remarks?: string;

  file?: UploadFile | null;
}

interface FormValues {
  supplier_id?: number;
  purchase_date: string;
  total_amount: number;
  discount_rate: number;
  settlement_account_id?: number;
  deposit: number;
  remarks: string;
  purchase_products: FormProductValues[];
  purchase_attachment: FormAttachmentValues[];
}

interface FormProductErrors {
  rowNumber: number;
  product_id?: string;
  quantity?: string;
  unit_price?: string;
  tax_rate?: string;
}

interface FormErrors {
  supplier_id?: string;
  purchase_date?: string;
  total_amount?: string;
  purchase_products: FormProductErrors[];
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
  const [purchaseDate, setPurchaseDate] = useState<Dayjs | null>(null);
  const [rowNumber, setRowNumber] = useState(1);
  const [formValues, setFormValues] = useState<FormValues>({
    purchase_date: '',
    total_amount: 0,
    discount_rate: 0,
    deposit: 0,
    remarks: '',
    purchase_products: [],
    purchase_attachment: [],
  });
  const [errors, setErrors] = useState<FormErrors>({
    purchase_products: [],
  });

  const TableContainer = styled(Box)({
    display: 'table',
    width: '100%',
  });

  const TableRow = styled(Box)({
    display: 'table-row',
  });

  const TableCell = styled(Box)(({ theme }) => ({
    display: 'table-cell',
    padding: theme.spacing(1),
    textAlign: 'center',
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

  const initSuppliers = useCallback(async () => {
    const result = await listErpSupplier();
    setSuppliers(result);
  }, []);

  const initSettlementAccounts = useCallback(async () => {
    const result = await listErpSettlementAccount();
    setSettlementAccounts(result);
  }, []);

  const initProducts = useCallback(async () => {
    const result = await listErpProduct();
    setProducts(result);
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {
      purchase_products: formValues.purchase_products.map((_, index) => ({
        rowNumber: index + 1,
        product_id: undefined,
        quantity: undefined,
        unit_price: undefined,
        tax_rate: undefined,
      })),
    };

    if (!formValues.supplier_id && formValues.supplier_id !== 0) {
      newErrors.supplier_id = t('page.erp.purchase.order.error.supplier');
    }

    if (!formValues.purchase_date.trim()) {
      newErrors.purchase_date = t('page.erp.purchase.order.error.purchase.date');
    }

    if (!formValues.total_amount && formValues.total_amount !== 0) {
      newErrors.total_amount = t('page.erp.purchase.order.error.total.amount');
    }

    formValues.purchase_products.forEach((product, index) => {
      if (!product.product_id && product.product_id !== 0) {
        newErrors.purchase_products[index].product_id = t('page.erp.purchase.order.detail.error.product');
      }
      if (!product.quantity) {
        newErrors.purchase_products[index].quantity = t('page.erp.purchase.order.detail.error.quantity');
      }
      if (!product.unit_price && product.unit_price !== 0) {
        newErrors.purchase_products[index].unit_price = t('page.erp.purchase.order.detail.error.unit.price');
      }
      if (!product.tax_rate && product.tax_rate !== 0) {
        newErrors.purchase_products[index].tax_rate = t('page.erp.purchase.order.detail.error.tax.rate');
      }
    });

    setErrors(newErrors);
    return !Object.keys(newErrors).some((key) => {
      if (key === 'purchase_products') {
        return newErrors.purchase_products.some((err) =>
          Object.values(err).some((value) => value !== undefined && value !== err.rowNumber)
        );
      }
      return newErrors[key as keyof FormErrors];
    });
  }, [formValues, t]);

  const handleCancel = useCallback(() => {
    setOpen(false);
    reset();
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    reset();
  }, []);

  const reset = useCallback(() => {
    setFormValues({
      purchase_date: '',
      total_amount: 0,
      discount_rate: 0,
      deposit: 0,
      remarks: '',
      purchase_products: [],
      purchase_attachment: [],
    });
    setPurchaseDate(null);
    setErrors({ purchase_products: [] });
    setRowNumber(1);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (validateForm()) {
      await createErpPurchaseOrder(formValues as ErpPurchaseOrderRequest);
      handleClose();
      onSubmit();
    }
  }, [formValues, validateForm, handleClose, onSubmit]);

  const handleSubmitAndContinue = useCallback(async () => {
    if (validateForm()) {
      await createErpPurchaseOrder(formValues as ErpPurchaseOrderRequest);
      onSubmit();
    }
  }, [formValues, validateForm, onSubmit]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleSelectChange = useCallback((e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleDateTimeChange = useCallback((value: PickerValue) => {
    setPurchaseDate(value);
    if (value) {
      setFormValues((prev) => ({ ...prev, purchase_date: value.format('YYYY-MM-DD HH:mm:ss') }));
      setErrors((prev) => ({ ...prev, purchase_date: undefined }));
    }
  }, []);

  const handleAddPurchaseProduct = useCallback(() => {
    setRowNumber((prev) => prev + 1);
    const newProduct: FormProductValues = {
      rowNumber: rowNumber + 1,
      product_id: products.length > 0 ? products[0].id : undefined,
      quantity: 1,
      unit_price: 0,
      subtotal: 0,
      tax_rate: 0,
      remarks: '',
      product: products.length > 0 ? products[0] : undefined,
    };
    setFormValues((prev) => ({
      ...prev,
      purchase_products: [...prev.purchase_products, newProduct],
    }));
    setErrors((prev) => ({
      ...prev,
      purchase_products: [
        ...prev.purchase_products,
        { rowNumber: rowNumber + 1, product_id: undefined, quantity: undefined, unit_price: undefined, tax_rate: undefined },
      ],
    }));
  }, [products, rowNumber]);

  const handleClickProductDelete = useCallback((index: number) => {
    setFormValues((prev) => ({
      ...prev,
      purchase_products: prev.purchase_products.filter((_, idx) => idx !== index),
    }));
    setErrors((prev) => ({
      ...prev,
      purchase_products: prev.purchase_products.filter((_, idx) => idx !== index),
    }));
  }, []);

  const handleProductSelectChange = useCallback((e: SelectChangeEvent<number>, index: number) => {
    const { value } = e.target;
    const product = products.find((p) => p.id === value);
    setFormValues((prev) => ({
      ...prev,
      purchase_products: prev.purchase_products.map((item, idx) =>
        idx === index ? { ...item, product_id: value, product } : item
      ),
    }));
    setErrors((prev) => ({
      ...prev,
      purchase_products: prev.purchase_products.map((item, idx) =>
        idx === index ? { ...item, product_id: undefined } : item
      ),
    }));
  }, [products]);

  const handleProductInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value, type } = e.target;
    const numberValue = type === 'number' ? Number(value) : value;
    setFormValues((prev) => {
      const updatedProducts = prev.purchase_products.map((item, idx) => {
        if (idx !== index) return item;
        const updatedItem = { ...item, [name]: numberValue };
        if (name === 'quantity' || name === 'unit_price') {
          updatedItem.subtotal = updatedItem.quantity * updatedItem.unit_price;
        }
        return updatedItem;
      });
      return { ...prev, purchase_products: updatedProducts };
    });
    setErrors((prev) => ({
      ...prev,
      purchase_products: prev.purchase_products.map((item, idx) =>
        idx === index ? { ...item, [name]: undefined } : item
      ),
    }));
  }, []);

  const handleFileChange = useCallback(async (file: UploadFile | null, action: 'upload' | 'remove', index: number) => {
    console.log(`Upload ${index} file updated:`, file, `Action: ${action}`);

    if (action === 'upload' && file) {
      // 更新文件列表,增加一个附件,等待上传完成后在写入信息
      setFormValues((prev) => {
        return { ...prev, purchase_attachment: [...prev.purchase_attachment, { file }] };
      })

      // 上传文件
      try {
        await uploadSystemFile(file.file, (progress) => {
          setFormValues((prev) => {
            const updatedAttachments = prev.purchase_attachment.map((item, idx) => {
              if (idx !== index) return item;
              const updatedItem = { ...item, file: { ...item.file!, progress } };
              return updatedItem;
            })
            return { ...prev, purchase_attachment: updatedAttachments };
          });
        }).then(id => {
          setFormValues((prev) => {
            const updatedAttachments = prev.purchase_attachment.map((item, idx) => {
              if (idx !== index) return item;
              const updatedItem = { ...item, file_id: id };
              return updatedItem;
            })
            return { ...prev, purchase_attachment: updatedAttachments };
          })
        });


        // 上传完成
        setFormValues((prev) => {
          const updatedAttachments = prev.purchase_attachment.map((item, idx) => {
            if (idx !== index) return item;
            const updatedItem = { ...item, file: { ...item.file!, status: 'done' as const } };
            return updatedItem;
          })
          return { ...prev, purchase_attachment: updatedAttachments };
        });
      } catch (error) {
        console.error('upload file error', error);
        // 上传失败
        setFormValues((prev) => {
          const updatedAttachments = prev.purchase_attachment.map((item, idx) => {
            if (idx !== index) return item;
            const updatedItem = { ...item, file: { ...item.file!, status: 'error' as const } };
            return updatedItem;
          })
          return { ...prev, purchase_attachment: updatedAttachments };
        });
      }
    } else if (action === 'remove') {
      // 删除文件并移除上传框
      setFormValues((prev) => {
        const updatedAttachments = prev.purchase_attachment.filter((_, idx) => idx !== index);
        return { ...prev, purchase_attachment: updatedAttachments };
      });
    }
  }, []);

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
      <Box noValidate component="form" sx={{ display: 'flex', flexDirection: 'column', m: 'auto', width: 'fit-content' }}>
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '100%' } }}>
          <Grid container rowSpacing={2} columnSpacing={4} sx={{ '& .MuiGrid-root': { display: 'flex', justifyContent: 'center', alignItems: 'center' } }}>
            <Grid size={{ xs: 12, md: 12 / 5 }}>
              <TextField size="small" label={t('page.erp.purchase.order.placeholder.order.number')} disabled />
            </Grid>
            <Grid size={{ xs: 12, md: 12 / 5 }}>
              <FormControl sx={{ mt: 2, minWidth: 120, width: '100%' }}>
                <InputLabel required size="small" id="supplier-select-label">{t('page.erp.purchase.order.title.supplier')}</InputLabel>
                <Select
                  required
                  size="small"
                  id="supplier-helper"
                  labelId="supplier-select-label"
                  name="supplier_id"
                  value={formValues.supplier_id ?? ''}
                  onChange={handleSelectChange}
                  label={t('page.erp.purchase.order.title.supplier')}
                  error={!!errors.supplier_id}
                >
                  {suppliers.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ color: 'error.main' }}>{errors.supplier_id}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 12 / 5 }}>
              <FormControl sx={{ minWidth: 120, width: '100%' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    name="purchase_date"
                    label={t('page.erp.purchase.order.title.purchase.date')}
                    value={purchaseDate}
                    onChange={handleDateTimeChange}
                    slotProps={{
                      textField: {
                        size: 'small',
                        required: true,
                        error: !!errors.purchase_date,
                        helperText: errors.purchase_date,
                      },
                      openPickerButton: {
                        sx: { mr: -1, '& .MuiSvgIcon-root': { fontSize: '1rem' } },
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
                label={t('page.erp.purchase.order.title.total.amount')}
                name="total_amount"
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
                label={t('page.erp.purchase.order.title.discount.rate')}
                name="discount_rate"
                value={formValues.discount_rate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 12 / 5 }}>
              <FormControl sx={{ mt: 2, minWidth: 120, width: '100%' }}>
                <InputLabel size="small" id="settlement-account-select-label">{t('page.erp.purchase.order.title.settlement.account')}</InputLabel>
                <Select
                  size="small"
                  labelId="settlement-account-select-label"
                  name="settlement_account_id"
                  value={formValues.settlement_account_id ?? ''}
                  onChange={handleSelectChange}
                  label={t('page.erp.purchase.order.title.settlement.account')}
                >
                  {settlementAccounts.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 12 / 5 }}>
              <TextField
                size="small"
                type="number"
                label={t('page.erp.purchase.order.title.deposit')}
                name="deposit"
                value={formValues.deposit}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 12 / 5 }}>
              <TextField
                size="small"
                label={t('page.erp.purchase.order.title.remarks')}
                name="remarks"
                value={formValues.remarks}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </FormControl>

        <Typography variant="body1" sx={{ mt: 3, fontSize: '1rem', fontWeight: 500 }}>
          {t('page.erp.purchase.order.title.check.list')}
        </Typography>
        <Card variant="outlined" sx={{ width: '100%', mt: 1, p: 2 }}>
          <TableContainer>
            <TableRow>
              <TableCell sx={{ width: 50 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.no')}</Typography></TableCell>
              <TableCell sx={{ width: 100 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.product')}</Typography></TableCell>
              <TableCell sx={{ width: 100 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.stock')}</Typography></TableCell>
              <TableCell sx={{ width: 100 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.barcode')}</Typography></TableCell>
              <TableCell sx={{ width: 100 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.unit')}</Typography></TableCell>
              <TableCell sx={{ width: 200 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.remarks')}</Typography></TableCell>
              <TableCell sx={{ width: 150 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.quantity')}</Typography></TableCell>
              <TableCell sx={{ width: 150 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.unit.price')}</Typography></TableCell>
              <TableCell sx={{ width: 100 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.subtotal')}</Typography></TableCell>
              <TableCell sx={{ width: 100 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.tax.rate')}</Typography></TableCell>
              <TableCell sx={{ width: 100 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.tax')}</Typography></TableCell>
              <TableCell sx={{ width: 100 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.tax.total')}</Typography></TableCell>
              <TableCell sx={{ width: 50 }}><Typography variant="body1">{t('global.operate.actions')}</Typography></TableCell>
            </TableRow>
            {formValues.purchase_products.map((item, index) => (
              <TableRow key={item.rowNumber}>
                <TableCell sx={{ width: 50, verticalAlign: 'middle' }}><Typography variant="body1">{index + 1}</Typography></TableCell>
                <TableCell sx={{ width: 100 }}>
                  <FormControl sx={{ minWidth: 120, width: '100%' }}>
                    <Select
                      size="small"
                      name="product_id"
                      value={item.product_id ?? ''}
                      onChange={(e) => handleProductSelectChange(e, index)}
                      error={!!(errors.purchase_products[index]?.product_id)}
                    >
                      {products.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                          {product.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.purchase_products[index]?.product_id}</FormHelperText>
                  </FormControl>
                </TableCell>
                <TableCell sx={{ width: 50 }}>
                  <TextField size="small" value={item.product?.stock_quantity ?? ''} disabled />
                </TableCell>
                <TableCell sx={{ width: 50 }}>
                  <TextField size="small" value={item.product?.barcode ?? ''} disabled />
                </TableCell>
                <TableCell sx={{ width: 50 }}>
                  <TextField size="small" value={item.product?.unit_name ?? ''} disabled />
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
                    onChange={(e) => handleProductInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                    error={!!(errors.purchase_products[index]?.quantity)}
                    helperText={errors.purchase_products[index]?.quantity}
                  />
                </TableCell>
                <TableCell sx={{ width: 50 }}>
                  <TextField
                    size="small"
                    type="number"
                    name="unit_price"
                    value={item.unit_price}
                    onChange={(e) => handleProductInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                    error={!!(errors.purchase_products[index]?.unit_price)}
                    helperText={errors.purchase_products[index]?.unit_price}
                  />
                </TableCell>
                <TableCell sx={{ width: 50 }}>
                  <TextField size="small" value={item.subtotal} disabled />
                </TableCell>
                <TableCell sx={{ width: 50 }}>
                  <TextField
                    size="small"
                    type="number"
                    name="tax_rate"
                    value={item.tax_rate}
                    onChange={(e) => handleProductInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                    error={!!(errors.purchase_products[index]?.tax_rate)}
                    helperText={errors.purchase_products[index]?.tax_rate}
                  />
                </TableCell>
                <TableCell sx={{ width: 50 }}>
                  <TextField size="small" value={(item.quantity * item.unit_price * item.tax_rate) / 100} disabled />
                </TableCell>
                <TableCell sx={{ width: 50 }}>
                  <TextField size="small" value={item.quantity * item.unit_price * (1 + item.tax_rate / 100)} disabled />
                </TableCell>
                <TableCell sx={{ width: 50, verticalAlign: 'middle' }}>
                  <Button
                    sx={{ color: 'error.main' }}
                    size="small"
                    variant="customOperate"
                    title={t('global.operate.delete') + t('global.page.erp.purchase.order')}
                    startIcon={<DeleteIcon />}
                    onClick={() => handleClickProductDelete(index)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableContainer>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button variant="outlined" startIcon={<AddCircleSharpIcon />} onClick={handleAddPurchaseProduct}>
              {t('page.erp.purchase.order.title.operate.add')}
            </Button>
          </Box>
        </Card>

        <Typography variant="body1" sx={{ mt: 3, fontSize: '1rem', fontWeight: 500 }}>
          {t('page.erp.purchase.order.title.attachment')}
        </Typography>
        <Card variant="outlined" sx={{ width: '100%', mt: 1, p: 2 }}>
          <Grid container rowSpacing={2} columnSpacing={4} sx={{ '& .MuiGrid-root': { display: 'flex', justifyContent: 'center', alignItems: 'center' } }}>
            {formValues.purchase_attachment.map((item, index) => (
              <Grid key={index} size={{ xs: 12, md: 6 }}>
                <CustomizedFileUpload
                  accept=".jpg,.png"
                  maxSize={5}
                  onChange={(files, action) => handleFileChange(files, action, index)}
                  file={item.file}
                  width={480}
                  height={280}
                >
                  <Box></Box>
                </CustomizedFileUpload>
              </Grid>
            ))}
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomizedFileUpload
                accept=".jpg,.png,.pdf"
                maxSize={5}
                onChange={(file, action) => handleFileChange(file, action, formValues.purchase_attachment.length)}
                width={480}
                height={280}
              >
                <Box></Box>
              </CustomizedFileUpload>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </CustomizedDialog>
  );
});

export default ErpPurchaseOrderAdd;
