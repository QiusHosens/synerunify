import { Box, Button, Card, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpInboundOrderAttachmentRequest, ErpInboundOrderBaseResponse, ErpInboundOrderRequest, ErpInboundOrderResponse, ErpProductResponse, ErpSettlementAccountResponse, ErpSupplierResponse, ErpWarehouseResponse, getBaseOtherErpInboundOrder, listErpProduct, listErpSettlementAccount, listErpSupplier, listErpWarehouse, updateOtherErpInboundOrder } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CustomizedFileUpload, { DownloadProps, UploadFile } from '@/components/CustomizedFileUpload';
import { downloadSystemFile, uploadSystemFile } from '@/api/system_file';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import CustomizedCopyableText from '@/components/CustomizedCopyableText';

interface FormErrors {
  supplier_id?: string;
  inbound_date?: string; // 入库日期
}

interface ErpInboundOrderEditProps {
  onSubmit: () => void;
}

const ErpInboundOrderEdit = forwardRef(({ onSubmit }: ErpInboundOrderEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('xl');
  const [suppliers, setSuppliers] = useState<ErpSupplierResponse[]>([]);
  const [warehouses, setWarehouses] = useState<ErpWarehouseResponse[]>([]);
  const [settlementAccounts, setSettlementAccounts] = useState<ErpSettlementAccountResponse[]>([]);
  const [products, setProducts] = useState<ErpProductResponse[]>([]);
  const [inboundDate, setInboundDate] = useState<Dayjs | null>(null);
  const [erpInboundOrder, setErpInboundOrder] = useState<ErpInboundOrderBaseResponse>();
  const [erpInboundOrderRequest, setErpInboundOrderRequest] = useState<ErpInboundOrderRequest>({
    id: 0,
    supplier_id: 0,
    inbound_date: '',
    remarks: '',
    discount_rate: 0,
    other_cost: 0,
    settlement_account_id: 0,
    details: [],
    attachments: []
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [size] = useState({ xs: 12, md: 3 });
  const [fileWidth] = useState<number>(420);
  const [fileHeight] = useState<number>(245);
  const [downloadImages, setDownloadImages] = useState<Map<number, DownloadProps>>(new Map<number, DownloadProps>());

  useImperativeHandle(ref, () => ({
    show(erpInboundOrderRequest: ErpInboundOrderResponse) {
      initForm(erpInboundOrderRequest);
      initSuppliers();
      initWarehouses();
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

  const initWarehouses = useCallback(async () => {
    const warehouses = await listErpWarehouse();
    setWarehouses(warehouses);
  }, []);

  const initSettlementAccounts = useCallback(async () => {
    const result = await listErpSettlementAccount();
    setSettlementAccounts(result);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!erpInboundOrderRequest.supplier_id && erpInboundOrderRequest.supplier_id !== 0) {
      newErrors.supplier_id = t('global.error.select.please') + t('erp.common.title.supplier');
    }

    if (!erpInboundOrderRequest.inbound_date.trim()) {
      newErrors.inbound_date = t('global.error.select.please') + t('page.erp.purchase.inbound.title.inbound.date');
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

  const initForm = async (erpInboundOrderRequest: ErpInboundOrderResponse) => {
    const products = await listErpProduct();
    setProducts(products);
    // 查询入库订单
    const result = await getBaseOtherErpInboundOrder(erpInboundOrderRequest.id);
    setErpInboundOrder(result);
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
    setErpInboundOrderRequest({
      ...result,
      details,
    })
    setInboundDate(dayjs(result.inbound_date));
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
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      const attachments: ErpInboundOrderAttachmentRequest[] = [];
      for (const attachment of erpInboundOrderRequest.attachments) {
        const attach: ErpInboundOrderAttachmentRequest = {
          file_id: attachment.file_id!
        } as ErpInboundOrderAttachmentRequest
        if (attachment.id) {
          attach.id = attachment.id;
        }
        attachments.push(attach);
      }
      const request: ErpInboundOrderRequest = {
        id: erpInboundOrderRequest.id,
        supplier_id: erpInboundOrderRequest.supplier_id!,
        inbound_date: erpInboundOrderRequest.inbound_date,
        discount_rate: erpInboundOrderRequest.discount_rate,
        settlement_account_id: erpInboundOrderRequest.settlement_account_id,
        other_cost: erpInboundOrderRequest.other_cost,
        remarks: erpInboundOrderRequest.remarks,
        attachments
      }
      await updateOtherErpInboundOrder(request);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setErpInboundOrderRequest((prev) => ({
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
    setInboundDate(value);
    if (value) {
      setErpInboundOrderRequest((prev) => ({ ...prev, inbound_date: value.format('YYYY-MM-DD HH:mm:ss') }));
      setErrors((prev) => ({ ...prev, inbound_date: undefined }));
    }
  }, []);

  const handleSelectChange = useCallback((e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setErpInboundOrderRequest((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleFileChange = useCallback(async (file: UploadFile | null, action: 'upload' | 'remove', index: number) => {
    // console.log(`Upload ${index} file updated:`, file, `Action: ${action}`);

    if (action === 'upload' && file) {
      // 更新文件列表,增加一个附件,等待上传完成后在写入信息
      setErpInboundOrderRequest((prev) => {
        return { ...prev, attachments: [...prev.attachments, { file }] };
      })

      // 上传文件
      try {
        const result = await uploadSystemFile(file.file, (progress) => {
          setErpInboundOrderRequest((prev) => {
            const updatedAttachments = prev.attachments.map((item, idx) => {
              if (idx !== index) return item;
              const updatedItem = { ...item, file: { ...item.file!, progress } };
              return updatedItem;
            })
            return { ...prev, attachments: updatedAttachments };
          });
        });

        // 上传完成
        setErpInboundOrderRequest((prev) => {
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
        setErpInboundOrderRequest((prev) => {
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
      setErpInboundOrderRequest((prev) => {
        const updatedAttachments = prev.attachments.filter((_, idx) => idx !== index);
        return { ...prev, attachments: updatedAttachments };
      });
    }
  }, []);

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.edit') + t('global.page.erp.purchase.inbound')}
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
                <Box>{erpInboundOrder && <CustomizedCopyableText text={erpInboundOrder.order_number} sx={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }} />}</Box>
              </Stack>
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
                  value={erpInboundOrderRequest.supplier_id ?? ''}
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
                    name="inbound_date"
                    label={t('page.erp.purchase.inbound.title.inbound.date')}
                    value={inboundDate}
                    onChange={handleDateTimeChange}
                    slotProps={{
                      textField: {
                        size: 'small',
                        required: true,
                        error: !!errors.inbound_date,
                        helperText: errors.inbound_date,
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
                  value={erpInboundOrderRequest.settlement_account_id ?? ''}
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
                value={erpInboundOrderRequest.discount_rate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={size}>
              <TextField
                size="small"
                type="number"
                label={t("erp.common.title.other.cost")}
                name='other_cost'
                value={erpInboundOrderRequest.other_cost}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={size}>
              <TextField
                size="small"
                label={t("common.title.remark")}
                name='remarks'
                value={erpInboundOrderRequest.remarks}
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
            {erpInboundOrderRequest && erpInboundOrderRequest.details && erpInboundOrderRequest.details.map((item, index) => (
              <Box className='table-row' key={index}>
                <Box className='table-cell' sx={{ width: 50, verticalAlign: 'middle' }}><Typography variant="body1">{index + 1}</Typography></Box>
                <Box className='table-cell' sx={{ width: 100 }}>
                  <FormControl sx={{ minWidth: 120, width: '100%' }}>
                    <Select
                      size="small"
                      name="warehouse_id"
                      value={item.warehouse_id}
                      disabled
                    >
                      {warehouses.map((warehouse) => (
                        <MenuItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box className='table-cell' sx={{ width: 100 }}>
                  <FormControl sx={{ minWidth: 120, width: '100%' }}>
                    <Select
                      size="small"
                      name="product_id"
                      value={item.product_id ?? ''}
                      disabled
                    >
                      {products.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                          {product.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                {/* <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField size="small" value={item.product?.stock_quantity ?? ''} disabled />
                </Box> */}
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
                    disabled
                  />
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
                  <TextField size="small" value={(item.quantity! * item.unit_price! * item.tax_rate!) / 100} disabled />
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField size="small" value={item.quantity! * item.unit_price! * (1 + item.tax_rate! / 100)} disabled />
                </Box>
              </Box>
            )
            )}
          </Box>
        </Card>

        <Typography variant="body1" sx={{ mt: 3, fontSize: '1rem', fontWeight: 500 }}>
          {t('erp.common.title.attachment')}
        </Typography>
        <Card variant="outlined" sx={{ width: '100%', mt: 1, p: 2 }}>
          <Grid container rowSpacing={2} columnSpacing={4} sx={{ '& .MuiGrid-root': { display: 'flex', justifyContent: 'center', alignItems: 'center' } }}>
            {erpInboundOrderRequest.attachments.map((item, index) => (
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
                id={'file-upload-' + erpInboundOrderRequest.attachments.length}
                accept=".jpg,jpeg,.png"
                maxSize={100}
                onChange={(file, action) => handleFileChange(file, action, erpInboundOrderRequest.attachments.length)}
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

export default ErpInboundOrderEdit;