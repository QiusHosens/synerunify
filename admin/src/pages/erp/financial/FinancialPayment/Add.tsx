import { Box, Button, Card, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createErpPayment, ErpInboundOrderResponse, ErpPaymentAttachmentRequest, ErpPaymentDetailRequest, ErpPaymentRequest, ErpPurchaseReturnResponse, ErpSettlementAccountResponse, ErpSupplierResponse, listErpSettlementAccount, listErpSupplier, listSupplierErpInboundOrder, listSupplierErpPurchaseReturn } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import CustomizedFileUpload, { UploadFile } from '@/components/CustomizedFileUpload';
import { Dayjs } from 'dayjs';
import { uploadSystemFile } from '@/api/system_file';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { useMessage } from '@/components/GlobalMessage';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';
import DeleteIcon from '@/assets/image/svg/delete.svg';

interface FormAttachmentValues {
  file_id?: number; // 文件ID
  remarks?: string; // 备注

  file?: UploadFile | null;
}

interface FormDetailValues {
  type: number; // 0为采购订单入库,1为采购退货
  purchase_order_id?: number; // 采购订单ID
  purchase_return_id?: number; // 采购退货ID
  amount?: number; // 金额
  remarks: string; // 备注
}

interface FormValues {
  supplier_id?: number; // 供应商ID
  settlement_account_id?: number; // 结算账户ID
  amount: number; // 付款金额
  discount_amount: number; // 优惠金额
  payment_date: string; // 付款日期
  payment_method: string; // 付款方式 (如 bank_transfer, cash, credit)
  remarks: string; // 备注

  details: FormDetailValues[];
  attachments: FormAttachmentValues[];
}

interface FormDetailErrors {
  purchase_order_id?: string; // 采购订单ID
  purchase_return_id?: string; // 采购退货ID
  amount?: string; // 金额
}

interface FormErrors {
  supplier_id?: string; // 供应商ID
  amount?: string; // 付款金额
  payment_date?: string; // 付款日期
  details: FormDetailErrors[];
}

interface ErpPaymentAddProps {
  onSubmit: () => void;
}

const ErpPaymentAdd = forwardRef(({ onSubmit }: ErpPaymentAddProps, ref) => {
  const { t } = useTranslation();
  const { showMessage } = useMessage();
  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('xl');
  const [suppliers, setSuppliers] = useState<ErpSupplierResponse[]>([]);
  const [settlementAccounts, setSettlementAccounts] = useState<ErpSettlementAccountResponse[]>([]);
  const [inboundOrders, setInboundOrders] = useState<ErpInboundOrderResponse[]>([]);
  const [returnOrders, setReturnOrders] = useState<ErpPurchaseReturnResponse[]>([]);
  const [paymentDate, setPaymentDate] = useState<Dayjs | null>(null);
  const [formValues, setFormValues] = useState<FormValues>({
    amount: 0,
    discount_amount: 0,
    payment_date: '',
    payment_method: '',
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

  useImperativeHandle(ref, () => ({
    show() {
      initSuppliers();
      initSettlementAccounts();
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      details: formValues.details.map(() => ({
        purchase_order_id: undefined,
        purchase_return_id: undefined,
        amount: undefined,
      })),
    };

    if (!formValues.supplier_id && formValues.supplier_id != 0) {
      newErrors.supplier_id = t('page.erp.payment.error.supplier');
    }

    if (!formValues.amount && formValues.amount != 0) {
      newErrors.amount = t('page.erp.payment.error.amount');
    }

    if (!formValues.payment_date.trim()) {
      newErrors.payment_date = t('page.erp.payment.error.payment.date');
    }

    formValues.details.forEach((product, index) => {
      if (!product.amount && product.amount !== 0) {
        newErrors.details[index].amount = t('page.erp.payment.detail.error.amount');
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
      amount: 0,
      discount_amount: 0,
      payment_date: '',
      payment_method: '',
      remarks: '',
      details: [],
      attachments: []
    });
    setPaymentDate(null);
    setErrors({
      details: [],
    });
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      const details: ErpPaymentDetailRequest[] = [];
      for (const product of formValues.details) {
        details.push({
          purchase_order_id: product.purchase_order_id,
          purchase_return_id: product.purchase_return_id,
          amount: product.amount,
          remarks: product.remarks,
        } as ErpPaymentDetailRequest);
      }
      const attachments: ErpPaymentAttachmentRequest[] = [];
      for (const attachment of formValues.attachments) {
        attachments.push({
          file_id: attachment.file_id!
        } as ErpPaymentAttachmentRequest);
      }
      const request: ErpPaymentRequest = {
        supplier_id: formValues.supplier_id!,
        settlement_account_id: formValues.settlement_account_id!,
        amount: formValues.amount,
        discount_amount: formValues.discount_amount,
        payment_date: formValues.payment_date,
        payment_method: formValues.payment_method,
        remarks: formValues.remarks,
        details,
        attachments
      }
      await createErpPayment(request);
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
    setPaymentDate(value);
    if (value) {
      setFormValues((prev) => ({ ...prev, payment_date: value.format('YYYY-MM-DD HH:mm:ss') }));
      setErrors((prev) => ({ ...prev, payment_date: undefined }));
    }
  }, []);

  const handleSupplierChange = useCallback(async (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    // 查询采购入库订单
    const inboundOrders = await listSupplierErpInboundOrder(value);
    setInboundOrders(inboundOrders);
    // 查询采购退货订单
    const returnOrders = await listSupplierErpPurchaseReturn(value);
    setReturnOrders(returnOrders);
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleSelectChange = useCallback((e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleAddDetail = useCallback((type: number) => {
    if (!formValues.supplier_id && formValues.supplier_id != 0) {
      showMessage(t('page.erp.payment.error.supplier.first'));
      return;
    }
    if (type == 0 && (!inboundOrders || inboundOrders.length == 0)) {
      showMessage(t('page.erp.payment.error.inbound.order.empty'));
      return;
    }
    if (type == 1 && (!returnOrders || returnOrders.length == 0)) {
      showMessage(t('page.erp.payment.error.purchase.return.order.empty'));
      return;
    }

    const newDetail: FormDetailValues = {
      type,
      amount: 0,
      remarks: '',
    };
    if (type == 0) {
      newDetail.purchase_order_id = inboundOrders[0].id;
    } else {
      newDetail.purchase_return_id = returnOrders[0].id;
    }

    setFormValues((prev) => ({
      ...prev,
      details: [...prev.details, newDetail],
    }));
    setErrors((prev) => ({
      ...prev,
      details: [
        ...prev.details,
        { amount: undefined },
      ],
    }));
  }, [showMessage, t]);

  const handleClickDetailDelete = useCallback((index: number) => {
    setFormValues((prev) => ({
      ...prev,
      details: prev.details.filter((_, idx) => idx !== index),
    }));
    setErrors((prev) => ({
      ...prev,
      details: prev.details.filter((_, idx) => idx !== index),
    }));
  }, []);

  const handleInboundSelectChange = useCallback((e: SelectChangeEvent<number>, index: number) => {
    const { value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      details: prev.details.map((item, idx) =>
        idx === index ? { ...item, purchase_order_id: value } : item
      ),
    }));
    setErrors((prev) => ({
      ...prev,
      details: prev.details.map((item, idx) =>
        idx === index ? { ...item, purchase_order_id: undefined } : item
      ),
    }));
  }, [inboundOrders]);

  const handleReturnSelectChange = useCallback((e: SelectChangeEvent<number>, index: number) => {
    const { value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      details: prev.details.map((item, idx) =>
        idx === index ? { ...item, purchase_return_id: value } : item
      ),
    }));
    setErrors((prev) => ({
      ...prev,
      details: prev.details.map((item, idx) =>
        idx === index ? { ...item, purchase_return_id: undefined } : item
      ),
    }));
  }, [returnOrders]);

  const handleDetailInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value, type } = e.target;
    const numberValue = type === 'number' ? Number(value) : value;
    setFormValues((prev) => {
      const updatedProducts = prev.details.map((item, idx) => {
        if (idx !== index) return item;
        const updatedItem = { ...item, [name]: numberValue };
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
      title={t('global.operate.add') + t('global.page.erp.payment')}
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
              <FormControl sx={{ mt: 2, minWidth: 120, width: '100%' }}>
                <InputLabel required size="small" id="supplier-select-label">{t('page.erp.purchase.order.title.supplier')}</InputLabel>
                <Select
                  required
                  size="small"
                  id="supplier-helper"
                  labelId="supplier-select-label"
                  name="supplier_id"
                  value={formValues.supplier_id ?? ''}
                  onChange={handleSupplierChange}
                  label={t('page.erp.purchase.inbound.title.supplier')}
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
                    name="payment_date"
                    label={t('page.erp.payment.title.payment.date')}
                    value={paymentDate}
                    onChange={handleDateTimeChange}
                    slotProps={{
                      textField: {
                        size: 'small',
                        required: true,
                        error: !!errors.payment_date,
                        helperText: errors.payment_date,
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
                <InputLabel size="small" id="settlement-account-select-label">{t('page.erp.purchase.inbound.title.settlement.account')}</InputLabel>
                <Select
                  size="small"
                  labelId="settlement-account-select-label"
                  name="settlement_account_id"
                  value={formValues.settlement_account_id ?? ''}
                  onChange={handleSelectChange}
                  label={t('page.erp.purchase.inbound.title.settlement.account')}
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
                label={t("page.erp.payment.title.amount")}
                name='amount'
                value={formValues.amount}
                onChange={handleInputChange}
                error={!!errors.amount}
                helperText={errors.amount}
              />
            </Grid>
            <Grid size={size}>
              <TextField
                size="small"
                type="number"
                label={t("page.erp.payment.title.discount.amount")}
                name='discount_amount'
                value={formValues.discount_amount}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid size={size}>
              <TextField
                size="small"
                label={t("page.erp.payment.title.payment.method")}
                name='payment_method'
                value={formValues.payment_method}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={size}>
              <TextField
                size="small"
                label={t("page.erp.payment.title.remarks")}
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
              <Box className='table-cell' sx={{ width: 50 }}><Typography variant="body1">{t('global.operate.actions')}</Typography></Box>
            </Box>
            {formValues.details.map((item, index) => (
              <Box className='table-row' key={index}>
                <Box className='table-cell' sx={{ width: 50, verticalAlign: 'middle' }}><Typography variant="body1">{index + 1}</Typography></Box>
                {item.type == 0 && <Box className='table-cell' sx={{ width: 100 }}>
                  <FormControl sx={{ minWidth: 120, width: '100%' }}>
                    <Select
                      size="small"
                      name="purchase_order_id"
                      value={item.purchase_order_id}
                      onChange={(e) => handleInboundSelectChange(e, index)}
                      error={!!(errors.details[index]?.purchase_order_id)}
                    >
                      {inboundOrders.map((inboundOrder) => (
                        <MenuItem key={inboundOrder.id} value={inboundOrder.id}>
                          {inboundOrder.order_number}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.details[index]?.purchase_order_id}</FormHelperText>
                  </FormControl>
                </Box>}
                {item.type == 1 && <Box className='table-cell' sx={{ width: 100 }}>
                  <FormControl sx={{ minWidth: 120, width: '100%' }}>
                    <Select
                      size="small"
                      name="product_id"
                      value={item.purchase_return_id ?? ''}
                      onChange={(e) => handleReturnSelectChange(e, index)}
                      error={!!(errors.details[index]?.purchase_return_id)}
                    >
                      {returnOrders.map((returnOrder) => (
                        <MenuItem key={returnOrder.id} value={returnOrder.id}>
                          {returnOrder.order_number}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.details[index]?.purchase_return_id}</FormHelperText>
                  </FormControl>
                </Box>}

                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField
                    size="small"
                    type="number"
                    name="amount"
                    value={item.amount}
                    onChange={(e) => handleDetailInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                    error={!!(errors.details[index]?.amount)}
                    helperText={errors.details[index]?.amount}
                  />
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField
                    size="small"
                    name="remarks"
                    value={item.remarks}
                    onChange={(e) => handleDetailInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                  />
                </Box>
                <Box className='table-cell' sx={{ width: 50, verticalAlign: 'middle' }}>
                  <Button
                    sx={{ color: 'error.main' }}
                    size="small"
                    variant="customOperate"
                    title={t('global.operate.delete') + t('global.page.erp.purchase.order')}
                    startIcon={<DeleteIcon />}
                    onClick={() => handleClickDetailDelete(index)}
                  />
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Stack direction='row' gap={2}>
              <Button variant="outlined" startIcon={<AddCircleSharpIcon />} onClick={() => handleAddDetail(0)}>
                {t('page.erp.payment.operate.inbound.order.add')}
              </Button>
              <Button variant="outlined" startIcon={<AddCircleSharpIcon />} onClick={() => handleAddDetail(1)}>
                {t('page.erp.payment.operate.purchase.return.add')}
              </Button>
            </Stack>
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
    </CustomizedDialog>
  )
});

export default ErpPaymentAdd;