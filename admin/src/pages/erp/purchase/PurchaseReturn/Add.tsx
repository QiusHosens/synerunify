import { Box, Button, Card, FormControl, FormHelperText, Grid, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createErpPurchaseReturn, ErpPurchaseOrderInfoResponse, ErpPurchaseReturnAttachmentRequest, ErpPurchaseReturnDetailRequest, ErpPurchaseReturnRequest, ErpSettlementAccountResponse, ErpWarehouseResponse, getErpPurchaseOrderInfo, listErpSettlementAccount, listErpWarehouse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import CustomizedFileUpload, { UploadFile } from '@/components/CustomizedFileUpload';
import { Dayjs } from 'dayjs';
import { uploadSystemFile } from '@/api/system_file';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SearchIcon from '@/assets/image/svg/search.svg';
import PurchaseOrderSelect from './PurchaseOrderSelect';

interface FormAttachmentValues {
  file_id?: number; // 文件ID
  remarks?: string; // 备注

  file?: UploadFile | null;
}

interface FormDetailValues {
  purchase_detail_id: number; // 采购订单详情ID
  warehouse_id?: number; // 仓库ID
  quantity: number; // 退货数量
  remarks: string; // 备注
}

interface FormValues {
  purchase_order_id?: number; // 采购订单ID
  supplier_id?: number; // 供应商ID
  return_date: string; // 退货日期
  total_amount: number; // 总金额
  discount_rate: number; // 优惠率（百分比，1000表示10.00%）
  settlement_account_id?: number; // 结算账户ID
  remarks: string; // 备注

  details: FormDetailValues[];
  attachments: FormAttachmentValues[];
}

interface FormDetailErrors {
  warehouse_id?: string; // 仓库ID
  quantity?: string; // 退货数量
}

interface FormErrors {
  purchase_order_id?: string; // 采购订单ID
  return_date?: string; // 退货日期
  total_amount?: string; // 总金额

  details: FormDetailErrors[];
}

interface ErpPurchaseReturnAddProps {
  onSubmit: () => void;
}

const ErpPurchaseReturnAdd = forwardRef(({ onSubmit }: ErpPurchaseReturnAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('xl');
  const [erpPurchaseOrder, setErpPurchaseOrder] = useState<ErpPurchaseOrderInfoResponse>();
  const [warehouses, setWarehouses] = useState<ErpWarehouseResponse[]>([]);
  const [settlementAccounts, setSettlementAccounts] = useState<ErpSettlementAccountResponse[]>([]);
  const [returnDate, setReturnDate] = useState<Dayjs | null>(null);
  const [formValues, setFormValues] = useState<FormValues>({
    return_date: '',
    total_amount: 0,
    discount_rate: 0,
    remarks: '',
    details: [],
    attachments: []
  });
  const [errors, setErrors] = useState<FormErrors>({
    details: [],
  });
  const [size] = useState({ xs: 12, md: 3 });
  const [fileWidth] = useState<number>(420);
  const [fileHeight] = useState<number>(245);

  const selectErpPurchaseOrder = useRef(null);

  useImperativeHandle(ref, () => ({
    show() {
      initSettlementAccounts();
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const initSettlementAccounts = useCallback(async () => {
    const result = await listErpSettlementAccount();
    setSettlementAccounts(result);
  }, []);

  const selectedErpPurchaseOrder = useCallback(async (id: number) => {
    const result = await getErpPurchaseOrderInfo(id);
    const warehouses = await listErpWarehouse();
    setWarehouses(warehouses);
    // 根据产品数量设置仓库
    let defaultWarehouse = undefined;
    if (warehouses.length > 0) {
      defaultWarehouse = warehouses[0].id;
    }
    const details: FormDetailValues[] = [];
    for (const purchase_product of result.purchase_products) {
      const detail: FormDetailValues = {
        purchase_detail_id: purchase_product.id,
        quantity: purchase_product.quantity,
        remarks: ''
      };
      if (defaultWarehouse) {
        detail.warehouse_id = defaultWarehouse;
      }
      details.push(detail);
    }
    setFormValues(prev => ({
      ...prev,
      purchase_order_id: id,
      details
    }))
    setErrors((prev) => ({ ...prev, purchase_order_id: undefined }));
    setErpPurchaseOrder(result);
  }, []);

  const handleClickOpenPurchaseOrderSelect = useCallback(async () => {
    (selectErpPurchaseOrder.current as any).show();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      details: formValues.details.map(() => ({
        warehouse_id: undefined,
        quantity: undefined,
      })),
    };

    if (!formValues.purchase_order_id && formValues.purchase_order_id != 0) {
      newErrors.purchase_order_id = t('page.erp.purchase.return.error.purchase.order');
    }

    if (!formValues.return_date.trim()) {
      newErrors.return_date = t('page.erp.purchase.return.error.return.date');
    }

    if (!formValues.total_amount && formValues.total_amount != 0) {
      newErrors.total_amount = t('page.erp.purchase.return.error.total.amount');
    }

    formValues.details.forEach((product, index) => {
      if (!product.warehouse_id) {
        newErrors.details[index].warehouse_id = t('page.erp.purchase.return.detail.error.warehouse');
      }

      if (!product.quantity) {
        newErrors.details[index].quantity = t('page.erp.purchase.return.detail.error.quantity');
      }
    });

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
    reset();
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const reset = () => {
    setFormValues({
      return_date: '',
      total_amount: 0,
      discount_rate: 0,
      remarks: '',
      details: [],
      attachments: []
    });
    setReturnDate(null);
    setErrors({
      details: [],
    });
    setErpPurchaseOrder(undefined);
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      const details: ErpPurchaseReturnDetailRequest[] = [];
      for (const product of formValues.details) {
        details.push({
          purchase_detail_id: product.purchase_detail_id!,
          warehouse_id: product.warehouse_id,
          quantity: product.quantity,
          remarks: product.remarks,
        } as ErpPurchaseReturnDetailRequest);
      }
      const attachments: ErpPurchaseReturnAttachmentRequest[] = [];
      for (const attachment of formValues.attachments) {
        attachments.push({
          file_id: attachment.file_id!
        } as ErpPurchaseReturnAttachmentRequest);
      }
      const request: ErpPurchaseReturnRequest = {
        purchase_order_id: formValues.purchase_order_id!,
        return_date: formValues.return_date,
        total_amount: formValues.total_amount,
        discount_rate: formValues.discount_rate,
        settlement_account_id: formValues.settlement_account_id!,
        remarks: formValues.remarks,
        details,
        attachments
      }
      await createErpPurchaseReturn(request);
      handleClose();
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

  const handleDateTimeChange = useCallback((value: PickerValue) => {
    setReturnDate(value);
    if (value) {
      setFormValues((prev) => ({ ...prev, return_date: value.format('YYYY-MM-DD HH:mm:ss') }));
      setErrors((prev) => ({ ...prev, return_date: undefined }));
    }
  }, []);

  const handleSelectChange = useCallback((e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleWarehouseSelectChange = useCallback((e: SelectChangeEvent<number>, index: number) => {
    const { value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      details: prev.details.map((item, idx) =>
        idx === index ? { ...item, warehouse_id: value } : item
      ),
    }));
    setErrors((prev) => ({
      ...prev,
      details: prev.details.map((item, idx) =>
        idx === index ? { ...item, warehouse_id: undefined } : item
      ),
    }));
  }, [warehouses]);

  const handleDetailInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value, type } = e.target;
    const numberValue = type === 'number' ? Number(value) : value;
    setFormValues((prev) => ({
      ...prev,
      details: prev.details.map((item, idx) =>
        idx === index ? { ...item, [name]: numberValue } : item
      ),
    }));
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
      setFormValues((prev) => {
        return { ...prev, attachments: [...prev.attachments, { file }] };
      })

      // 上传文件
      try {
        const result = await uploadSystemFile(file.file, (progress) => {
          setFormValues((prev) => {
            const updatedAttachments = prev.attachments.map((item, idx) => {
              if (idx !== index) return item;
              const updatedItem = { ...item, file: { ...item.file!, progress } };
              return updatedItem;
            })
            return { ...prev, attachments: updatedAttachments };
          });
        });

        // 上传完成
        setFormValues((prev) => {
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
        setFormValues((prev) => {
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
      setFormValues((prev) => {
        const updatedAttachments = prev.attachments.filter((_, idx) => idx !== index);
        return { ...prev, attachments: updatedAttachments };
      });
    }
  }, []);

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.add') + t('global.page.erp.purchase.return')}
      maxWidth={maxWidth}
      actions={
        <>
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
          <Grid container rowSpacing={2} columnSpacing={4} sx={{ '& .MuiGrid-root': { display: 'flex', justifyContent: 'center', alignItems: 'center' } }}>
            <Grid size={size}>
              <TextField size="small" label={t('global.order.placeholder.order.number')} disabled />
            </Grid>
            <Grid size={size}>
              <FormControl sx={{ mt: 2, minWidth: 120, width: '100%', '& .MuiOutlinedInput-root': { width: '100%', pr: 0 } }} variant="outlined" error={!!errors.purchase_order_id}>
                <InputLabel required size="small" shrink={erpPurchaseOrder ? true : false} htmlFor="return-purchase-id">{t("page.erp.purchase.return.title.purchase.order")}</InputLabel>
                <OutlinedInput
                  required
                  size="small"
                  id="return-purchase-id"
                  type='text'
                  label={t("page.erp.purchase.return.title.purchase.order")}
                  value={erpPurchaseOrder && erpPurchaseOrder.order_number}
                  onChange={handleInputChange}
                  error={!!errors.purchase_order_id}
                  disabled
                  notched={!!erpPurchaseOrder}
                  endAdornment={
                    <InputAdornment position="end">
                      <Button
                        size="small"
                        variant='customContained'
                        startIcon={<SearchIcon />}
                        onClick={() => handleClickOpenPurchaseOrderSelect()}
                      >
                        {t('page.erp.purchase.inbound.operate.select')}
                      </Button>
                    </InputAdornment>
                  }
                />
                <FormHelperText sx={{ color: 'error.main' }} id="return-purchase-id">{errors.purchase_order_id}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={size}>
              <TextField
                required
                size="small"
                label={t("page.erp.purchase.return.title.supplier")}
                value={erpPurchaseOrder && erpPurchaseOrder.supplier_name}
                disabled
                slotProps={erpPurchaseOrder ?
                  {
                    inputLabel: {
                      shrink: true,
                    }
                  } : undefined
                }
              />
            </Grid>
            <Grid size={size}>
              <FormControl sx={{ mt: 2, minWidth: 120, width: '100%' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    name="return_date"
                    label={t('page.erp.purchase.return.title.return.date')}
                    value={returnDate}
                    onChange={handleDateTimeChange}
                    slotProps={{
                      textField: {
                        size: 'small',
                        required: true,
                        error: !!errors.return_date,
                        helperText: errors.return_date,
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
              <FormControl sx={{ mt: 2, minWidth: 120, width: '100%' }}>
                <InputLabel size="small" id="settlement-account-select-label">{t('page.erp.purchase.return.title.settlement.account')}</InputLabel>
                <Select
                  size="small"
                  labelId="settlement-account-select-label"
                  name="settlement_account_id"
                  value={formValues.settlement_account_id ?? ''}
                  onChange={handleSelectChange}
                  label={t('page.erp.purchase.return.title.settlement.account')}
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
                required
                size="small"
                type="number"
                label={t("page.erp.purchase.return.title.total.amount")}
                name='total_amount'
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
                label={t("page.erp.purchase.return.title.discount.rate")}
                name='discount_rate'
                value={formValues.discount_rate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={size}>
              <TextField
                size="small"
                label={t("page.erp.purchase.return.title.remarks")}
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
        <Card variant="outlined" sx={{ width: '100%', mt: 1, p: 2 }}>
          <Box sx={{ display: 'table', width: '100%', "& .table-row": { display: 'table-row', "& .table-cell": { display: 'table-cell', padding: 1, textAlign: 'center', } } }}>
            <Box className='table-row'>
              <Box className='table-cell' sx={{ width: 50 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.no')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('page.erp.purchase.inbound.detail.title.warehouse')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.remarks')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.product')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.barcode')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.unit')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 200 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.remarks')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.quantity')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.unit.price')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.subtotal')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.tax.rate')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.tax')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.tax.total')}</Typography></Box>
            </Box>
            {erpPurchaseOrder && erpPurchaseOrder.purchase_products.map((item, index) => (
              <Box className='table-row' key={index}>
                <Box className='table-cell' sx={{ width: 50, verticalAlign: 'middle' }}><Typography variant="body1">{index + 1}</Typography></Box>
                <Box className='table-cell' sx={{ width: 100 }}>
                  <FormControl sx={{ minWidth: 120, width: '100%' }}>
                    <Select
                      size="small"
                      name="warehouse_id"
                      value={formValues.details[index] && formValues.details[index].warehouse_id}
                      onChange={(e) => handleWarehouseSelectChange(e, index)}
                      error={!!(errors.details[index]?.warehouse_id)}
                    >
                      {warehouses.map((warehouse) => (
                        <MenuItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.details[index]?.warehouse_id}</FormHelperText>
                  </FormControl>
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField
                    size="small"
                    name="remarks"
                    defaultValue={formValues.details[index] && formValues.details[index].remarks}
                    onChange={(e) => handleDetailInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                  />
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField size="small" value={item.product_name} disabled />
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField size="small" value={item.product_barcode ?? ''} disabled />
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField size="small" value={item.product_unit_name ?? ''} disabled />
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField size="small" value={item.remarks} disabled />
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField size="small" value={item.quantity} disabled />
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField size="small" value={item.unit_price} disabled />
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField size="small" value={item.subtotal} disabled />
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField size="small" value={item.tax_rate} disabled />
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField size="small" value={(item.quantity * item.unit_price * item.tax_rate) / 100} disabled />
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField size="small" value={item.quantity * item.unit_price * (1 + item.tax_rate / 100)} disabled />
                </Box>
              </Box>
            ))}
          </Box>
        </Card>

        <Typography variant="body1" sx={{ mt: 3, fontSize: '1rem', fontWeight: 500 }}>
          {t('page.erp.purchase.order.title.attachment')}
        </Typography>
        <Card variant="outlined" sx={{ width: '100%', mt: 1, p: 2 }}>
          <Grid container rowSpacing={2} columnSpacing={4} sx={{ '& .MuiGrid-root': { display: 'flex', justifyContent: 'center', alignItems: 'center' } }}>
            {formValues.attachments.map((item, index) => (
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
                id={'file-upload-' + formValues.attachments.length}
                accept=".jpg,jpeg,.png"
                maxSize={100}
                onChange={(file, action) => handleFileChange(file, action, formValues.attachments.length)}
                width={fileWidth}
                height={fileHeight}
              >
              </CustomizedFileUpload>
            </Grid>
          </Grid>
        </Card>
      </Box>
      <PurchaseOrderSelect ref={selectErpPurchaseOrder} onSubmit={selectedErpPurchaseOrder} />
    </CustomizedDialog >
  )
});

export default ErpPurchaseReturnAdd;