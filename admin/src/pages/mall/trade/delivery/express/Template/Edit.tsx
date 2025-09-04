import { Box, Button, Card, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { getBaseMallTradeDeliveryExpressTemplate, MallTradeDeliveryExpressTemplateRequest, MallTradeDeliveryExpressTemplateResponse, updateMallTradeDeliveryExpressTemplate } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import CustomizedDictRadioGroup from '@/components/CustomizedDictRadioGroup';
import AreaCascader from '@/components/AreaCascader';
import CustomizedNumberInput from '@/components/CustomizedNumberInput'
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';
import DeleteIcon from '@/assets/image/svg/delete.svg';

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

interface FormChargeErrors {
  area_ids?: string; // 配送区域 id
  start_count?: string; // 首件数量
  start_price?: string; // 起步价，单位：分
  extra_count?: string; // 续件数量
  extra_price?: string; // 额外价，单位：分
}

interface FormFreeErrors {
  area_ids?: string; // 包邮区域 id
  free_price?: string; // 包邮金额，单位：分
  free_count?: string; // 包邮件数,
}

interface FormErrors {
  name?: string; // 模板名称
  charge_mode?: string; // 配送计费方式
  sort?: string; // 排序
  status?: string; // 状态

  charges: FormChargeErrors[]; // 运费列表
  frees: FormFreeErrors[]; // 包邮列表
}

interface MallTradeDeliveryExpressTemplateEditProps {
  onSubmit: () => void;
}

const MallTradeDeliveryExpressTemplateEdit = forwardRef(({ onSubmit }: MallTradeDeliveryExpressTemplateEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('lg');
  const [mallTradeDeliveryExpressTemplateRequest, setMallTradeDeliveryExpressTemplateRequest] = useState<FormValues>({
    id: 0,
    name: '',
    charge_mode: 0,
    sort: 0,
    status: 0,
    charges: [],
    frees: [],
  });
  const [errors, setErrors] = useState<FormErrors>({
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      charges: mallTradeDeliveryExpressTemplateRequest.charges.map(() => ({
        area_ids: undefined,
        start_count: undefined,
        start_price: undefined,
        extra_count: undefined,
        extra_price: undefined
      })),
      frees: mallTradeDeliveryExpressTemplateRequest.frees.map(() => ({
        area_ids: undefined,
        free_price: undefined,
        free_count: undefined
      })),
    };

    if (!mallTradeDeliveryExpressTemplateRequest.name.trim()) {
      newErrors.name = t('global.error.input.please') + t('page.mall.trade.delivery.express.template.title.name');
    }

    if (!mallTradeDeliveryExpressTemplateRequest.charge_mode && mallTradeDeliveryExpressTemplateRequest.charge_mode != 0) {
      newErrors.charge_mode = t('global.error.select.please') + t('page.mall.trade.delivery.express.template.title.charge.mode');
    }

    if (!mallTradeDeliveryExpressTemplateRequest.sort && mallTradeDeliveryExpressTemplateRequest.sort != 0) {
      newErrors.sort = t('global.error.input.please') + t('page.mall.trade.delivery.express.template.title.sort');
    }

    mallTradeDeliveryExpressTemplateRequest.charges.forEach((charge, index) => {
      if (!charge.area_ids || charge.area_ids.length == 0) {
        newErrors.charges[index].area_ids = t('global.error.select.please') + t('page.mall.trade.delivery.express.template.charge.title.area');
      }

      if (!charge.start_count && charge.start_count != 0) {
        newErrors.charges[index].start_count = t('global.error.input.please') + t('page.mall.trade.delivery.express.template.charge.title.start.count');
      }

      if (!charge.start_price && charge.start_price != 0) {
        newErrors.charges[index].start_price = t('global.error.input.please') + t('page.mall.trade.delivery.express.template.charge.title.start.price');
      }

      if (!charge.extra_count && charge.extra_count != 0) {
        newErrors.charges[index].extra_count = t('global.error.input.please') + t('page.mall.trade.delivery.express.template.charge.title.extra.count');
      }

      if (!charge.extra_price && charge.extra_price != 0) {
        newErrors.charges[index].extra_price = t('global.error.input.please') + t('page.mall.trade.delivery.express.template.charge.title.extra.price');
      }
    });

    mallTradeDeliveryExpressTemplateRequest.frees.forEach((free, index) => {
      if (!free.area_ids || free.area_ids.length == 0) {
        newErrors.frees[index].area_ids = t('global.error.select.please') + t('page.mall.trade.delivery.express.template.free.title.area');
      }

      if (!free.free_count && free.free_count != 0) {
        newErrors.frees[index].free_count = t('global.error.input.please') + t('page.mall.trade.delivery.express.template.free.title.free.count');
      }

      if (!free.free_price && free.free_price != 0) {
        newErrors.frees[index].free_price = t('global.error.input.please') + t('page.mall.trade.delivery.express.template.free.title.free.price');
      }
    });

    setErrors(newErrors);
    return !Object.keys(newErrors).some((key) => {
      if (key === 'charges') {
        return newErrors.charges.some((err) =>
          Object.values(err).some((value) => value !== undefined)
        );
      } else if (key === 'frees') {
        return newErrors.frees.some((err) =>
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

  const initForm = async (mallTradeDeliveryExpressTemplate: MallTradeDeliveryExpressTemplateResponse) => {
    const result = await getBaseMallTradeDeliveryExpressTemplate(mallTradeDeliveryExpressTemplate.id);
    setMallTradeDeliveryExpressTemplateRequest({
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
    setErrors({
      charges: [],
      frees: [],
    });
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      const request = {
        ...mallTradeDeliveryExpressTemplateRequest,
        charges: mallTradeDeliveryExpressTemplateRequest.charges.map(charge => {
          return {
            ...charge,
            area_ids: charge.area_ids.join(',')
          }
        }),
        frees: mallTradeDeliveryExpressTemplateRequest.frees.map(free => {
          return {
            ...free,
            area_ids: free.area_ids.join(',')
          }
        })
      } as MallTradeDeliveryExpressTemplateRequest;
      await updateMallTradeDeliveryExpressTemplate(request);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setMallTradeDeliveryExpressTemplateRequest(prev => ({
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

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const { name } = e.target;

    setMallTradeDeliveryExpressTemplateRequest(prev => ({
      ...prev,
      [name]: checked ? 0 : 1
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleChargeAreaChange = (name: string, value: string[], index: number) => {
    setMallTradeDeliveryExpressTemplateRequest((prev) => {
      const updated = prev.charges.map((item, idx) => {
        if (idx !== index) return item;
        return { ...item, [name]: value };
      });
      return { ...prev, charges: updated };
    });
    setErrors((prev) => ({
      ...prev,
      charges: prev.charges.map((item, idx) =>
        idx === index ? { ...item, [name]: undefined } : item
      ),
    }));
  };

  const handleChargeInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value, type } = e.target;
    const numberValue = type === 'number' ? Number(value) : value;
    setMallTradeDeliveryExpressTemplateRequest((prev) => {
      const updated = prev.charges.map((item, idx) => {
        if (idx !== index) return item;
        return { ...item, [name]: numberValue };
      });
      return { ...prev, charges: updated };
    });
    setErrors((prev) => ({
      ...prev,
      charges: prev.charges.map((item, idx) =>
        idx === index ? { ...item, [name]: undefined } : item
      ),
    }));
  }, []);

  const handleChargeAdd = useCallback(() => {
    const newCharge: FormChargeValues = {
      area_ids: [],
      start_count: 1,
      start_price: 1,
      extra_count: 1,
      extra_price: 1,
    };
    setMallTradeDeliveryExpressTemplateRequest((prev) => ({
      ...prev,
      charges: [...prev.charges, newCharge],
    }));
    setErrors((prev) => ({
      ...prev,
      charges: [
        ...prev.charges,
        { area_ids: undefined, start_count: undefined, start_price: undefined, extra_count: undefined, extra_price: undefined },
      ],
    }));
  }, []);

  const handleClickChargeDelete = useCallback((index: number) => {
    setMallTradeDeliveryExpressTemplateRequest((prev) => ({
      ...prev,
      charges: prev.charges.filter((_, idx) => idx !== index),
    }));
    setErrors((prev) => ({
      ...prev,
      charges: prev.charges.filter((_, idx) => idx !== index),
    }));
  }, []);

  const handleFreeAreaChange = (name: string, value: string[], index: number) => {
    setMallTradeDeliveryExpressTemplateRequest((prev) => {
      const updated = prev.frees.map((item, idx) => {
        if (idx !== index) return item;
        return { ...item, [name]: value };
      });
      return { ...prev, frees: updated };
    });
    setErrors((prev) => ({
      ...prev,
      frees: prev.frees.map((item, idx) =>
        idx === index ? { ...item, [name]: undefined } : item
      ),
    }));
  };

  const handleFreeInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value, type } = e.target;
    const numberValue = type === 'number' ? Number(value) : value;
    setMallTradeDeliveryExpressTemplateRequest((prev) => {
      const updated = prev.frees.map((item, idx) => {
        if (idx !== index) return item;
        return { ...item, [name]: numberValue };
      });
      return { ...prev, frees: updated };
    });
    setErrors((prev) => ({
      ...prev,
      frees: prev.frees.map((item, idx) =>
        idx === index ? { ...item, [name]: undefined } : item
      ),
    }));
  }, []);

  const handleFreeAdd = useCallback(() => {
    const newFree: FormFreeValues = {
      area_ids: [],
      free_price: 1,
      free_count: 1,
    };
    setMallTradeDeliveryExpressTemplateRequest((prev) => ({
      ...prev,
      frees: [...prev.frees, newFree],
    }));
    setErrors((prev) => ({
      ...prev,
      frees: [
        ...prev.frees,
        { area_ids: undefined, free_price: undefined, free_count: undefined },
      ],
    }));
  }, []);

  const handleClickFreeDelete = useCallback((index: number) => {
    setMallTradeDeliveryExpressTemplateRequest((prev) => ({
      ...prev,
      frees: prev.frees.filter((_, idx) => idx !== index),
    }));
    setErrors((prev) => ({
      ...prev,
      frees: prev.frees.filter((_, idx) => idx !== index),
    }));
  }, []);

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.edit') + t('global.page.mall.trade.delivery.express.template')}
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
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '240px' } }}>
          <TextField
            required
            size="small"
            label={t("page.mall.trade.delivery.express.template.title.name")}
            name='name'
            value={mallTradeDeliveryExpressTemplateRequest.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <CustomizedDictRadioGroup
            id="charge-row-radio-buttons-group-label"
            name='charge_mode'
            dict_type='charge_type'
            label={t("page.mall.trade.delivery.express.template.title.charge.mode")}
            value={mallTradeDeliveryExpressTemplateRequest.charge_mode}
            onChange={handleInputChange}
            sx={{ mt: 2 }}
          />
        </FormControl>

        <Typography variant="body1" sx={{ mt: 3, fontSize: '1rem', fontWeight: 500 }}>
          {t('page.mall.trade.delivery.express.template.charge.list.title')}
        </Typography>
        <Card variant="outlined" sx={{ width: '100%', mt: 1, p: 1 }}>
          <Box sx={{ display: 'table', width: '100%', "& .table-row": { display: 'table-row', "& .table-cell": { display: 'table-cell', padding: 1, textAlign: 'center', } } }}>
            <Box className='table-row'>
              <Box className='table-cell' sx={{ width: 240 }}><Typography variant="body1">{t('page.mall.trade.delivery.express.template.charge.title.area')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{mallTradeDeliveryExpressTemplateRequest.charge_mode == 0 ? t('page.mall.trade.delivery.express.template.charge.title.start.count.count') : mallTradeDeliveryExpressTemplateRequest.charge_mode == 1 ? t('page.mall.trade.delivery.express.template.charge.title.start.count.weight') : t('page.mall.trade.delivery.express.template.charge.title.start.count.volume')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.trade.delivery.express.template.charge.title.start.price')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{mallTradeDeliveryExpressTemplateRequest.charge_mode == 0 ? t('page.mall.trade.delivery.express.template.charge.title.extra.count.count') : mallTradeDeliveryExpressTemplateRequest.charge_mode == 1 ? t('page.mall.trade.delivery.express.template.charge.title.extra.count.weight') : t('page.mall.trade.delivery.express.template.charge.title.extra.count.volume')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.trade.delivery.express.template.charge.title.extra.price')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 50 }}><Typography variant="body1">{t('global.operate.actions')}</Typography></Box>
            </Box>
            {mallTradeDeliveryExpressTemplateRequest.charges.map((item, index) => (
              <Box className='table-row' key={index}>
                <Box className='table-cell' sx={{ width: 240 }}>
                  <AreaCascader
                    name='area_ids'
                    value={item.area_ids}
                    onChange={(name, value) => handleChargeAreaChange(name, value, index)}
                    error={!!(errors.charges[index]?.area_ids)}
                    helperText={errors.charges[index]?.area_ids}
                  />
                </Box>
                <Box className='table-cell' sx={{ width: 150 }}>
                  <CustomizedNumberInput
                    size="small"
                    step={1}
                    min={1}
                    name='start_count'
                    value={item.start_count}
                    onChange={(e) => handleChargeInputChange(e, index)}
                    error={!!(errors.charges[index]?.start_count)}
                    helperText={errors.charges[index]?.start_count}
                  />
                </Box>
                <Box className='table-cell' sx={{ width: 150 }}>
                  <CustomizedNumberInput
                    size="small"
                    step={1}
                    min={1}
                    name='start_price'
                    value={item.start_price}
                    onChange={(e) => handleChargeInputChange(e, index)}
                    error={!!(errors.charges[index]?.start_price)}
                    helperText={errors.charges[index]?.start_price}
                  />
                </Box>
                <Box className='table-cell' sx={{ width: 150 }}>
                  <CustomizedNumberInput
                    size="small"
                    step={1}
                    min={1}
                    name='extra_count'
                    value={item.extra_count}
                    onChange={(e) => handleChargeInputChange(e, index)}
                    error={!!(errors.charges[index]?.extra_count)}
                    helperText={errors.charges[index]?.extra_count}
                  />
                </Box>
                <Box className='table-cell' sx={{ width: 150 }}>
                  <CustomizedNumberInput
                    size="small"
                    step={1}
                    min={1}
                    name='extra_price'
                    value={item.extra_price}
                    onChange={(e) => handleChargeInputChange(e, index)}
                    error={!!(errors.charges[index]?.extra_price)}
                    helperText={errors.charges[index]?.extra_price}
                  />
                </Box>
                <Box className='table-cell' sx={{ width: 50, verticalAlign: 'middle' }}>
                  <Button
                    sx={{ color: 'error.main' }}
                    size="small"
                    variant="customOperate"
                    title={t('global.operate.delete') + t('global.page.erp.purchase.order')}
                    startIcon={<DeleteIcon />}
                    onClick={() => handleClickChargeDelete(index)}
                  />
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button variant="outlined" startIcon={<AddCircleSharpIcon />} onClick={handleChargeAdd}>
              {t('page.mall.trade.delivery.express.template.charge.operate.add')}
            </Button>
          </Box>
        </Card>

        <Typography variant="body1" sx={{ mt: 3, fontSize: '1rem', fontWeight: 500 }}>
          {t('page.mall.trade.delivery.express.template.free.list.title')}
        </Typography>
        <Card variant="outlined" sx={{ width: '100%', mt: 1, p: 1 }}>
          <Box sx={{ display: 'table', width: '100%', "& .table-row": { display: 'table-row', "& .table-cell": { display: 'table-cell', padding: 1, textAlign: 'center', } } }}>
            <Box className='table-row'>
              <Box className='table-cell' sx={{ width: 240 }}><Typography variant="body1">{t('page.mall.trade.delivery.express.template.free.title.area')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{mallTradeDeliveryExpressTemplateRequest.charge_mode == 0 ? t('page.mall.trade.delivery.express.template.free.title.free.count.count') : mallTradeDeliveryExpressTemplateRequest.charge_mode == 1 ? t('page.mall.trade.delivery.express.template.free.title.free.count.weight') : t('page.mall.trade.delivery.express.template.free.title.free.count.volume')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.trade.delivery.express.template.free.title.free.price')}</Typography></Box>
              <Box className='table-cell' sx={{ width: 50 }}><Typography variant="body1">{t('global.operate.actions')}</Typography></Box>
            </Box>
            {mallTradeDeliveryExpressTemplateRequest.frees.map((item, index) => (
              <Box className='table-row' key={index}>
                <Box className='table-cell' sx={{ width: 240 }}>
                  <AreaCascader
                    name='area_ids'
                    value={item.area_ids}
                    onChange={(name, value) => handleFreeAreaChange(name, value, index)}
                    error={!!(errors.frees[index]?.area_ids)}
                    helperText={errors.frees[index]?.area_ids}
                  />
                </Box>
                <Box className='table-cell' sx={{ width: 150 }}>
                  <CustomizedNumberInput
                    size="small"
                    step={1}
                    min={1}
                    name='free_count'
                    value={item.free_count}
                    onChange={(e) => handleFreeInputChange(e, index)}
                    error={!!(errors.frees[index]?.free_count)}
                    helperText={errors.frees[index]?.free_count}
                  />
                </Box>
                <Box className='table-cell' sx={{ width: 150 }}>
                  <CustomizedNumberInput
                    size="small"
                    step={1}
                    min={1}
                    name='free_price'
                    value={item.free_price}
                    onChange={(e) => handleFreeInputChange(e, index)}
                    error={!!(errors.frees[index]?.free_price)}
                    helperText={errors.frees[index]?.free_price}
                  />
                </Box>
                <Box className='table-cell' sx={{ width: 50, verticalAlign: 'middle' }}>
                  <Button
                    sx={{ color: 'error.main' }}
                    size="small"
                    variant="customOperate"
                    title={t('global.operate.delete') + t('global.page.erp.purchase.order')}
                    startIcon={<DeleteIcon />}
                    onClick={() => handleClickFreeDelete(index)}
                  />
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button variant="outlined" startIcon={<AddCircleSharpIcon />} onClick={handleFreeAdd}>
              {t('page.mall.trade.delivery.express.template.free.operate.add')}
            </Button>
          </Box>
        </Card>

        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '240px' } }}>
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.trade.delivery.express.template.title.sort")}
            name='sort'
            value={mallTradeDeliveryExpressTemplateRequest.sort}
            onChange={handleInputChange}
            error={!!errors.sort}
            helperText={errors.sort}
          />
        </FormControl>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 4 }}>{t("global.title.status")}</Typography>
          <Switch sx={{ mr: 2 }} name='status' checked={!mallTradeDeliveryExpressTemplateRequest.status} onChange={handleStatusChange} />
          <Typography>{mallTradeDeliveryExpressTemplateRequest.status == 0 ? t('global.switch.status.true') : t('global.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default MallTradeDeliveryExpressTemplateEdit;