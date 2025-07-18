import { Box, Button, Card, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createErpPurchaseOrder, ErpProductResponse, ErpPurchaseOrderAttachmentRequest, ErpPurchaseOrderDetailRequest, ErpPurchaseOrderRequest, ErpSettlementAccountResponse, ErpSupplierResponse, listErpProduct, listErpSettlementAccount, listErpSupplier } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import CustomizedFileUpload, { UploadFile } from '@/components/CustomizedFileUpload';
import { uploadSystemFile } from '@/api/system_file';
import { useMessage } from '@/components/GlobalMessage';

interface FormProductValues {
  product_id: number;
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
  const { showMessage } = useMessage();
  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('xl');
  const [suppliers, setSuppliers] = useState<ErpSupplierResponse[]>([]);
  const [settlementAccounts, setSettlementAccounts] = useState<ErpSettlementAccountResponse[]>([]);
  const [products, setProducts] = useState<ErpProductResponse[]>([]);
  const [purchaseDate, setPurchaseDate] = useState<Dayjs | null>(null);
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
  const [size] = useState({ xs: 12, md: 3 });
  const [fileWidth] = useState<number>(420);
  const [fileHeight] = useState<number>(245);

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
      purchase_products: formValues.purchase_products.map(() => ({
        product_id: undefined,
        quantity: undefined,
        unit_price: undefined,
        tax_rate: undefined,
      })),
    };

    if (!formValues.supplier_id && formValues.supplier_id !== 0) {
      newErrors.supplier_id = t('global.error.select.please') + t('erp.common.title.supplier');
    }

    if (!formValues.purchase_date.trim()) {
      newErrors.purchase_date = t('global.error.select.please') + t('page.erp.purchase.order.title.purchase.date');
    }

    if (!formValues.total_amount && formValues.total_amount !== 0) {
      newErrors.total_amount = t('global.error.select.please') + t('erp.common.title.total.amount');
    }

    formValues.purchase_products.forEach((product, index) => {
      if (!product.product_id && product.product_id !== 0) {
        newErrors.purchase_products[index].product_id = t('global.error.select.please') + t('erp.common.title.product');
      }
      if (!product.quantity) {
        newErrors.purchase_products[index].quantity = t('global.error.input.please') + t('erp.detail.common.title.quantity');
      }
      if (!product.unit_price && product.unit_price !== 0) {
        newErrors.purchase_products[index].unit_price = t('global.error.input.please') + t('erp.detail.common.title.unit.price');
      }
      if (!product.tax_rate && product.tax_rate !== 0) {
        newErrors.purchase_products[index].tax_rate = t('global.error.input.please') + t('erp.detail.common.title.tax.rate');
      }
    });

    setErrors(newErrors);
    return !Object.keys(newErrors).some((key) => {
      if (key === 'purchase_products') {
        return newErrors.purchase_products.some((err) =>
          Object.values(err).some((value) => value !== undefined)
        );
      }
      return newErrors[key as keyof FormErrors];
    });
  }, [formValues, t]);

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
  }, []);

  const handleCancel = () => {
    setOpen(false);
    reset();
  };

  const handleClose = useCallback(() => {
    setOpen(false);
    reset();
  }, [reset]);

  const handleSubmit = useCallback(async () => {
    if (validateForm()) {
      const purchase_products: ErpPurchaseOrderDetailRequest[] = [];
      for (const product of formValues.purchase_products) {
        purchase_products.push({
          product_id: product.product_id!,
          quantity: product.quantity,
          unit_price: product.unit_price,
          subtotal: product.subtotal,
          tax_rate: product.tax_rate,
          remarks: product.remarks,
        } as ErpPurchaseOrderDetailRequest);
      }
      const purchase_attachment: ErpPurchaseOrderAttachmentRequest[] = [];
      for (const attachment of formValues.purchase_attachment) {
        purchase_attachment.push({
          file_id: attachment.file_id!
        } as ErpPurchaseOrderAttachmentRequest);
      }
      const request: ErpPurchaseOrderRequest = {
        supplier_id: formValues.supplier_id!,
        purchase_date: formValues.purchase_date,
        total_amount: formValues.total_amount,
        discount_rate: formValues.discount_rate,
        settlement_account_id: formValues.settlement_account_id,
        deposit: formValues.deposit,
        remarks: formValues.remarks,
        purchase_products,
        purchase_attachment
      }
      await createErpPurchaseOrder(request);
      handleClose();
      onSubmit();
    }
  }, [formValues, validateForm, handleClose, onSubmit]);

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
    if (!products || products.length == 0) {
      showMessage(t('erp.detail.common.error.product.empty'));
    }
    const newProduct: FormProductValues = {
      product_id: products[0].id,
      quantity: 1,
      unit_price: 0,
      subtotal: 0,
      tax_rate: 0,
      remarks: '',
      product: products[0],
    };
    setFormValues((prev) => ({
      ...prev,
      purchase_products: [...prev.purchase_products, newProduct],
    }));
    setErrors((prev) => ({
      ...prev,
      purchase_products: [
        ...prev.purchase_products,
        { product_id: undefined, quantity: undefined, unit_price: undefined, tax_rate: undefined },
      ],
    }));
  }, [products, showMessage, t]);

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
    // console.log(`Upload ${index} file updated:`, file, `Action: ${action}`);

    if (action === 'upload' && file) {
      // 更新文件列表,增加一个附件,等待上传完成后在写入信息
      setFormValues((prev) => {
        return { ...prev, purchase_attachment: [...prev.purchase_attachment, { file }] };
      })

      // 上传文件
      try {
        const result = await uploadSystemFile(file.file, (progress) => {
          setFormValues((prev) => {
            const updatedAttachments = prev.purchase_attachment.map((item, idx) => {
              if (idx !== index) return item;
              const updatedItem = { ...item, file: { ...item.file!, progress } };
              return updatedItem;
            })
            return { ...prev, purchase_attachment: updatedAttachments };
          });
        });

        // 上传完成
        setFormValues((prev) => {
          const updatedAttachments = prev.purchase_attachment.map((item, idx) => {
            if (idx !== index) return item;
            const updatedItem = { ...item, file_id: result, file: { ...item.file!, status: 'done' as const } };
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
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
      <Box noValidate component="form" sx={{ display: 'flex', flexDirection: 'column', m: 'auto', width: 'fit-content' }}>
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '100%' } }}>
          <Grid container rowSpacing={2} columnSpacing={4} sx={{ '& .MuiGrid-root': { display: 'flex', justifyContent: 'center', alignItems: 'center' } }}>
            <Grid size={size}>
              <TextField size="small" label={t('erp.common.placeholder.order.number')} disabled />
            </Grid>
            <Grid size={size}>
              <FormControl sx={{ mt: 2, minWidth: 120, width: '100%' }}>
                <InputLabel required size="small" id="supplier-select-label">{t('erp.common.title.supplier')}</InputLabel>
                <Select
                  required
                  size="small"
                  id="supplier-helper"
                  labelId="supplier-select-label"
                  name="supplier_id"
                  value={formValues.supplier_id ?? ''}
                  onChange={handleSelectChange}
                  label={t('erp.common.title.supplier')}
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
            <Grid size={size}>
              <FormControl sx={{ mt: 2, minWidth: 120, width: '100%' }}>
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
            <Grid size={size}>
              <TextField
                required
                size="small"
                type="number"
                label={t('erp.common.title.total.amount')}
                name="total_amount"
                value={formValues.total_amount}
                onChange={handleInputChange}
                error={!!errors.total_amount}
                helperText={errors.total_amount}
              />
            </Grid>
            <Grid size={size}>
              <TextField
                size="small"
                type="number"
                label={t('erp.common.title.discount.rate')}
                name="discount_rate"
                value={formValues.discount_rate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={size}>
              <FormControl sx={{ mt: 2, minWidth: 120, width: '100%' }}>
                <InputLabel size="small" id="settlement-account-select-label">{t('erp.common.title.settlement.account')}</InputLabel>
                <Select
                  size="small"
                  labelId="settlement-account-select-label"
                  name="settlement_account_id"
                  value={formValues.settlement_account_id ?? ''}
                  onChange={handleSelectChange}
                  label={t('erp.common.title.settlement.account')}
                >
                  {settlementAccounts.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={size}>
              <TextField
                size="small"
                type="number"
                label={t('erp.common.title.deposit')}
                name="deposit"
                value={formValues.deposit}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={size}>
              <TextField
                size="small"
                label={t('common.title.remark')}
                name="remarks"
                value={formValues.remarks}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </FormControl>

        <Typography variant="body1" sx={{ mt: 3, fontSize: '1rem', fontWeight: 500 }}>
          {t('erp.common.title.check.list')}
        </Typography>
        <Card variant="outlined" sx={{ width: '100%', mt: 1, p: 2 }}>
          <Box sx={{ display: 'table', width: '100%', "& .table-row": { display: 'table-row', "& .table-cell": { display: 'table-cell', padding: 1, textAlign: 'center', } } }}>
            <Box className='table-row'>
              <Box className='table-cell' sx={{ width: 50 }}><Typography variant="body1">{t('erp.detail.common.title.no')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.product')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.stock')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.barcode')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.unit')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 200 }}><Typography variant="body1">{t('erp.detail.common.title.remarks')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('erp.detail.common.title.quantity')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('erp.detail.common.title.unit.price')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.subtotal')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.tax.rate')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.tax')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.tax.total')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 50 }}><Typography variant="body1">{t('global.operate.actions')}</Typography></Box>
            </Box>
            {formValues.purchase_products.map((item, index) => (
              <Box className='table-row' key={index}>
                <Box className='table-cell' sx={{ width: 50, verticalAlign: 'middle' }}><Typography variant="body1">{index + 1}</Typography></Box>
                <Box className='table-cell' sx={{ width: 100 }}>
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
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField size="small" value={item.product?.stock_quantity ?? ''} disabled />
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField size="small" value={item.product?.barcode ?? ''} disabled />
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField size="small" value={item.product?.unit_name ?? ''} disabled />
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField
                    size="small"
                    name="remarks"
                    value={item.remarks}
                    onChange={(e) => handleProductInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                  />
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField
                    size="small"
                    type="number"
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleProductInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                    error={!!(errors.purchase_products[index]?.quantity)}
                    helperText={errors.purchase_products[index]?.quantity}
                  />
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField
                    size="small"
                    type="number"
                    name="unit_price"
                    value={item.unit_price}
                    onChange={(e) => handleProductInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                    error={!!(errors.purchase_products[index]?.unit_price)}
                    helperText={errors.purchase_products[index]?.unit_price}
                  />
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField size="small" value={item.subtotal} disabled />
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField
                    size="small"
                    type="number"
                    name="tax_rate"
                    value={item.tax_rate}
                    onChange={(e) => handleProductInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                    error={!!(errors.purchase_products[index]?.tax_rate)}
                    helperText={errors.purchase_products[index]?.tax_rate}
                  />
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField size="small" value={(item.quantity * item.unit_price * item.tax_rate) / 100} disabled />
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField size="small" value={item.quantity * item.unit_price * (1 + item.tax_rate / 100)} disabled />
                </Box>
                <Box className='table-cell' sx={{ width: 50, verticalAlign: 'middle' }}>
                  <Button
                    sx={{ color: 'error.main' }}
                    size="small"
                    variant="customOperate"
                    title={t('global.operate.delete') + t('global.page.erp.purchase.order')}
                    startIcon={<DeleteIcon />}
                    onClick={() => handleClickProductDelete(index)}
                  />
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button variant="outlined" startIcon={<AddCircleSharpIcon />} onClick={handleAddPurchaseProduct}>
              {t('erp.common.operate.add')}
            </Button>
          </Box>
        </Card>

        <Typography variant="body1" sx={{ mt: 3, fontSize: '1rem', fontWeight: 500 }}>
          {t('erp.common.title.attachment')}
        </Typography>
        <Card variant="outlined" sx={{ width: '100%', mt: 1, p: 2 }}>
          <Grid container rowSpacing={2} columnSpacing={4} sx={{ '& .MuiGrid-root': { display: 'flex', justifyContent: 'center', alignItems: 'center' } }}>
            {formValues.purchase_attachment.map((item, index) => (
              <Grid key={index} size={{ xs: 12, md: 4 }}>
                <CustomizedFileUpload
                  id={'file-upload-' + index}
                  accept=".jpg,jpeg,.png"
                  maxSize={100}
                  onChange={(files, action) => handleFileChange(files, action, index)}
                  file={item.file}
                  width={fileWidth}
                  height={fileHeight}
                >
                </CustomizedFileUpload>
              </Grid>
            ))}
            <Grid size={{ xs: 12, md: 4 }}>
              <CustomizedFileUpload
                id={'file-upload-' + formValues.purchase_attachment.length}
                accept=".jpg,jpeg,.png"
                maxSize={100}
                onChange={(file, action) => handleFileChange(file, action, formValues.purchase_attachment.length)}
                width={fileWidth}
                height={fileHeight}
              >
              </CustomizedFileUpload>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </CustomizedDialog>
  );
});

export default ErpPurchaseOrderAdd;
