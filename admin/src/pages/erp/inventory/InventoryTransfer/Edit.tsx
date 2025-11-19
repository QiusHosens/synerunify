import { Box, Button, Card, FormControl, FormHelperText, Grid, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpInventoryTransferAttachmentRequest, ErpInventoryTransferDetailRequest, ErpInventoryTransferRequest, ErpInventoryTransferResponse, ErpProductResponse, ErpWarehouseResponse, getBaseErpInventoryTransfer, listErpProduct, listErpWarehouse, updateErpInventoryTransfer } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import { useMessage } from '@/components/GlobalMessage';
import dayjs, { Dayjs } from 'dayjs';
import CustomizedFileUpload, { DownloadProps, UploadFile } from '@/components/CustomizedFileUpload';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { downloadSystemFile, uploadSystemFile } from '@/api/system_file';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import CustomizedCopyableText from '@/components/CustomizedCopyableText';

interface FormDetailErrors {
  from_warehouse_id?: string; // 调出仓库ID
  to_warehouse_id?: string; // 调入仓库ID
  product_id?: string; // 产品ID
  quantity?: string; // 调拨数量
}

interface FormErrors {
  transfer_date?: string; // 调拨日期
  details: FormDetailErrors[];
}

interface ErpInventoryTransferEditProps {
  onSubmit: () => void;
}

const ErpInventoryTransferEdit = forwardRef(({ onSubmit }: ErpInventoryTransferEditProps, ref) => {
  const { t } = useTranslation();
  const { showMessage } = useMessage();
  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('xl');
  const [warehouses, setWarehouses] = useState<ErpWarehouseResponse[]>([]);
  const [products, setProducts] = useState<ErpProductResponse[]>([]);
  const [transferDate, setTransferDate] = useState<Dayjs | null>(null);
  const [erpInventoryTransfer, setErpInventoryTransfer] = useState<ErpInventoryTransferResponse>();
  const [erpInventoryTransferRequest, setErpInventoryTransferRequest] = useState<ErpInventoryTransferRequest>({
    id: 0,
    transfer_date: '',
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
    show(erpInventoryTransferRequest: ErpInventoryTransferResponse) {
      initForm(erpInventoryTransferRequest);
      initWarehouses();
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      details: erpInventoryTransferRequest.details.map(() => ({
        warehouse_id: undefined,
        product_id: undefined,
        checked_quantity: undefined,
      })),
    };

    if (!erpInventoryTransferRequest.transfer_date.trim()) {
      newErrors.transfer_date = t('global.error.select.please') + t('page.erp.inventory.transfer.title.transfer.date');
    }

    erpInventoryTransferRequest.details.forEach((product, index) => {
      if (!product.from_warehouse_id) {
        newErrors.details[index].from_warehouse_id = t('global.error.select.please') + t('erp.detail.common.title.warehouse.from');
      }
      if (!product.to_warehouse_id) {
        newErrors.details[index].to_warehouse_id = t('global.error.select.please') + t('erp.detail.common.title.warehouse.to');
      }
      if (!product.product_id && product.product_id !== 0) {
        newErrors.details[index].product_id = t('global.error.select.please') + t('erp.common.title.product');
      }
      if (!product.quantity && product.quantity !== 0) {
        newErrors.details[index].quantity = t('global.error.input.please') + t('erp.detail.common.title.quantity');
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

  const initForm = async (erpInventoryTransferRequest: ErpInventoryTransferResponse) => {
    const products = await listErpProduct();
    setProducts(products);
    const result = await getBaseErpInventoryTransfer(erpInventoryTransferRequest.id);
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
    setErpInventoryTransferRequest({
      ...result,
      details,
    })
    setErpInventoryTransfer(erpInventoryTransferRequest);
    setTransferDate(dayjs(result.transfer_date));
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
      const details: ErpInventoryTransferDetailRequest[] = [];
      for (const product of erpInventoryTransferRequest.details) {
        const detail: ErpInventoryTransferDetailRequest = {
          from_warehouse_id: product.from_warehouse_id,
          to_warehouse_id: product.to_warehouse_id,
          product_id: product.product_id!,
          quantity: product.quantity,
          remarks: product.remarks,
        } as ErpInventoryTransferDetailRequest;
        if (product.id) {
          detail.id = product.id;
        }
        details.push(detail);
      }
      const attachments: ErpInventoryTransferAttachmentRequest[] = [];
      for (const attachment of erpInventoryTransferRequest.attachments) {
        const attach: ErpInventoryTransferAttachmentRequest = {
          file_id: attachment.file_id!
        } as ErpInventoryTransferAttachmentRequest;
        if (attachment.id) {
          attach.id = attachment.id;
        }
        attachments.push(attach);
      }
      const request: ErpInventoryTransferRequest = {
        id: erpInventoryTransferRequest.id,
        transfer_date: erpInventoryTransferRequest.transfer_date,
        remarks: erpInventoryTransferRequest.remarks,
        details,
        attachments
      }
      await updateErpInventoryTransfer(request);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setErpInventoryTransferRequest((prev) => ({
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
    setTransferDate(value);
    if (value) {
      setErpInventoryTransferRequest((prev) => ({ ...prev, transfer_date: value.format('YYYY-MM-DD HH:mm:ss') }));
      setErrors((prev) => ({ ...prev, transfer_date: undefined }));
    }
  }, []);

  const handleAddDetail = useCallback(() => {
    if (!warehouses || warehouses.length == 0) {
      showMessage(t('erp.detail.common.error.warehouse.empty'));
    }
    if (!warehouses || warehouses.length == 1) {
      showMessage(t('erp.detail.common.error.warehouse.only.one'));
    }
    if (!products || products.length == 0) {
      showMessage(t('erp.detail.common.error.product.empty'));
    }

    const newDetail: ErpInventoryTransferDetailRequest = {
      from_warehouse_id: warehouses[0].id,
      to_warehouse_id: warehouses[1].id,
      product_id: products[0].id,
      quantity: 1,
      remarks: '',
      product: products[0],
    };
    setErpInventoryTransferRequest((prev) => ({
      ...prev,
      details: [...prev.details, newDetail],
    }));
    setErrors((prev) => ({
      ...prev,
      details: [
        ...prev.details,
        { warehouse_id: undefined, product_id: undefined, quantity: undefined, unit_price: undefined, tax_rate: undefined },
      ],
    }));
  }, [products, showMessage, t]);

  const handleClickDetailDelete = useCallback((index: number) => {
    setErpInventoryTransferRequest((prev) => ({
      ...prev,
      details: prev.details.filter((_, idx) => idx !== index),
    }));
    setErrors((prev) => ({
      ...prev,
      details: prev.details.filter((_, idx) => idx !== index),
    }));
  }, []);

  const handleWarehouseSelectChange = useCallback((e: SelectChangeEvent<number>, index: number) => {
    const { name, value } = e.target;
    setErpInventoryTransferRequest((prev) => ({
      ...prev,
      details: prev.details.map((item, idx) =>
        idx === index ? { ...item, [name]: value } : item
      ),
    }));
    setErrors((prev) => ({
      ...prev,
      details: prev.details.map((item, idx) =>
        idx === index ? { ...item, [name]: undefined } : item
      ),
    }));
  }, [warehouses]);

  const handleProductSelectChange = useCallback((e: SelectChangeEvent<number>, index: number) => {
    const { value } = e.target;
    const product = products.find((p) => p.id === value);
    setErpInventoryTransferRequest((prev) => ({
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

  const handleDetailInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value, type } = e.target;
    const numberValue = type === 'number' ? Number(value) : value;
    setErpInventoryTransferRequest((prev) => {
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
      setErpInventoryTransferRequest((prev) => {
        return { ...prev, attachments: [...prev.attachments, { file }] };
      })

      // 上传文件
      try {
        const result = await uploadSystemFile(file.file, (progress) => {
          setErpInventoryTransferRequest((prev) => {
            const updatedAttachments = prev.attachments.map((item, idx) => {
              if (idx !== index) return item;
              const updatedItem = { ...item, file: { ...item.file!, progress } };
              return updatedItem;
            })
            return { ...prev, attachments: updatedAttachments };
          });
        });

        // 上传完成
        setErpInventoryTransferRequest((prev) => {
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
        setErpInventoryTransferRequest((prev) => {
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
      setErpInventoryTransferRequest((prev) => {
        const updatedAttachments = prev.attachments.filter((_, idx) => idx !== index);
        return { ...prev, attachments: updatedAttachments };
      });
    }
  }, []);

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.edit') + t('global.page.erp.inventory.transfer')}
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
                <Box>{erpInventoryTransfer && <CustomizedCopyableText text={erpInventoryTransfer.order_number} sx={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <FormControl sx={{ mt: 2, minWidth: 120, width: '100%' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    name="inbound_date"
                    label={t('page.erp.inventory.transfer.title.transfer.date')}
                    value={transferDate}
                    onChange={handleDateTimeChange}
                    slotProps={{
                      textField: {
                        size: 'small',
                        required: true,
                        error: !!errors.transfer_date,
                        helperText: errors.transfer_date,
                      },
                      openPickerButton: {
                        sx: { mr: -1, '& .MuiSvgIcon-root': { fontSize: '1rem' } },
                      },
                    }}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label={t("common.title.remark")}
                name='remarks'
                value={erpInventoryTransferRequest.remarks}
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
              <Box className='table-cell' sx={{ width: 200 }}><Typography variant="body1">{t('erp.detail.common.title.warehouse.from')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 200 }}><Typography variant="body1">{t('erp.detail.common.title.warehouse.to')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 200 }}><Typography variant="body1">{t('erp.detail.common.title.product')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 200 }}><Typography variant="body1">{t('erp.detail.common.title.barcode')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.unit')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.stock')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('erp.detail.common.title.quantity')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 200 }}><Typography variant="body1">{t('erp.detail.common.title.remarks')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 50 }}><Typography variant="body1">{t('global.operate.actions')}</Typography></Box>
            </Box>
            {erpInventoryTransferRequest.details.map((item, index) => (
              <Box className='table-row' key={index}>
                <Box className='table-cell' sx={{ width: 50, verticalAlign: 'middle' }}><Typography variant="body1">{index + 1}</Typography></Box>
                <Box className='table-cell' sx={{ width: 100 }}>
                  <FormControl sx={{ minWidth: 120, width: '100%' }}>
                    <Select
                      size="small"
                      name="from_warehouse_id"
                      value={item.from_warehouse_id}
                      onChange={(e) => handleWarehouseSelectChange(e, index)}
                      error={!!(errors.details[index]?.from_warehouse_id)}
                    >
                      {warehouses.map((warehouse) => (
                        <MenuItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.details[index]?.from_warehouse_id}</FormHelperText>
                  </FormControl>
                </Box>
                <Box className='table-cell' sx={{ width: 100 }}>
                  <FormControl sx={{ minWidth: 120, width: '100%' }}>
                    <Select
                      size="small"
                      name="to_warehouse_id"
                      value={item.to_warehouse_id}
                      onChange={(e) => handleWarehouseSelectChange(e, index)}
                      error={!!(errors.details[index]?.to_warehouse_id)}
                    >
                      {warehouses.map((warehouse) => (
                        <MenuItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.details[index]?.to_warehouse_id}</FormHelperText>
                  </FormControl>
                </Box>
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
                    onChange={(e) => handleDetailInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                  />
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
            <Button variant="outlined" startIcon={<AddCircleSharpIcon />} onClick={handleAddDetail}>
              {t('erp.common.operate.add')}
            </Button>
          </Box>
        </Card>

        <Typography variant="body1" sx={{ mt: 3, fontSize: '1rem', fontWeight: 500 }}>
          {t('erp.common.title.attachment')}
        </Typography>
        <Card variant="outlined" sx={{ width: '100%', mt: 1, p: 2 }}>
          <Grid container rowSpacing={2} columnSpacing={4} sx={{ '& .MuiGrid-root': { display: 'flex', justifyContent: 'center', alignItems: 'center' } }}>
            {erpInventoryTransferRequest.attachments.map((item, index) => (
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
                id={'file-upload-' + erpInventoryTransferRequest.attachments.length}
                accept=".jpg,jpeg,.png"
                maxSize={100}
                onChange={(file, action) => handleFileChange(file, action, erpInventoryTransferRequest.attachments.length)}
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

export default ErpInventoryTransferEdit;