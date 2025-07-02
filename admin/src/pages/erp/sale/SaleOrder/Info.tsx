import { Box, Card, FormControl, Grid, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpSalesOrderInfoResponse, ErpSalesOrderResponse, getErpSalesOrderInfo } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import CustomizedFileUpload, { DownloadProps } from '@/components/CustomizedFileUpload';
import { downloadSystemFile } from '@/api/system_file';
import CustomizedCopyableText from '@/components/CustomizedCopyableText';
import CustomizedTag from '@/components/CustomizedTag';

const ErpSalesOrderInfo = forwardRef(({}, ref) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('xl');
  const [erpSalesOrder, setErpSalesOrder] = useState<ErpSalesOrderInfoResponse>();
  const [size] = useState({ xs: 12, md: 3 });
  const [fileWidth] = useState<number>(420);
  const [fileHeight] = useState<number>(245);
  const [downloadImages, setDownloadImages] = useState<Map<number, DownloadProps>>(new Map<number, DownloadProps>());

  useImperativeHandle(ref, () => ({
    show(erpSalesOrder: ErpSalesOrderResponse) {
      initForm(erpSalesOrder);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const handleClose = () => {
    setOpen(false);
  };

  const initForm = async (erpSalesOrder: ErpSalesOrderResponse) => {
    const result = await getErpSalesOrderInfo(erpSalesOrder.id);
    setErpSalesOrder(result);
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
      title={t('global.operate.view') + t('global.page.erp.sale.order')}
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
                <Box>{erpSalesOrder && <CustomizedCopyableText text={erpSalesOrder.order_number} sx={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2}>
                <Box>{t('erp.common.title.customer')}</Box>
                <Box>{erpSalesOrder && <CustomizedTag label={erpSalesOrder.customer_name} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2}>
                <Box>{t('page.erp.sale.order.title.order.date')}</Box>
                <Box>{erpSalesOrder && <CustomizedTag label={erpSalesOrder.order_date} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2}>
                <Box>{t('erp.common.title.total.amount')}</Box>
                <Box>{erpSalesOrder && <CustomizedTag label={erpSalesOrder.total_amount} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2}>
                <Box>{t('erp.common.title.discount.rate')}</Box>
                <Box>{erpSalesOrder && <CustomizedTag label={erpSalesOrder.discount_rate + '%'} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2}>
                <Box>{t('erp.common.title.settlement.account')}</Box>
                <Box>{erpSalesOrder && <CustomizedTag label={erpSalesOrder.settlement_account_name} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2}>
                <Box>{t('erp.common.title.deposit')}</Box>
                <Box>{erpSalesOrder && <CustomizedTag label={erpSalesOrder.deposit} />}</Box>
              </Stack>
            </Grid>
            <Grid size={size}>
              <Stack direction="row" spacing={2}>
                <Box>{t('common.title.remark')}</Box>
                <Box>{erpSalesOrder && <CustomizedTag label={erpSalesOrder.remarks} />}</Box>
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
                  <Typography variant="body1">{item.product_name}</Typography>
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <Typography variant="body1">{item.product_barcode}</Typography>
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <Typography variant="body1">{item.product_unit_name}</Typography>
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <Typography variant="body1">{item.remarks}</Typography>
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <Typography variant="body1">{item.quantity}</Typography>
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <Typography variant="body1">{item.unit_price}</Typography>
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <Typography variant="body1">{item.subtotal}</Typography>
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <Typography variant="body1">{item.tax_rate + '%'}</Typography>
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <Typography variant="body1">{(item.quantity * item.unit_price * item.tax_rate) / 100}</Typography>
                </Box>
                <Box className='table-cell' sx={{ width: 50 }}>
                  <Typography variant="body1">{item.quantity * item.unit_price * (1 + item.tax_rate / 100)}</Typography>
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
            {erpSalesOrder && erpSalesOrder.attachments.map((item, index) => (
              <Grid key={index} size={{ xs: 12, md: 4 }}>
                <CustomizedFileUpload
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

export default ErpSalesOrderInfo;