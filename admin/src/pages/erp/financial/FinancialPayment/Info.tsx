import { Box, Card, FormControl, Grid, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpInboundOrderResponse, ErpPaymentResponse, ErpPurchaseReturnResponse, getBaseErpPayment, listSupplierErpInboundOrder, listSupplierErpPurchaseReturn } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import CustomizedFileUpload, { DownloadProps } from '@/components/CustomizedFileUpload';
import { downloadSystemFile } from '@/api/system_file';
import CustomizedCopyableText from '@/components/CustomizedCopyableText';
import CustomizedTag from '@/components/CustomizedTag';

const ErpPaymentInfo = forwardRef(({ }, ref) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('xl');
  const [inboundOrders, setInboundOrders] = useState<ErpInboundOrderResponse[]>([]);
  const [returnOrders, setReturnOrders] = useState<ErpPurchaseReturnResponse[]>([]);
  const [erpPayment, setErpPayment] = useState<ErpPaymentResponse>();
  const [size] = useState({ xs: 12, md: 3 });
  const [fileWidth] = useState<number>(420);
  const [fileHeight] = useState<number>(245);
  const [downloadImages, setDownloadImages] = useState<Map<number, DownloadProps>>(new Map<number, DownloadProps>());

  useImperativeHandle(ref, () => ({
    show(erpPaymentRequest: ErpPaymentResponse) {
      initForm(erpPaymentRequest);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const handleClose = () => {
    setOpen(false);
  };

  const initForm = async (erpPaymentRequest: ErpPaymentResponse) => {
    // 查询采购入库订单
    const inboundOrders = await listSupplierErpInboundOrder(erpPaymentRequest.supplier_id);
    setInboundOrders(inboundOrders);
    // 查询采购退货订单
    const returnOrders = await listSupplierErpPurchaseReturn(erpPaymentRequest.supplier_id);
    setReturnOrders(returnOrders);
    // 查询订单
    const result = await getBaseErpPayment(erpPaymentRequest.id);
    const details = result.details;
    if (details) {
      for (const detail of details) {
        if (detail.purchase_order_id || detail.purchase_order_id == 0) {
          detail.type = 0;
        }
        if (detail.purchase_return_id || detail.purchase_return_id == 0) {
          detail.type = 1;
        }
      }
    }
    setErpPayment(result);
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
      title={t('global.operate.edit') + t('global.page.erp.payment')}
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
                <Box>{t('page.erp.purchase.order.title.order.number')}</Box>
                <Box>{erpPayment && <CustomizedCopyableText text={erpPayment.order_number} sx={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box>{t('page.erp.purchase.inbound.title.supplier')}</Box>
                <Box>{erpPayment && <CustomizedTag label={erpPayment.supplier_name} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box>{t('page.erp.payment.title.payment.date')}</Box>
                <Box>{erpPayment && <CustomizedTag label={erpPayment.payment_date} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box>{t('page.erp.purchase.inbound.title.settlement.account')}</Box>
                <Box>{erpPayment && <CustomizedTag label={erpPayment.settlement_account_name} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box>{t('page.erp.payment.title.amount')}</Box>
                <Box>{erpPayment && <CustomizedTag label={erpPayment.amount} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box>{t('page.erp.payment.title.discount.amount')}</Box>
                <Box>{erpPayment && <CustomizedTag label={erpPayment.discount_amount} />}</Box>
              </Stack>
            </Grid>

            <Grid size={size}>
              <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box>{t('page.erp.payment.title.payment.method')}</Box>
                <Box>{erpPayment && <CustomizedTag label={erpPayment.payment_method} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box>{t('page.erp.payment.title.remarks')}</Box>
                <Box>{erpPayment && <CustomizedTag label={erpPayment.remarks} />}</Box>
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
            {erpPayment && erpPayment.details.map((item, index) => (
              <Box className='table-row' key={index}>
                <Box className='table-cell' sx={{ width: 50, verticalAlign: 'middle' }}><Typography variant="body1">{index + 1}</Typography></Box>
                {item.type == 0 && <Box className='table-cell' sx={{ width: 100 }}>
                  <FormControl sx={{ minWidth: 120, width: '100%' }}>
                    <Select
                      size="small"
                      name="purchase_order_id"
                      value={item.purchase_order_id}
                      disabled
                    >
                      {inboundOrders.map((inboundOrder) => (
                        <MenuItem key={inboundOrder.id} value={inboundOrder.id}>
                          {inboundOrder.order_number}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>}
                {item.type == 1 && <Box className='table-cell' sx={{ width: 100 }}>
                  <FormControl sx={{ minWidth: 120, width: '100%' }}>
                    <Select
                      size="small"
                      name="product_id"
                      value={item.purchase_return_id ?? ''}
                      disabled
                    >
                      {returnOrders.map((returnOrder) => (
                        <MenuItem key={returnOrder.id} value={returnOrder.id}>
                          {returnOrder.order_number}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>}

                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField
                    size="small"
                    type="number"
                    name="amount"
                    value={item.amount}
                    disabled
                  />
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <TextField
                    size="small"
                    name="remarks"
                    value={item.remarks}
                    disabled
                  />
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
            {erpPayment && erpPayment.attachments.map((item, index) => (
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

export default ErpPaymentInfo;