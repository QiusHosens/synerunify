import { Box, Button, Card, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpCustomerResponse, ErpOutboundOrderResponse, ErpReceiptAttachmentRequest, ErpReceiptDetailRequest, ErpReceiptRequest, ErpReceiptResponse, ErpSalesReturnResponse, ErpSettlementAccountResponse, getBaseErpReceipt, listCustomerErpOutboundOrder, listCustomerErpSalesReturn, listErpCustomer, listErpSettlementAccount, updateErpReceipt } from '@/api';
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
  sales_order_id?: string; // 采购订单ID
  sales_return_id?: string; // 采购退货ID
  amount?: string; // 金额
}

interface FormErrors {
  customer_id?: string; // 客户ID
  amount?: string; // 收款金额
  receipt_date?: string; // 收款日期
  details: FormDetailErrors[];
}

interface ErpReceiptEditProps {
  onSubmit: () => void;
}

const ErpReceiptEdit = forwardRef(({ onSubmit }: ErpReceiptEditProps, ref) => {
  const { t } = useTranslation();
  const { showMessage } = useMessage();
  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('xl');
  const [customers, setCustomers] = useState<ErpCustomerResponse[]>([]);
  const [settlementAccounts, setSettlementAccounts] = useState<ErpSettlementAccountResponse[]>([]);
  const [outboundOrders, setOutboundOrders] = useState<ErpOutboundOrderResponse[]>([]);
  const [returnOrders, setReturnOrders] = useState<ErpSalesReturnResponse[]>([]);
  const [receiptDate, setReceiptDate] = useState<Dayjs | null>(null);
  const [erpReceipt, setErpReceipt] = useState<ErpReceiptResponse>();
  const [erpReceiptRequest, setErpReceiptRequest] = useState<ErpReceiptRequest>({
    id: 0,
    customer_id: 0,
    settlement_account_id: 0,
    amount: 0,
    discount_amount: 0,
    receipt_date: '',
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
  const [downloadImages, setDownloadImages] = useState<Map<number, DownloadProps>>(new Map<number, DownloadProps>());

  useImperativeHandle(ref, () => ({
    show(erpReceiptRequest: ErpReceiptResponse) {
      initForm(erpReceiptRequest);
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
      details: erpReceiptRequest.details.map(() => ({
        sales_order_id: undefined,
        sales_return_id: undefined,
        amount: undefined,
      })),
    };

    if (!erpReceiptRequest.customer_id && erpReceiptRequest.customer_id != 0) {
      newErrors.customer_id = t('global.error.select.please') + t('erp.common.title.customer');
    }

    if (!erpReceiptRequest.amount && erpReceiptRequest.amount != 0) {
      newErrors.amount = t('global.error.input.please') + t('page.erp.receipt.title.amount');
    }

    if (!erpReceiptRequest.receipt_date.trim()) {
      newErrors.receipt_date = t('global.error.select.please') + t('page.erp.receipt.title.receipt.date');
    }

    erpReceiptRequest.details.forEach((product, index) => {
      if (!product.amount && product.amount !== 0) {
        newErrors.details[index].amount = t('global.error.input.please') + t('page.erp.receipt.detail.title.amount');
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
  };

  const handleClose = () => {
    setOpen(false);
  };

  const initForm = async (erpReceiptRequest: ErpReceiptResponse) => {
    // 查询采购入库订单
    const inboundOrders = await listCustomerErpOutboundOrder(erpReceiptRequest.customer_id);
    setOutboundOrders(inboundOrders);
    // 查询采购退货订单
    const returnOrders = await listCustomerErpSalesReturn(erpReceiptRequest.customer_id);
    setReturnOrders(returnOrders);
    // 查询订单
    const result = await getBaseErpReceipt(erpReceiptRequest.id);
    const details = result.details;
    if (details) {
      for (const detail of details) {
        if (detail.sales_order_id || detail.sales_order_id == 0) {
          detail.type = 0;
        }
        if (detail.sales_return_id || detail.sales_return_id == 0) {
          detail.type = 1;
        }
      }
    }
    setErpReceiptRequest({
      ...result,
      details,
    })
    setErpReceipt(erpReceiptRequest);
    setReceiptDate(new AdapterDayjs().dayjs(result.receipt_date));
    // 设置图片
    for (const attachment of result.attachments) {
      const file_id = attachment.file_id;
      const filename = attachment.file_name.indexOf('.') > 0 ? attachment.file_name.substring(0, attachment.file_name.lastIndexOf('.')) : attachment.file_name;

      downloadSystemFile(file_id, (progress) => {
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
      }).catch(() => {
        setDownloadImages(prev => {
          const data: DownloadProps = {
            filename,
            status: 'error',
          };
          const newMap = new Map(prev);
          newMap.set(file_id, data);
          return newMap;
        })
      }).then((blob) => {
        if (blob) {
          setDownloadImages(prev => {
            const data: DownloadProps = {
              filename,
              status: 'done',
              previewUrl: window.URL.createObjectURL(blob),
            };
            const newMap = new Map(prev);
            newMap.set(file_id, data);
            return newMap;
          })
        }
      });
    }
    setErrors({ details: [], });
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      const details: ErpReceiptDetailRequest[] = [];
      for (const product of erpReceiptRequest.details) {
        details.push({
          id: product.id,
          sales_order_id: product.sales_order_id,
          sales_return_id: product.sales_return_id,
          amount: product.amount,
          remarks: product.remarks,
        } as ErpReceiptDetailRequest);
      }
      const attachments: ErpReceiptAttachmentRequest[] = [];
      for (const attachment of erpReceiptRequest.attachments) {
        attachments.push({
          id: attachment.id,
          file_id: attachment.file_id!
        } as ErpReceiptAttachmentRequest);
      }
      const request: ErpReceiptRequest = {
        id: erpReceiptRequest.id,
        customer_id: erpReceiptRequest.customer_id!,
        settlement_account_id: erpReceiptRequest.settlement_account_id!,
        amount: erpReceiptRequest.amount,
        discount_amount: erpReceiptRequest.discount_amount,
        receipt_date: erpReceiptRequest.receipt_date,
        payment_method: erpReceiptRequest.payment_method,
        remarks: erpReceiptRequest.remarks,
        details,
        attachments
      }
      await updateErpReceipt(request);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setErpReceiptRequest((prev) => ({
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
    setReceiptDate(value);
    if (value) {
      setErpReceiptRequest((prev) => ({ ...prev, receipt_date: value.format('YYYY-MM-DD HH:mm:ss') }));
      setErrors((prev) => ({ ...prev, receipt_date: undefined }));
    }
  }, []);

  const handleCustomerChange = useCallback(async (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    // 查询采购入库订单
    const inboundOrders = await listCustomerErpOutboundOrder(value);
    setOutboundOrders(inboundOrders);
    // 查询采购退货订单
    const returnOrders = await listCustomerErpSalesReturn(value);
    setReturnOrders(returnOrders);
    setErpReceiptRequest((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleSelectChange = useCallback((e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setErpReceiptRequest((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleAddDetail = useCallback((type: number) => {
    if (!erpReceiptRequest.customer_id && erpReceiptRequest.customer_id != 0) {
      showMessage(t('page.erp.receipt.error.customer.first'));
      return;
    }
    if (type == 0 && (!outboundOrders || outboundOrders.length == 0)) {
      showMessage(t('page.erp.receipt.error.outbound.order.empty'));
      return;
    }
    if (type == 1 && (!returnOrders || returnOrders.length == 0)) {
      showMessage(t('page.erp.receipt.error.sale.return.order.empty'));
      return;
    }

    const newDetail: ErpReceiptDetailRequest = {
      type,
      amount: 0,
      remarks: '',
    };
    if (type == 0) {
      newDetail.sales_order_id = outboundOrders[0].id;
    } else {
      newDetail.sales_return_id = returnOrders[0].id;
    }

    setErpReceiptRequest((prev) => ({
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
    setErpReceiptRequest((prev) => ({
      ...prev,
      details: prev.details.filter((_, idx) => idx !== index),
    }));
    setErrors((prev) => ({
      ...prev,
      details: prev.details.filter((_, idx) => idx !== index),
    }));
  }, []);

  const handleOutboundSelectChange = useCallback((e: SelectChangeEvent<number>, index: number) => {
    const { value } = e.target;
    setErpReceiptRequest((prev) => ({
      ...prev,
      details: prev.details.map((item, idx) =>
        idx === index ? { ...item, sales_order_id: value } : item
      ),
    }));
    setErrors((prev) => ({
      ...prev,
      details: prev.details.map((item, idx) =>
        idx === index ? { ...item, sales_order_id: undefined } : item
      ),
    }));
  }, [outboundOrders]);

  const handleReturnSelectChange = useCallback((e: SelectChangeEvent<number>, index: number) => {
    const { value } = e.target;
    setErpReceiptRequest((prev) => ({
      ...prev,
      details: prev.details.map((item, idx) =>
        idx === index ? { ...item, sales_return_id: value } : item
      ),
    }));
    setErrors((prev) => ({
      ...prev,
      details: prev.details.map((item, idx) =>
        idx === index ? { ...item, sales_return_id: undefined } : item
      ),
    }));
  }, [returnOrders]);

  const handleDetailInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value, type } = e.target;
    const numberValue = type === 'number' ? Number(value) : value;
    setErpReceiptRequest((prev) => {
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
      setErpReceiptRequest((prev) => {
        return { ...prev, attachments: [...prev.attachments, { file }] };
      })

      // 上传文件
      try {
        const result = await uploadSystemFile(file.file, (progress) => {
          setErpReceiptRequest((prev) => {
            const updatedAttachments = prev.attachments.map((item, idx) => {
              if (idx !== index) return item;
              const updatedItem = { ...item, file: { ...item.file!, progress } };
              return updatedItem;
            })
            return { ...prev, attachments: updatedAttachments };
          });
        });

        // 上传完成
        setErpReceiptRequest((prev) => {
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
        setErpReceiptRequest((prev) => {
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
      setErpReceiptRequest((prev) => {
        const updatedAttachments = prev.attachments.filter((_, idx) => idx !== index);
        return { ...prev, attachments: updatedAttachments };
      });
    }
  }, []);

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.edit') + t('global.page.erp.receipt')}
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
                <Box>{erpReceipt && <CustomizedCopyableText text={erpReceipt.order_number} sx={{
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
                  value={erpReceiptRequest.customer_id ?? ''}
                  onChange={handleCustomerChange}
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
                    name="receipt_date"
                    label={t('page.erp.receipt.title.receipt.date')}
                    value={receiptDate}
                    onChange={handleDateTimeChange}
                    slotProps={{
                      textField: {
                        size: 'small',
                        required: true,
                        error: !!errors.receipt_date,
                        helperText: errors.receipt_date,
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
                <InputLabel size="small" id="settlement-account-select-label">{t('erp.common.title.settlement.account')}</InputLabel>
                <Select
                  size="small"
                  labelId="settlement-account-select-label"
                  name="settlement_account_id"
                  value={erpReceiptRequest.settlement_account_id ?? ''}
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
                required
                size="small"
                type="number"
                label={t("page.erp.receipt.title.amount")}
                name='amount'
                value={erpReceiptRequest.amount}
                onChange={handleInputChange}
                error={!!errors.amount}
                helperText={errors.amount}
              />
            </Grid>
            <Grid size={size}>
              <TextField
                size="small"
                type="number"
                label={t("page.erp.receipt.title.discount.amount")}
                name='discount_amount'
                value={erpReceiptRequest.discount_amount}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={size}>
              <TextField
                size="small"
                label={t("page.erp.receipt.title.payment.method")}
                name='payment_method'
                value={erpReceiptRequest.payment_method}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={size}>
              <TextField
                size="small"
                label={t("common.title.remark")}
                name='remarks'
                value={erpReceiptRequest.remarks}
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
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.no')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 200 }}><Typography variant="body1">{t('erp.common.title.order.number')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.amount')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.remarks')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('global.operate.actions')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 800 }}></Box>
            </Box>
            {erpReceiptRequest.details.map((item, index) => (
              <Box className='table-row' key={index}>
                <Box className='table-cell' sx={{ width: 50, verticalAlign: 'middle' }}><Typography variant="body1">{index + 1}</Typography></Box>
                {item.type == 0 && <Box className='table-cell' sx={{ width: 100 }}>
                  <FormControl sx={{ minWidth: 120, width: '100%' }}>
                    <Select
                      size="small"
                      name="sales_order_id"
                      value={item.sales_order_id}
                      onChange={(e) => handleOutboundSelectChange(e, index)}
                      error={!!(errors.details[index]?.sales_order_id)}
                    >
                      {outboundOrders.map((inboundOrder) => (
                        <MenuItem key={inboundOrder.id} value={inboundOrder.id}>
                          {inboundOrder.order_number}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.details[index]?.sales_order_id}</FormHelperText>
                  </FormControl>
                </Box>}
                {item.type == 1 && <Box className='table-cell' sx={{ width: 100 }}>
                  <FormControl sx={{ minWidth: 120, width: '100%' }}>
                    <Select
                      size="small"
                      name="sales_return_id"
                      value={item.sales_return_id ?? ''}
                      onChange={(e) => handleReturnSelectChange(e, index)}
                      error={!!(errors.details[index]?.sales_return_id)}
                    >
                      {returnOrders.map((returnOrder) => (
                        <MenuItem key={returnOrder.id} value={returnOrder.id}>
                          {returnOrder.order_number}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.details[index]?.sales_return_id}</FormHelperText>
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
          {t('erp.common.title.attachment')}
        </Typography>
        <Card variant="outlined" sx={{ width: '100%', mt: 1, p: 2 }}>
          <Grid container rowSpacing={2} columnSpacing={4} sx={{ '& .MuiGrid-root': { display: 'flex', justifyContent: 'center', alignItems: 'center' } }}>
            {erpReceiptRequest.attachments.map((item, index) => (
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
                id={'file-upload-' + erpReceiptRequest.attachments.length}
                accept=".jpg,jpeg,.png"
                maxSize={100}
                onChange={(file, action) => handleFileChange(file, action, erpReceiptRequest.attachments.length)}
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

export default ErpReceiptEdit;