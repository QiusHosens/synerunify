import { Box, Card, FormControl, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { getBaseMallTradeDeliveryExpressTemplate, MallTradeDeliveryExpressTemplateResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import CustomizedTag from '@/components/CustomizedTag';
import CustomizedDictTag from '@/components/CustomizedDictTag';
import AreaTypography from '@/components/AreaTypography';

interface FormChargeValues {
  id?: number; // id
  area_ids: string[]; // 配送区域 id
  start_count: number; // 首件数量
  start_price: number; // 起步价，单位：分
  extra_count: number; // 续件数量
  extra_price: number; // 额外价，单位：分
}

interface FormFreeValues {
  id?: number; // id
  area_ids: string[]; // 包邮区域 id
  free_price: number; // 包邮金额，单位：分
  free_count: number; // 包邮件数,
}

interface FormValues {
  id: number; // id
  name: string; // 模板名称
  charge_mode: number; // 配送计费方式
  sort: number; // 排序
  status: number; // 状态

  charges: FormChargeValues[]; // 运费列表
  frees: FormFreeValues[]; // 包邮列表
}

const MallTradeDeliveryExpressTemplateInfo = forwardRef(({ }, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('lg');
  const [mallTradeDeliveryExpressTemplate, setMallTradeDeliveryExpressTemplate] = useState<FormValues>({
    id: 0,
    name: '',
    charge_mode: 0,
    sort: 0,
    status: 0,
    charges: [],
    frees: [],
  });

  useImperativeHandle(ref, () => ({
    show(mallTradeDeliveryExpressTemplate: MallTradeDeliveryExpressTemplateResponse) {
      initForm(mallTradeDeliveryExpressTemplate);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const handleClose = () => {
    setOpen(false);
  };

  const initForm = async (mallTradeDeliveryExpressTemplate: MallTradeDeliveryExpressTemplateResponse) => {
    const result = await getBaseMallTradeDeliveryExpressTemplate(mallTradeDeliveryExpressTemplate.id);
    setMallTradeDeliveryExpressTemplate({
      ...result,
      charges: result.charges.map(charge => {
        return {
          ...charge,
          area_ids: charge.area_ids.split(',')
        }
      }),
      frees: result.frees.map(free => {
        return {
          ...free,
          area_ids: free.area_ids.split(',')
        }
      })
    })
  }

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.edit') + t('global.page.mall.trade.delivery.express.template')}
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
        <FormControl sx={{ minWidth: 120, '& .MuiStack-root': { mt: 2 } }}>
          <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
            <Box>{t('page.mall.trade.delivery.express.template.title.name')}</Box>
            <Box>{mallTradeDeliveryExpressTemplate && <CustomizedTag label={mallTradeDeliveryExpressTemplate.name} />}</Box>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
            <Box>{t('page.mall.trade.delivery.express.template.title.charge.mode')}</Box>
            <Box>{mallTradeDeliveryExpressTemplate && <CustomizedDictTag type='charge_type' value={String(mallTradeDeliveryExpressTemplate.charge_mode)} />}</Box>
          </Stack>
        </FormControl>

        <Typography variant="body1" sx={{ mt: 3, fontSize: '1rem', fontWeight: 500 }}>
          {t('page.mall.trade.delivery.express.template.charge.list.title')}
        </Typography>
        <Card variant="outlined" sx={{ width: '100%', mt: 1, p: 1 }}>
          <Box sx={{ display: 'table', width: '100%', "& .table-row": { display: 'table-row', "& .table-cell": { display: 'table-cell', padding: 1, textAlign: 'center', } } }}>
            <Box className='table-row'>
              <Box className='table-cell' sx={{ width: 240 }}><Typography variant="body1">{t('page.mall.trade.delivery.express.template.charge.title.area')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{mallTradeDeliveryExpressTemplate.charge_mode == 0 ? t('page.mall.trade.delivery.express.template.charge.title.start.count.count') : mallTradeDeliveryExpressTemplate.charge_mode == 1 ? t('page.mall.trade.delivery.express.template.charge.title.start.count.weight') : t('page.mall.trade.delivery.express.template.charge.title.start.count.volume')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.trade.delivery.express.template.charge.title.start.price')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{mallTradeDeliveryExpressTemplate.charge_mode == 0 ? t('page.mall.trade.delivery.express.template.charge.title.extra.count.count') : mallTradeDeliveryExpressTemplate.charge_mode == 1 ? t('page.mall.trade.delivery.express.template.charge.title.extra.count.weight') : t('page.mall.trade.delivery.express.template.charge.title.extra.count.volume')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.trade.delivery.express.template.charge.title.extra.price')}</Typography></Box>
            </Box>
            {mallTradeDeliveryExpressTemplate.charges.map((item, index) => (
              <Box className='table-row' key={index}>
                <Box className='table-cell' sx={{ width: 240 }}>
                  <AreaTypography value={item.area_ids} />
                </Box>
                <Box className='table-cell' sx={{ width: 150 }}>
                  <Typography variant="body1">{item.start_count}</Typography>
                </Box>
                <Box className='table-cell' sx={{ width: 150 }}>
                  <Typography variant="body1">{item.start_price}</Typography>
                </Box>
                <Box className='table-cell' sx={{ width: 150 }}>
                  <Typography variant="body1">{item.extra_count}</Typography>
                </Box>
                <Box className='table-cell' sx={{ width: 150 }}>
                  <Typography variant="body1">{item.extra_price}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Card>

        <Typography variant="body1" sx={{ mt: 3, fontSize: '1rem', fontWeight: 500 }}>
          {t('page.mall.trade.delivery.express.template.free.list.title')}
        </Typography>
        <Card variant="outlined" sx={{ width: '100%', mt: 1, p: 1 }}>
          <Box sx={{ display: 'table', width: '100%', "& .table-row": { display: 'table-row', "& .table-cell": { display: 'table-cell', padding: 1, textAlign: 'center', } } }}>
            <Box className='table-row'>
              <Box className='table-cell' sx={{ width: 240 }}><Typography variant="body1">{t('page.mall.trade.delivery.express.template.free.title.area')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{mallTradeDeliveryExpressTemplate.charge_mode == 0 ? t('page.mall.trade.delivery.express.template.free.title.free.count.count') : mallTradeDeliveryExpressTemplate.charge_mode == 1 ? t('page.mall.trade.delivery.express.template.free.title.free.count.weight') : t('page.mall.trade.delivery.express.template.free.title.free.count.volume')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.trade.delivery.express.template.free.title.free.price')}</Typography></Box>
            </Box>
            {mallTradeDeliveryExpressTemplate.frees.map((item, index) => (
              <Box className='table-row' key={index}>
                <Box className='table-cell' sx={{ width: 240 }}>
                  <AreaTypography value={item.area_ids} />
                </Box>
                <Box className='table-cell' sx={{ width: 150 }}>
                  <Typography variant="body1">{item.free_count}</Typography>
                </Box>
                <Box className='table-cell' sx={{ width: 150 }}>
                  <Typography variant="body1">{item.free_price}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Card>

        <FormControl sx={{ minWidth: 120, '& .MuiStack-root': { mt: 2 } }}>
          <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
            <Box>{t('page.mall.trade.delivery.express.template.title.sort')}</Box>
            <Box>{mallTradeDeliveryExpressTemplate && <CustomizedTag label={mallTradeDeliveryExpressTemplate.sort} />}</Box>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
            <Box>{t('global.title.status')}</Box>
            <Box>{mallTradeDeliveryExpressTemplate && <CustomizedDictTag type='status' value={String(mallTradeDeliveryExpressTemplate.status)} />}</Box>
          </Stack>
        </FormControl>
      </Box>
    </CustomizedDialog>
  )
});

export default MallTradeDeliveryExpressTemplateInfo;