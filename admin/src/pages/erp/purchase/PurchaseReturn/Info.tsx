import { Box, Card, FormControl, Grid, MenuItem, Select, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpPurchaseOrderDetailInfoResponse, ErpPurchaseOrderInfoResponse, ErpPurchaseReturnResponse, ErpWarehouseResponse, getErpPurchaseOrderInfo, getInfoErpPurchaseReturn, listErpWarehouse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import CustomizedFileUpload, { DownloadProps } from '@/components/CustomizedFileUpload';
import { downloadSystemFile } from '@/api/system_file';
import CustomizedCopyableText from '@/components/CustomizedCopyableText';
import CustomizedTag from '@/components/CustomizedTag';

const ErpPurchaseReturnInfo = forwardRef(({ }, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('xl');
  const [erpPurchaseOrder, setErpPurchaseOrder] = useState<ErpPurchaseOrderInfoResponse>();
  const [erpPurchaseOrderDetailMap, setErpPurchaseOrderDetailMap] = useState<Map<number, ErpPurchaseOrderDetailInfoResponse>>();
  const [warehouses, setWarehouses] = useState<ErpWarehouseResponse[]>([]);
  const [erpPurchaseReturn, setErpPurchaseReturn] = useState<ErpPurchaseReturnResponse>();
  const [size] = useState({ xs: 12, md: 3 });
  const [fileWidth] = useState<number>(420);
  const [fileHeight] = useState<number>(245);
  const [downloadImages, setDownloadImages] = useState<Map<number, DownloadProps>>(new Map<number, DownloadProps>());

  useImperativeHandle(ref, () => ({
    show(erpPurchaseReturnRequest: ErpPurchaseReturnResponse) {
      initForm(erpPurchaseReturnRequest);
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

  const handleClose = () => {
    setOpen(false);
  };

  const initForm = async (erpPurchaseReturnRequest: ErpPurchaseReturnResponse) => {
    // 查询退货订单
    const result = await getInfoErpPurchaseReturn(erpPurchaseReturnRequest.id);
    // 查询采购订单
    const purchaseOrder = await getErpPurchaseOrderInfo(erpPurchaseReturnRequest.purchase_order_id);

    const purchaseOrderDetailMap: Map<number, ErpPurchaseOrderDetailInfoResponse> = new Map();
    for (const purchaseDetail of purchaseOrder.purchase_products) {
      purchaseOrderDetailMap.set(purchaseDetail.id, purchaseDetail);
    }
    setErpPurchaseOrderDetailMap(purchaseOrderDetailMap);
    setErpPurchaseOrder(purchaseOrder);
    setErpPurchaseReturn(result);
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
  }

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.view') + t('global.page.erp.purchase.return')}
      maxWidth={maxWidth}
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
                <Box>{erpPurchaseReturn && <CustomizedCopyableText text={erpPurchaseReturn.order_number} sx={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box>{t('erp.common.title.purchase')}</Box>
                <Box>{erpPurchaseOrder && <CustomizedCopyableText text={erpPurchaseOrder.order_number} sx={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box>{t('erp.common.title.supplier')}</Box>
                <Box>{erpPurchaseOrder && <CustomizedTag label={erpPurchaseOrder.supplier_name} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box>{t('page.erp.purchase.return.title.return.date')}</Box>
                <Box>{erpPurchaseReturn && <CustomizedTag label={erpPurchaseReturn.return_date} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box>{t('erp.common.title.settlement.account')}</Box>
                <Box>{erpPurchaseReturn && <CustomizedTag label={erpPurchaseReturn.settlement_account_name} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box>{t('erp.common.title.total.amount')}</Box>
                <Box>{erpPurchaseReturn && <CustomizedTag label={erpPurchaseReturn.total_amount} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box>{t('erp.common.title.discount.rate')}</Box>
                <Box>{erpPurchaseReturn && <CustomizedTag label={erpPurchaseReturn.discount_rate} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box>{t('common.title.remark')}</Box>
                <Box>{erpPurchaseReturn && <CustomizedTag label={erpPurchaseReturn.remarks} />}</Box>
              </Stack>
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
              <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('erp.detail.common.title.quantity')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.remarks')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.product')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.barcode')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.unit')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 200 }}><Typography variant="body1">{t('erp.detail.common.title.remarks')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('erp.detail.common.title.unit.price')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.subtotal')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.tax.rate')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.tax')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 100 }}><Typography variant="body1">{t('erp.detail.common.title.tax.total')}</Typography></Box>
            </Box>
            {erpPurchaseReturn && erpPurchaseReturn.details.map((item, index) => {
              let purchaseDetail = undefined;
              if (erpPurchaseOrderDetailMap && item.purchase_detail_id && erpPurchaseOrderDetailMap.get(item.purchase_detail_id) && erpPurchaseOrderDetailMap.get(item.purchase_detail_id)) {
                purchaseDetail = erpPurchaseOrderDetailMap && item.purchase_detail_id && erpPurchaseOrderDetailMap.get(item.purchase_detail_id) && erpPurchaseOrderDetailMap.get(item.purchase_detail_id)
              }
              return (
                <Box className='table-row' key={index}>
                  <Box className='table-cell' sx={{ width: 50, verticalAlign: 'middle' }}><Typography variant="body1">{index + 1}</Typography></Box>
                  <Box className='table-cell' sx={{ width: 100 }}>
                    <FormControl sx={{ minWidth: 120, width: '100%' }}>
                      <Select
                        size="small"
                        name="warehouse_id"
                        value={item.warehouse_id}
                      >
                        {warehouses.map((warehouse) => (
                          <MenuItem key={warehouse.id} value={warehouse.id}>
                            {warehouse.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <Typography variant="body1">{item.quantity}</Typography>
                  </Box>
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <Typography variant="body1">{item.remarks}</Typography>
                  </Box>
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <Typography variant="body1">{purchaseDetail && purchaseDetail.product_name}</Typography>
                  </Box>
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <Typography variant="body1">{purchaseDetail && purchaseDetail.product_barcode}</Typography>
                  </Box>
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <Typography variant="body1">{purchaseDetail && purchaseDetail.product_unit_name}</Typography>
                  </Box>
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <Typography variant="body1">{purchaseDetail && purchaseDetail.unit_price}</Typography>
                  </Box>
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <Typography variant="body1">{item.subtotal}</Typography>
                  </Box>
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <Typography variant="body1">{purchaseDetail && purchaseDetail.tax_rate}</Typography>
                  </Box>
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <Typography variant="body1">{purchaseDetail ? (item.quantity * purchaseDetail.unit_price * purchaseDetail.tax_rate) / 100 : 0}</Typography>
                  </Box>
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <Typography variant="body1">{purchaseDetail ? item.quantity * purchaseDetail.unit_price * (1 + purchaseDetail.tax_rate / 100) : 0}</Typography>
                  </Box>
                </Box>
              )
            })}
          </Box>
        </Card>

        <Typography variant="body1" sx={{ mt: 3, fontSize: '1rem', fontWeight: 500 }}>
          {t('erp.common.title.attachment')}
        </Typography>
        <Card variant="outlined" sx={{ width: '100%', mt: 1, p: 2 }}>
          <Grid container rowSpacing={2} columnSpacing={4} sx={{ '& .MuiGrid-root': { display: 'flex', justifyContent: 'center', alignItems: 'center' } }}>
            {erpPurchaseReturn && erpPurchaseReturn.attachments.map((item, index) => (
              <Grid key={index} size={{ xs: 12, md: 4 }}>
                <CustomizedFileUpload
                  canUpload={false}
                  id={'file-upload-' + index}
                  accept=".jpg,jpeg,.png"
                  maxSize={100}
                  width={fileWidth}
                  height={fileHeight}
                  download={downloadImages?.get(item.file_id!)}
                >
                </CustomizedFileUpload>
              </Grid>
            ))}
          </Grid>
        </Card>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpPurchaseReturnInfo;