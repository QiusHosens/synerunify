import { Box, Card, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpInboundOrderBaseResponse, ErpInboundOrderResponse, ErpPurchaseOrderDetailInfoResponse, ErpPurchaseOrderInfoResponse, ErpSettlementAccountResponse, ErpWarehouseResponse, getErpPurchaseOrderInfo, getInfoPurchaseErpInboundOrder, listErpSettlementAccount, listErpWarehouse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import CustomizedFileUpload, { DownloadProps } from '@/components/CustomizedFileUpload';
import { downloadSystemFile } from '@/api/system_file';
import CustomizedTag from '@/components/CustomizedTag';
import CustomizedCopyableText from '@/components/CustomizedCopyableText';

const ErpInboundOrderInfo = forwardRef(({ }, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('xl');
  const [erpPurchaseOrder, setErpPurchaseOrder] = useState<ErpPurchaseOrderInfoResponse>();
  const [erpPurchaseOrderDetailMap, setErpPurchaseOrderDetailMap] = useState<Map<number, ErpPurchaseOrderDetailInfoResponse>>();
  const [erpInboundOrder, setErpInboundOrder] = useState<ErpInboundOrderBaseResponse>();
  const [warehouses, setWarehouses] = useState<ErpWarehouseResponse[]>([]);
  const [size] = useState({ xs: 12, md: 3 });
  const [fileWidth] = useState<number>(420);
  const [fileHeight] = useState<number>(245);
  const [downloadImages, setDownloadImages] = useState<Map<number, DownloadProps>>(new Map<number, DownloadProps>());

  useImperativeHandle(ref, () => ({
    show(erpInboundOrderRequest: ErpInboundOrderResponse) {
      initForm(erpInboundOrderRequest);
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

  const initForm = async (erpInboundOrderRequest: ErpInboundOrderResponse) => {
    // 查询入库订单
    const result = await getInfoPurchaseErpInboundOrder(erpInboundOrderRequest.id);
    // 查询采购订单
    const purchaseOrder = await getErpPurchaseOrderInfo(erpInboundOrderRequest.purchase_id);

    const purchaseOrderDetailMap: Map<number, ErpPurchaseOrderDetailInfoResponse> = new Map();
    for (const purchaseDetail of purchaseOrder.purchase_products) {
      purchaseOrderDetailMap.set(purchaseDetail.id, purchaseDetail);
    }
    setErpPurchaseOrderDetailMap(purchaseOrderDetailMap);
    setErpPurchaseOrder(purchaseOrder);
    setErpInboundOrder(result);
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
      title={t('global.operate.edit') + t('global.page.erp.purchase.inbound')}
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
                <Box>{t('page.erp.sale.order.title.order.number')}</Box>
                <Box>{erpInboundOrder && <CustomizedCopyableText text={erpInboundOrder.order_number} sx={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box>{t('page.erp.purchase.inbound.title.purchase')}</Box>
                <Box>{erpPurchaseOrder && <CustomizedCopyableText text={erpPurchaseOrder.order_number} sx={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box>{t('page.erp.purchase.inbound.title.supplier')}</Box>
                <Box>{erpPurchaseOrder && <CustomizedTag label={erpPurchaseOrder.supplier_name} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box>{t('page.erp.purchase.inbound.title.inbound.date')}</Box>
                <Box>{erpInboundOrder && <CustomizedTag label={erpInboundOrder.inbound_date} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box>{t('page.erp.purchase.inbound.title.settlement.account')}</Box>
                <Box>{erpInboundOrder && <CustomizedTag label={erpInboundOrder.settlement_account_name ?? ''} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box>{t('page.erp.purchase.inbound.title.discount.rate')}</Box>
                <Box>{erpInboundOrder && <CustomizedTag label={erpInboundOrder.discount_rate + '%'} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box>{t('page.erp.purchase.inbound.title.other.cost')}</Box>
                <Box>{erpInboundOrder && <CustomizedTag label={erpInboundOrder.other_cost} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box>{t('page.erp.purchase.inbound.title.remarks')}</Box>
                <Box>{erpInboundOrder && <CustomizedTag label={erpInboundOrder.remarks} />}</Box>
              </Stack>
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
            {erpInboundOrder && erpInboundOrder.details && erpInboundOrder.details.map((item, index) => {
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
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <TextField
                      size="small"
                      name="remarks"
                      defaultValue={item.remarks}
                      disabled
                    />
                  </Box>
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <TextField size="small" value={purchaseDetail && purchaseDetail.product_name} disabled />
                  </Box>
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <TextField size="small" value={purchaseDetail && purchaseDetail.product_barcode} disabled />
                  </Box>
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <TextField size="small" value={purchaseDetail && purchaseDetail.product_unit_name} disabled />
                  </Box>
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <TextField size="small" value={item.remarks} disabled />
                  </Box>
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <TextField size="small" value={purchaseDetail && purchaseDetail.quantity} disabled />
                  </Box>
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <TextField size="small" value={purchaseDetail && purchaseDetail.unit_price} disabled />
                  </Box>
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <TextField size="small" value={purchaseDetail && purchaseDetail.subtotal} disabled />
                  </Box>
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <TextField size="small" value={purchaseDetail && purchaseDetail.tax_rate} disabled />
                  </Box>
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <TextField size="small" value={purchaseDetail ? (purchaseDetail.quantity * purchaseDetail.unit_price * purchaseDetail.tax_rate / 100) : 0} disabled />
                  </Box>
                  <Box className='table-cell' sx={{ width: 50 }}>
                    <TextField size="small" value={purchaseDetail ? purchaseDetail.quantity * purchaseDetail.unit_price * (1 + purchaseDetail.tax_rate / 100) : 0} disabled />
                  </Box>
                </Box>
              )
            })}
          </Box>
        </Card>

        <Typography variant="body1" sx={{ mt: 3, fontSize: '1rem', fontWeight: 500 }}>
          {t('page.erp.purchase.order.title.attachment')}
        </Typography>
        <Card variant="outlined" sx={{ width: '100%', mt: 1, p: 2 }}>
          <Grid container rowSpacing={2} columnSpacing={4} sx={{ '& .MuiGrid-root': { display: 'flex', justifyContent: 'center', alignItems: 'center' } }}>
            {erpInboundOrder && erpInboundOrder.attachments.map((item, index) => (
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

export default ErpInboundOrderInfo;