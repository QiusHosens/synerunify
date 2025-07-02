import { Box, Button, Card, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpCustomerResponse, ErpProductResponse, ErpSalesOrderAttachmentRequest, ErpSalesOrderDetailRequest, ErpSalesOrderRequest, ErpSalesOrderResponse, ErpSettlementAccountResponse, getErpSalesOrderBase, listErpCustomer, listErpProduct, listErpSettlementAccount, updateErpSalesOrder } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import { Dayjs } from 'dayjs';
import CustomizedFileUpload, { DownloadProps, UploadFile } from '@/components/CustomizedFileUpload';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { downloadSystemFile, uploadSystemFile } from '@/api/system_file';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { useMessage } from '@/components/GlobalMessage';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import CustomizedCopyableText from '@/components/CustomizedCopyableText';

interface FormDetailErrors {
  product_id?: string;
  quantity?: string;
  unit_price?: string;
  tax_rate?: string;
}

interface FormErrors {
  customer_id?: string; // 客户ID
  order_date?: string; // 订单日期
  total_amount?: string; // 总金额
  details: FormDetailErrors[];  // 入库采购产品仓库列表
}

interface ErpSalesOrderEditProps {
  onSubmit: () => void;
}

const ErpSalesOrderEdit = forwardRef(({ onSubmit }: ErpSalesOrderEditProps, ref) => {
  const { t } = useTranslation();
  const { showMessage } = useMessage();
  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('xl');
  const [customers, setCustomers] = useState<ErpCustomerResponse[]>([]);
  const [settlementAccounts, setSettlementAccounts] = useState<ErpSettlementAccountResponse[]>([]);
  const [products, setProducts] = useState<ErpProductResponse[]>([]);
  const [orderDate, setOrderDate] = useState<Dayjs | null>(null);
  const [erpSalesOrder, setErpSalesOrder] = useState<ErpSalesOrderResponse>();
  const [erpSalesOrderRequest, setErpSalesOrderRequest] = useState<ErpSalesOrderRequest>({
    id: 0,
    customer_id: 0,
    order_date: '',
    total_amount: 0,
    discount_rate: 0,
    settlement_account_id: 0,
    deposit: 0,
    remarks: '',

    details: [],
    attachments: [],
  });
  const [errors, setErrors] = useState<FormErrors>({
    details: [],
  });
  const [size] = useState({ xs: 12, md: 3 });
  const [fileWidth] = useState<number>(420);
  const [fileHeight] = useState<number>(245);
  const [downloadImages, setDownloadImages] = useState<Map<number, DownloadProps>>(new Map<number, DownloadProps>());

  useImperativeHandle(ref, () => ({
    show(erpSalesOrderRequest: ErpSalesOrderResponse) {
      initForm(erpSalesOrderRequest);
      initCustomers();
      initSettlementAccounts();
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const initCustomers = useCallback(async () => {
    const result = await listErpCustomer();
    setCustomers(result);
  }, []);

  const initSettlementAccounts = useCallback(async () => {
    const result = await listErpSettlementAccount();
    setSettlementAccounts(result);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      details: !erpSalesOrderRequest.details ? [] : erpSalesOrderRequest.details.map(() => ({
        product_id: undefined,
        quantity: undefined,
        unit_price: undefined,
        tax_rate: undefined,
      })),
    };

    if (!erpSalesOrderRequest.customer_id && erpSalesOrderRequest.customer_id != 0) {
      newErrors.customer_id = t('global.error.select.please') + t('erp.common.title.customer');
    }

    if (!erpSalesOrderRequest.order_date.trim()) {
      newErrors.order_date = t('global.error.select.please') + t('page.erp.sale.order.title.order.date');
    }

    if (!erpSalesOrderRequest.total_amount && erpSalesOrderRequest.total_amount != 0) {
      newErrors.total_amount = t('global.error.input.please') + t('erp.common.title.total.amount');
    }

    if (erpSalesOrderRequest.details) {
      erpSalesOrderRequest.details.forEach((product, index) => {
        if (!product.product_id && product.product_id !== 0) {
          newErrors.details[index].product_id = t('global.error.select.please') + t('erp.common.title.product');
        }
        if (!product.quantity) {
          newErrors.details[index].quantity = t('global.error.input.please') + t('erp.detail.common.title.quantity');
        }
        if (!product.unit_price && product.unit_price !== 0) {
          newErrors.details[index].unit_price = t('global.error.input.please') + t('erp.detail.common.title.unit.price');
        }
        if (!product.tax_rate && product.tax_rate !== 0) {
          newErrors.details[index].tax_rate = t('global.error.input.please') + t('erp.detail.common.title.tax.rate');
        }
      });
    }

    setErrors(newErrors);
    return !Object.keys(newErrors).some((key) => {
      if (key === 'details') {
        return newErrors.details.some((err) =>
          Object.values(err).some((value) => value !== undefined)
        );
      }
      return newErrors[key as keyof FormErrors];
    });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const initForm = async (erpSalesOrderRequest: ErpSalesOrderResponse) => {
    const products = await listErpProduct();
    setProducts(products);
    const result = await getErpSalesOrderBase(erpSalesOrderRequest.id);
    const details = result.details;
    if (details) {
      for (const detail of details) {
        for (const product of products) {
          if (product.id === detail.product_id) {
            detail.product = product;
          }
        }
      }
    }
    setErpSalesOrderRequest({
      ...result,
      details,
    })
    setErpSalesOrder(erpSalesOrderRequest)
    setOrderDate(new AdapterDayjs().dayjs(result.order_date));
    // 设置图片
    for (const attachment of result.attachments) {
      const file_id = attachment.file_id;
      const filename = attachment.file_name.indexOf('.') > 0 ? attachment.file_name.substring(0, attachment.file_name.lastIndexOf('.')) : attachment.file_name;
      const result = await downloadSystemFile(file_id, (progress) => {
        setDownloadImages(prev => {
          const data: DownloadProps = {
            filename,
            status: 'downloading',
            progress
          };
          const newMap = new Map(prev);
          newMap.set(file_id, data);
          return newMap;
        })
      })

      setDownloadImages(prev => {
        const data: DownloadProps = {
          filename,
          status: 'done',
          previewUrl: window.URL.createObjectURL(result),
        };
        const newMap = new Map(prev);
        newMap.set(file_id, data);
        return newMap;
      })
    }
    setErrors({ details: [], });
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      const details: ErpSalesOrderDetailRequest[] = [];
      for (const product of erpSalesOrderRequest.details) {
        details.push({
          id: product.id,
          product_id: product.product_id!,
          quantity: product.quantity,
          unit_price: product.unit_price,
          subtotal: product.subtotal,
          tax_rate: product.tax_rate,
          remarks: product.remarks,
        } as ErpSalesOrderDetailRequest);
      }
      const attachments: ErpSalesOrderAttachmentRequest[] = [];
      for (const attachment of erpSalesOrderRequest.attachments) {
        attachments.push({
          id: attachment.id,
          file_id: attachment.file_id!
        } as ErpSalesOrderAttachmentRequest);
      }
      const request: ErpSalesOrderRequest = {
        id: erpSalesOrderRequest.id,
        customer_id: erpSalesOrderRequest.customer_id!,
        order_date: erpSalesOrderRequest.order_date,
        total_amount: erpSalesOrderRequest.total_amount,
        discount_rate: erpSalesOrderRequest.discount_rate,
        settlement_account_id: erpSalesOrderRequest.settlement_account_id!,
        deposit: erpSalesOrderRequest.deposit,
        remarks: erpSalesOrderRequest.remarks,
        details,
        attachments
      }
      await updateErpSalesOrder(request);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setErpSalesOrderRequest((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleSelectChange = useCallback((e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setErpSalesOrderRequest((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleDateTimeChange = useCallback((value: PickerValue) => {
    setOrderDate(value);
    if (value) {
      setErpSalesOrderRequest((prev) => ({ ...prev, order_date: value.format('YYYY-MM-DD HH:mm:ss') }));
      setErrors((prev) => ({ ...prev, order_date: undefined }));
    }
  }, []);

  const handleAddPurchaseProduct = useCallback(() => {
    if (!products || products.length == 0) {
      showMessage(t('erp.detail.common.error.product.empty'));
    }
    const newProduct: ErpSalesOrderDetailRequest = {
      product_id: products[0].id,
      quantity: 1,
      unit_price: 0,
      subtotal: 0,
      tax_rate: 0,
      remarks: '',
      product: products[0],
    };
    setErpSalesOrderRequest((prev) => ({
      ...prev,
      details: [...prev.details, newProduct],
    }));
    setErrors((prev) => ({
      ...prev,
      details: [
        ...prev.details,
        { product_id: undefined, quantity: undefined, unit_price: undefined, tax_rate: undefined },
      ],
    }));
  }, [products, showMessage, t]);

  const handleClickProductDelete = useCallback((index: number) => {
    setErpSalesOrderRequest((prev) => ({
      ...prev,
      details: prev.details.filter((_, idx) => idx !== index),
    }));
    setErrors((prev) => ({
      ...prev,
      details: prev.details.filter((_, idx) => idx !== index),
    }));
  }, []);

  const handleProductSelectChange = useCallback((e: SelectChangeEvent<number>, index: number) => {
    const { value } = e.target;
    const product = products.find((p) => p.id === value);
    setErpSalesOrderRequest((prev) => ({
      ...prev,
      details: prev.details.map((item, idx) =>
        idx === index ? { ...item, product_id: value, product } : item
      ),
    }));
    setErrors((prev) => ({
      ...prev,
      details: prev.details.map((item, idx) =>
        idx === index ? { ...item, product_id: undefined } : item
      ),
    }));
  }, [products]);

  const handleProductInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value, type } = e.target;
    const numberValue = type === 'number' ? Number(value) : value;
    setErpSalesOrderRequest((prev) => {
      const updatedProducts = prev.details.map((item, idx) => {
        if (idx !== index) return item;
        const updatedItem = { ...item, [name]: numberValue };
        if (name === 'quantity' || name === 'unit_price') {
          updatedItem.subtotal = updatedItem.quantity * updatedItem.unit_price;
        }
        return updatedItem;
      });
      return { ...prev, details: updatedProducts };
    });
    setErrors((prev) => ({
      ...prev,
      details: prev.details.map((item, idx) =>
        idx === index ? { ...item, [name]: undefined } : item
      ),
    }));
  }, []);

  const handleFileChange = useCallback(async (file: UploadFile | null, action: 'upload' | 'remove', index: number) => {
    // console.log(`Upload ${index} file updated:`, file, `Action: ${action}`);

    if (action === 'upload' && file) {
      // 更新文件列表,增加一个附件,等待上传完成后在写入信息
      setErpSalesOrderRequest((prev) => {
        return { ...prev, attachments: [...prev.attachments, { file }] };
      })

      // 上传文件
      try {
        const result = await uploadSystemFile(file.file, (progress) => {
          setErpSalesOrderRequest((prev) => {
            const updatedAttachments = prev.attachments.map((item, idx) => {
              if (idx !== index) return item;
              const updatedItem = { ...item, file: { ...item.file!, progress } };
              return updatedItem;
            })
            return { ...prev, attachments: updatedAttachments };
          });
        });

        // 上传完成
        setErpSalesOrderRequest((prev) => {
          const updatedAttachments = prev.attachments.map((item, idx) => {
            if (idx !== index) return item;
            const updatedItem = { ...item, file_id: result, file: { ...item.file!, status: 'done' as const } };
            return updatedItem;
          })
          return { ...prev, attachments: updatedAttachments };
        });
      } catch (error) {
        console.error('upload file error', error);
        // 上传失败
        setErpSalesOrderRequest((prev) => {
          const updatedAttachments = prev.attachments.map((item, idx) => {
            if (idx !== index) return item;
            const updatedItem = { ...item, file: { ...item.file!, status: 'error' as const } };
            return updatedItem;
          })
          return { ...prev, attachments: updatedAttachments };
        });
      }
    } else if (action === 'remove') {
      // 删除文件并移除上传框
      setErpSalesOrderRequest((prev) => {
        const updatedAttachments = prev.attachments.filter((_, idx) => idx !== index);
        return { ...prev, attachments: updatedAttachments };
      });
    }
  }, []);

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.edit') + t('global.page.erp.sale.order')}
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
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '100%' } }}>
          <Grid container rowSpacing={2} columnSpacing={4} sx={{ '& .MuiGrid-root': { display: 'flex', justifyContent: 'start', alignItems: 'center' } }}>
            <Grid size={size}>
              <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box>{t('erp.common.title.order.number')}</Box>
                <Box>{erpSalesOrder && <CustomizedCopyableText text={erpSalesOrder.order_number} sx={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <FormControl sx={{ mt: 2, minWidth: 120, width: '100%' }}>
                <InputLabel required size="small" id="customer-select-label">{t('erp.common.title.customer')}</InputLabel>
                <Select
                  required
                  size="small"
                  id="customer-helper"
                  labelId="customer-select-label"
                  name="customer_id"
                  value={erpSalesOrderRequest.customer_id ?? ''}
                  onChange={handleSelectChange}
                  label={t('erp.common.title.customer')}
                  error={!!errors.customer_id}
                >
                  {customers.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ color: 'error.main' }}>{errors.customer_id}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={size}>
              <FormControl sx={{ mt: 2, minWidth: 120, width: '100%' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    name="order_date"
                    label={t('page.erp.sale.order.title.order.date')}
                    value={orderDate}
                    onChange={handleDateTimeChange}
                    slotProps={{
                      textField: {
                        size: 'small',
                        required: true,
                        error: !!errors.order_date,
                        helperText: errors.order_date,
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
                label={t("erp.common.title.total.amount")}
                name='total_amount'
                value={erpSalesOrderRequest.total_amount}
                onChange={handleInputChange}
                error={!!errors.total_amount}
                helperText={errors.total_amount}
              />
            </Grid>
            <Grid size={size}>
              <TextField
                size="small"
                type="number"
                label={t("erp.common.title.discount.rate")}
                name='discount_rate'
                value={erpSalesOrderRequest.discount_rate}
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
                  value={erpSalesOrderRequest.settlement_account_id ?? ''}
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
                label={t("erp.common.title.deposit")}
                name='deposit'
                value={erpSalesOrderRequest.deposit}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={size}>
              <TextField
                size="small"
                label={t("common.title.remark")}
                name='remarks'
                value={erpSalesOrderRequest.remarks}
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
            {erpSalesOrderRequest.details.map((item, index) => (
              <Box className='table-row' key={index}>
                <Box className='table-cell' sx={{ width: 50, verticalAlign: 'middle' }}><Typography variant="body1">{index + 1}</Typography></Box>
                <Box className='table-cell' sx={{ width: 100 }}>
                  <FormControl sx={{ minWidth: 120, width: '100%' }}>
                    <Select
                      size="small"
                      name="product_id"
                      value={item.product_id ?? ''}
                      onChange={(e) => handleProductSelectChange(e, index)}
                      error={!!(errors.details[index]?.product_id)}
                    >
                      {products.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                          {product.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.details[index]?.product_id}</FormHelperText>
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
                    error={!!(errors.details[index]?.quantity)}
                    helperText={errors.details[index]?.quantity}
                  />
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField
                    size="small"
                    type="number"
                    name="unit_price"
                    value={item.unit_price}
                    onChange={(e) => handleProductInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                    error={!!(errors.details[index]?.unit_price)}
                    helperText={errors.details[index]?.unit_price}
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
                    error={!!(errors.details[index]?.tax_rate)}
                    helperText={errors.details[index]?.tax_rate}
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
            {erpSalesOrderRequest.attachments.map((item, index) => (
              <Grid key={index} size={{ xs: 12, md: 4 }}>
                <CustomizedFileUpload
                  id={'file-upload-' + index}
                  accept=".jpg,jpeg,.png"
                  maxSize={100}
                  onChange={(files, action) => handleFileChange(files, action, index)}
                  file={item.file}
                  width={fileWidth}
                  height={fileHeight}
                  download={downloadImages?.get(item.file_id!)}
                >
                </CustomizedFileUpload>
              </Grid>
            ))}
            <Grid size={{ xs: 12, md: 4 }}>
              <CustomizedFileUpload
                id={'file-upload-' + erpSalesOrderRequest.attachments.length}
                accept=".jpg,jpeg,.png"
                maxSize={100}
                onChange={(file, action) => handleFileChange(file, action, erpSalesOrderRequest.attachments.length)}
                width={fileWidth}
                height={fileHeight}
              >
              </CustomizedFileUpload>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpSalesOrderEdit;