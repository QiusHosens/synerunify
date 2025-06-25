import { Box, Button, Card, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpSalesOrderDetailBaseResponse, ErpSalesOrderInfoResponse, ErpSalesReturnAttachmentRequest, ErpSalesReturnDetailRequest, ErpSalesReturnRequest, ErpSalesReturnResponse, ErpSettlementAccountResponse, ErpWarehouseResponse, getBaseErpSalesReturn, getErpSalesOrderInfo, listErpSettlementAccount, listErpWarehouse, updateErpSalesReturn } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import { Dayjs } from 'dayjs';
import CustomizedFileUpload, { DownloadProps, UploadFile } from '@/components/CustomizedFileUpload';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { downloadSystemFile, uploadSystemFile } from '@/api/system_file';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import CustomizedCopyableText from '@/components/CustomizedCopyableText';
import CustomizedTag from '@/components/CustomizedTag';

interface FormDetailErrors {
  warehouse_id?: string; // 仓库ID
  quantity?: string; // 退货数量
}

interface FormErrors {
  return_date?: string; // 退货日期
  total_amount?: string; // 总金额

  details: FormDetailErrors[];
}

interface ErpSalesReturnEditProps {
  onSubmit: () => void;
}

const ErpSalesReturnEdit = forwardRef(({ onSubmit }: ErpSalesReturnEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [erpSalesOrder, setErpSalesOrder] = useState<ErpSalesOrderInfoResponse>();
  const [erpSalesOrderDetailMap, setErpSalesOrderDetailMap] = useState<Map<number, ErpSalesOrderDetailBaseResponse>>();
  const [warehouses, setWarehouses] = useState<ErpWarehouseResponse[]>([]);
  const [settlementAccounts, setSettlementAccounts] = useState<ErpSettlementAccountResponse[]>([]);
  const [returnDate, setReturnDate] = useState<Dayjs | null>(null);
  const [erpSalesReturn, setErpSalesReturn] = useState<ErpSalesReturnResponse>();
  const [erpSalesReturnRequest, setErpSalesReturnRequest] = useState<ErpSalesReturnRequest>({
    id: 0,
    sales_order_id: 0,
    return_date: '',
    total_amount: 0,
    discount_rate: 0,
    settlement_account_id: 0,
    deposit: 0,
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
    show(erpSalesReturnRequest: ErpSalesReturnResponse) {
      initForm(erpSalesReturnRequest);
      initWarehouses();
      initSettlementAccounts();
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const initWarehouses = useCallback(async () => {
    const warehouses = await listErpWarehouse();
    setWarehouses(warehouses);
  }, []);

  const initSettlementAccounts = useCallback(async () => {
    const result = await listErpSettlementAccount();
    setSettlementAccounts(result);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      details: erpSalesReturnRequest.details.map(() => ({
        warehouse_id: undefined,
        quantity: undefined,
      })),
    };

    if (!erpSalesReturnRequest.return_date.trim()) {
      newErrors.return_date = t('page.erp.sales.return.error.return.date');
    }

    if (!erpSalesReturnRequest.total_amount && erpSalesReturnRequest.total_amount != 0) {
      newErrors.total_amount = t('page.erp.sales.return.error.total.amount');
    }

    erpSalesReturnRequest.details.forEach((product, index) => {
      if (!product.warehouse_id) {
        newErrors.details[index].warehouse_id = t('page.erp.sales.return.detail.error.warehouse');
      }

      if (!product.quantity) {
        newErrors.details[index].quantity = t('page.erp.sales.return.detail.error.quantity');
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

  const initForm = async (erpSalesReturnRequest: ErpSalesReturnResponse) => {
    // 查询退货订单
    const result = await getBaseErpSalesReturn(erpSalesReturnRequest.id);
    // 查询销售订单
    const salesOrder = await getErpSalesOrderInfo(erpSalesReturnRequest.sales_order_id);

    const salesOrderDetailMap: Map<number, ErpSalesOrderDetailBaseResponse> = new Map();
    for (const salesDetail of salesOrder.details) {
      salesOrderDetailMap.set(salesDetail.id, salesDetail);
    }
    setErpSalesOrderDetailMap(salesOrderDetailMap);
    setErpSalesOrder(salesOrder);
    setErpSalesReturn(result);
    setErpSalesReturnRequest({
      ...result,
    })
    setReturnDate(new AdapterDayjs().dayjs(result.return_date));
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
    setErrors({
      details: [],
    });
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      const details: ErpSalesReturnDetailRequest[] = [];
      for (const product of erpSalesReturnRequest.details) {
        let detail: ErpSalesReturnDetailRequest = {
          sale_detail_id: product.sale_detail_id!,
          warehouse_id: product.warehouse_id,
          quantity: product.quantity,
          remarks: product.remarks,
        } as ErpSalesReturnDetailRequest;
        if (product.id) {
          detail.id = product.id;
        }
        details.push(detail);
      }
      const attachments: ErpSalesReturnAttachmentRequest[] = [];
      for (const attachment of erpSalesReturnRequest.attachments) {
        let attach: ErpSalesReturnAttachmentRequest = {
          file_id: attachment.file_id!
        } as ErpSalesReturnAttachmentRequest;
        if (attachment.id) {
          attach.id = attachment.id;
        }
        attachments.push(attach);
      }
      const request: ErpSalesReturnRequest = {
        id: erpSalesReturnRequest.id,
        sales_order_id: erpSalesReturnRequest.sales_order_id!,
        return_date: erpSalesReturnRequest.return_date,
        total_amount: erpSalesReturnRequest.total_amount,
        discount_rate: erpSalesReturnRequest.discount_rate,
        settlement_account_id: erpSalesReturnRequest.settlement_account_id!,
        remarks: erpSalesReturnRequest.remarks,
        details,
        attachments
      }
      await updateErpSalesReturn(request);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setErpSalesReturnRequest((prev) => ({
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
      setErpSalesReturnRequest((prev) => ({ ...prev, return_date: value.format('YYYY-MM-DD HH:mm:ss') }));
      setErrors((prev) => ({ ...prev, return_date: undefined }));
    }
  }, []);

  const handleSelectChange = useCallback((e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setErpSalesReturnRequest((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleWarehouseSelectChange = useCallback((e: SelectChangeEvent<number>, index: number) => {
    const { value } = e.target;
    setErpSalesReturnRequest((prev) => ({
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
    setErpSalesReturnRequest((prev) => ({
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
      setErpSalesReturnRequest((prev) => {
        return { ...prev, attachments: [...prev.attachments, { file }] };
      })

      // 上传文件
      try {
        const result = await uploadSystemFile(file.file, (progress) => {
          setErpSalesReturnRequest((prev) => {
            const updatedAttachments = prev.attachments.map((item, idx) => {
              if (idx !== index) return item;
              const updatedItem = { ...item, file: { ...item.file!, progress } };
              return updatedItem;
            })
            return { ...prev, attachments: updatedAttachments };
          });
        });

        // 上传完成
        setErpSalesReturnRequest((prev) => {
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
        setErpSalesReturnRequest((prev) => {
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
      setErpSalesReturnRequest((prev) => {
        const updatedAttachments = prev.attachments.filter((_, idx) => idx !== index);
        return { ...prev, attachments: updatedAttachments };
      });
    }
  }, []);

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.edit') + t('global.page.erp.sales.return')}
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
          <Grid container rowSpacing={2} columnSpacing={4} sx={{ '& .MuiGrid-root': { display: 'flex', justifyContent: 'start', alignItems: 'center' } }}>
            <Grid size={size}>
              <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box>{t('page.erp.sale.order.title.order.number')}</Box>
                <Box>{erpSalesReturn && <CustomizedCopyableText text={erpSalesReturn.order_number} sx={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box>{t('page.erp.sales.return.title.sales.order')}</Box>
                <Box>{erpSalesOrder && <CustomizedCopyableText text={erpSalesOrder.order_number} sx={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box>{t('page.erp.sales.return.title.customer')}</Box>
                <Box>{erpSalesOrder && <CustomizedTag label={erpSalesOrder.customer_name} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <FormControl sx={{ mt: 2, minWidth: 120, width: '100%' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    name="return_date"
                    label={t('page.erp.sales.return.title.return.date')}
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
                <InputLabel size="small" id="settlement-account-select-label">{t('page.erp.sales.return.title.settlement.account')}</InputLabel>
                <Select
                  size="small"
                  labelId="settlement-account-select-label"
                  name="settlement_account_id"
                  value={erpSalesReturnRequest.settlement_account_id ?? ''}
                  onChange={handleSelectChange}
                  label={t('page.erp.sales.return.title.settlement.account')}
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
                label={t("page.erp.sales.return.title.total.amount")}
                name='total_amount'
                value={erpSalesReturnRequest.total_amount}
                onChange={handleInputChange}
                error={!!errors.total_amount}
                helperText={errors.total_amount}
              />
            </Grid>
            <Grid size={size}>
              <TextField
                size="small"
                type="number"
                label={t("page.erp.sales.return.title.discount.rate")}
                name='discount_rate'
                value={erpSalesReturnRequest.discount_rate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={size}>
              <TextField
                size="small"
                label={t("page.erp.sales.return.title.remarks")}
                name='remarks'
                value={erpSalesReturnRequest.remarks}
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
              <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.quantity')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.remarks')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.product')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.barcode')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.unit')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 200 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.remarks')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.unit.price')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.subtotal')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.tax.rate')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.tax')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('page.erp.purchase.order.detail.title.tax.total')}</Typography></Box>
            </Box>
            {erpSalesReturnRequest && erpSalesReturnRequest.details.map((item, index) => {
              let salesDetail = undefined;
              if (erpSalesOrderDetailMap && item.sale_detail_id && erpSalesOrderDetailMap.get(item.sale_detail_id)) {
                salesDetail = erpSalesOrderDetailMap && item.sale_detail_id && erpSalesOrderDetailMap.get(item.sale_detail_id);
              }
              return (
              <Box className='table-row' key={index}>
                <Box className='table-cell' sx={{ width: 50, verticalAlign: 'middle' }}><Typography variant="body1">{index + 1}</Typography></Box>
                <Box className='table-cell' sx={{ width: 100 }}>
                  <FormControl sx={{ minWidth: 120, width: '100%' }}>
                    <Select
                      size="small"
                      name="warehouse_id"
                      value={erpSalesReturnRequest.details[index].warehouse_id}
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
                    type="number"
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleDetailInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                    error={!!(errors.details[index]?.quantity)}
                    helperText={errors.details[index]?.quantity}
                  />
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField
                    size="small"
                    name="remarks"
                    defaultValue={erpSalesReturnRequest.details[index].remarks}
                    onChange={(e) => handleDetailInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                  />
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                    <TextField size="small" value={salesDetail && salesDetail.product_name} disabled />
                  </Box>
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <TextField size="small" value={salesDetail && salesDetail.product_barcode} disabled />
                  </Box>
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <TextField size="small" value={salesDetail && salesDetail.product_unit_name } disabled />
                  </Box>
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <TextField size="small" value={salesDetail && salesDetail.unit_price} disabled />
                  </Box>
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <TextField size="small" value={item.subtotal} disabled />
                  </Box>
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <TextField size="small" value={salesDetail && salesDetail.tax_rate} disabled />
                  </Box>
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <TextField size="small" value={salesDetail ? (item.quantity * salesDetail.unit_price * salesDetail.tax_rate) / 100 : 0} disabled />
                  </Box>
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <TextField size="small" value={salesDetail ? item.quantity * salesDetail.unit_price * (1 + salesDetail.tax_rate / 100) : 0} disabled />
                </Box>
              </Box>
            )})}
          </Box>
        </Card>

        <Typography variant="body1" sx={{ mt: 3, fontSize: '1rem', fontWeight: 500 }}>
          {t('page.erp.purchase.order.title.attachment')}
        </Typography>
        <Card variant="outlined" sx={{ width: '100%', mt: 1, p: 2 }}>
          <Grid container rowSpacing={2} columnSpacing={4} sx={{ '& .MuiGrid-root': { display: 'flex', justifyContent: 'center', alignItems: 'center' } }}>
            {erpSalesReturnRequest.attachments.map((item, index) => (
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
                id={'file-upload-' + erpSalesReturnRequest.attachments.length}
                accept=".jpg,jpeg,.png"
                maxSize={100}
                onChange={(file, action) => handleFileChange(file, action, erpSalesReturnRequest.attachments.length)}
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

export default ErpSalesReturnEdit;