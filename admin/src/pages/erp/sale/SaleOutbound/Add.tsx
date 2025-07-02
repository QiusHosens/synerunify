import { Box, Button, Card, FormControl, FormHelperText, Grid, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createSaleErpOutboundOrder, ErpOutboundOrderAttachmentRequest, ErpOutboundOrderDetailRequest, ErpOutboundOrderRequest, ErpSalesOrderInfoResponse, ErpSettlementAccountResponse, ErpWarehouseResponse, getErpSalesOrderInfo, listErpSettlementAccount, listErpWarehouse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import CustomizedFileUpload, { UploadFile } from '@/components/CustomizedFileUpload';
import { Dayjs } from 'dayjs';
import SalesOrderSelect from './SalesOrderSelect';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { uploadSystemFile } from '@/api/system_file';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SearchIcon from '@/assets/image/svg/search.svg';

interface FormAttachmentValues {
  file_id?: number; // 文件ID
  remarks?: string; // 备注

  file?: UploadFile | null;
}

interface FormDetailValues {
  sale_detail_id: number; // 采购订单详情ID
  warehouse_id?: number; // 仓库ID
  remarks: string; // 备注
}

interface FormValues {
  sale_id?: number; // 销售订单ID
  outbound_date: string; // 出库日期
  remarks: string; // 备注
  discount_rate: number; // 优惠率（百分比，1000表示10.00%）
  other_cost: number; // 其他费用
  settlement_account_id?: number; // 结算账户ID

  details: FormDetailValues[];
  attachments: FormAttachmentValues[];
}

interface FormDetailErrors {
  warehouse_id?: string; // 仓库ID
}

interface FormErrors {
  sale_id?: string; // 订单编号
  outbound_date?: string; // 出库日期
  details: FormDetailErrors[];
}

interface ErpOutboundOrderAddProps {
  onSubmit: () => void;
}

const ErpOutboundOrderAdd = forwardRef(({ onSubmit }: ErpOutboundOrderAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('xl');
  const [erpSalesOrder, setErpSalesOrder] = useState<ErpSalesOrderInfoResponse>();
  const [warehouses, setWarehouses] = useState<ErpWarehouseResponse[]>([]);
  const [settlementAccounts, setSettlementAccounts] = useState<ErpSettlementAccountResponse[]>([]);
  const [outboundDate, setOutboundDate] = useState<Dayjs | null>(null);
  const [formValues, setFormValues] = useState<FormValues>({
    outbound_date: '',
    remarks: '',
    discount_rate: 0,
    other_cost: 0,
    details: [],
    attachments: []
  });
  const [errors, setErrors] = useState<FormErrors>({
    details: [],
  });
  const [size] = useState({ xs: 12, md: 3 });
  const [fileWidth] = useState<number>(420);
  const [fileHeight] = useState<number>(245);

  const selectErpSalesOrder = useRef(null);

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

  const selectedErpSalesOrder = useCallback(async (id: number) => {
    const result = await getErpSalesOrderInfo(id);
    const warehouses = await listErpWarehouse();
    setWarehouses(warehouses);
    // 根据产品数量设置仓库
    let defaultWarehouse = undefined;
    if (warehouses.length > 0) {
      defaultWarehouse = warehouses[0].id;
    }
    const details: FormDetailValues[] = [];
    for (const product of result.details) {
      const detail: FormDetailValues = {
        sale_detail_id: product.id,
        remarks: ''
      };
      if (defaultWarehouse) {
        detail.warehouse_id = defaultWarehouse;
      }
      details.push(detail);
    }
    setFormValues(prev => ({
      ...prev,
      sale_id: id,
      details
    }))
    setErrors((prev) => ({ ...prev, sale_id: undefined }));
    setErpSalesOrder(result);
  }, []);

  const handleClickOpenSalesOrderSelect = useCallback(async () => {
    (selectErpSalesOrder.current as any).show();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      details: formValues.details.map(() => ({
        warehouse_id: undefined,
      })),
    };

    if (!formValues.sale_id && formValues.sale_id != 0) {
      newErrors.sale_id = t('global.error.select.please') + t('erp.common.title.sale');
    }

    if (!formValues.outbound_date.trim()) {
      newErrors.outbound_date = t('global.error.select.please') + t('page.erp.sale.outbound.title.outbound.date');
    }

    formValues.details.forEach((product, index) => {
      if (!product.warehouse_id) {
        newErrors.details[index].warehouse_id = t('global.error.select.please') + t('erp.detail.common.title.warehouse');
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
      outbound_date: '',
      remarks: '',
      discount_rate: 0,
      other_cost: 0,
      details: [],
      attachments: []
    });
    setOutboundDate(null);
    setErrors({
      details: [],
    });
    setErpSalesOrder(undefined);
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      const details: ErpOutboundOrderDetailRequest[] = [];
      for (const product of formValues.details) {
        details.push({
          sale_detail_id: product.sale_detail_id!,
          warehouse_id: product.warehouse_id,
          remarks: product.remarks,
        } as ErpOutboundOrderDetailRequest);
      }
      const attachments: ErpOutboundOrderAttachmentRequest[] = [];
      for (const attachment of formValues.attachments) {
        attachments.push({
          file_id: attachment.file_id!
        } as ErpOutboundOrderAttachmentRequest);
      }
      const request: ErpOutboundOrderRequest = {
        sale_id: formValues.sale_id!,
        outbound_date: formValues.outbound_date,
        discount_rate: formValues.discount_rate,
        settlement_account_id: formValues.settlement_account_id,
        other_cost: formValues.other_cost,
        remarks: formValues.remarks,
        details,
        attachments
      }
      await createSaleErpOutboundOrder(request);
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
    setOutboundDate(value);
    if (value) {
      setFormValues((prev) => ({ ...prev, outbound_date: value.format('YYYY-MM-DD HH:mm:ss') }));
      setErrors((prev) => ({ ...prev, outbound_date: undefined }));
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
      title={t('global.operate.add') + t('global.page.erp.sale.outbound')}
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
              <TextField size="small" label={t('erp.common.placeholder.order.number')} disabled />
            </Grid>
            <Grid size={size}>
              <FormControl sx={{ mt: 2, minWidth: 120, width: '100%', '& .MuiOutlinedInput-root': { width: '100%', pr: 0 } }} variant="outlined" error={!!errors.sale_id}>
                <InputLabel required size="small" shrink={erpSalesOrder ? true : false} htmlFor="return-sales-id">{t("erp.common.title.sale")}</InputLabel>
                <OutlinedInput
                  required
                  size="small"
                  id="return-sales-id"
                  type='text'
                  label={t("erp.common.title.sale")}
                  value={erpSalesOrder && erpSalesOrder.order_number}
                  onChange={handleInputChange}
                  error={!!errors.sale_id}
                  disabled
                  notched={!!erpSalesOrder}
                  endAdornment={
                    <InputAdornment position="end">
                      <Button
                        size="small"
                        variant='customContained'
                        startIcon={<SearchIcon />}
                        onClick={() => handleClickOpenSalesOrderSelect()}
                      >
                        {t('global.operate.select')}
                      </Button>
                    </InputAdornment>
                  }
                />
                <FormHelperText sx={{ color: 'error.main' }} id="return-sales-id">{errors.sale_id}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={size}>
              <TextField
                required
                size="small"
                label={t("erp.common.title.customer")}
                value={erpSalesOrder && erpSalesOrder.customer_name}
                onChange={handleInputChange}
                disabled
                slotProps={erpSalesOrder ?
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
                    label={t('page.erp.sale.outbound.title.outbound.date')}
                    value={outboundDate}
                    onChange={handleDateTimeChange}
                    slotProps={{
                      textField: {
                        size: 'small',
                        required: true,
                        error: !!errors.outbound_date,
                        helperText: errors.outbound_date,
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
                label={t("erp.common.title.discount.rate")}
                name='discount_rate'
                value={formValues.discount_rate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={size}>
              <TextField
                size="small"
                type="number"
                label={t("erp.common.title.other.cost")}
                name='other_cost'
                value={formValues.other_cost}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={size}>
              <TextField
                size="small"
                label={t("common.title.remark")}
                name='remarks'
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
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.warehouse')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.remarks')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.product')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.barcode')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.unit')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 200 }}><Typography variant="body1">{t('erp.detail.common.title.remarks')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('erp.detail.common.title.quantity')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('erp.detail.common.title.unit.price')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.subtotal')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.tax.rate')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.tax')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.tax.total')}</Typography></Box>
            </Box>
            {erpSalesOrder && erpSalesOrder.details.map((item, index) => (
              <Box className='table-row' key={index}>
                <Box className='table-cell' sx={{ width: 50, verticalAlign: 'middle' }}><Typography variant="body1">{index + 1}</Typography></Box>
                <Box className='table-cell' sx={{ width: 100 }}>
                  <FormControl sx={{ minWidth: 120, width: '100%' }}>
                    <Select
                      size="small"
                      name="warehouse_id"
                      value={formValues.details[index].warehouse_id}
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
                    value={formValues.details[index].remarks}
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
          {t('erp.common.title.attachment')}
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
      <SalesOrderSelect ref={selectErpSalesOrder} onSubmit={selectedErpSalesOrder} />
    </CustomizedDialog>
  )
});

export default ErpOutboundOrderAdd;