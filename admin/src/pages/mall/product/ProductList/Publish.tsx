import { Box, Button, FormControl, SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { listMallStore, listMallStoreByProduct, MallProductSpuPublishRequest, MallProductSpuResponse, publishMallProductSpu } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import CustomizedMultipleSelect, { Item } from '@/components/CustomizedMultipleSelect';

interface FormErrors {
  store_ids?: string; // 店铺编号数组
}

interface MallProductSpuPublishProps {
  onSubmit: () => void;
}

const MallProductSpuPublish = forwardRef(({ onSubmit }: MallProductSpuPublishProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [stores, setStores] = useState<Item[]>([]);
  const [mallProductSpuPublish, setMallProductSpuPublish] = useState<MallProductSpuPublishRequest>({
    store_ids: [],
  });
  const [mallProductSpu, setMallProductSpu] = useState<MallProductSpuResponse>();
  const [errors, setErrors] = useState<FormErrors>({
    store_ids: '',
  });

  useImperativeHandle(ref, () => ({
    show(mallProductSpu: MallProductSpuResponse) {
      listStores();
      initForm(mallProductSpu);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!mallProductSpuPublish.store_ids || mallProductSpuPublish.store_ids.length == 0) {
      newErrors.store_ids = t('global.error.select.please') + t('page.mall.product.title.store');
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

  const initForm = async (mallProductSpu: MallProductSpuResponse) => {
    const result = await listMallStoreByProduct(mallProductSpu.id);
    setMallProductSpuPublish({
      id: mallProductSpu.id,
      store_ids: result.map(item => item.id),
    });
    setErrors({
      store_ids: '',
    });
  }

  const listStores = async () => {
    const result = await listMallStore();
    const items = result.map(item => {
      return {
        value: item.id,
        label: item.name,
        status: item.status == 2 ? 0 : 1,
      } as Item;
    });
    setStores(items);
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await publishMallProductSpu(mallProductSpuPublish);
      handleClose();
      onSubmit();
    }
  };

  const handleMultiSelectChange = (e: SelectChangeEvent<string | number[]>) => {
    const { name, value } = e.target;
    setMallProductSpuPublish(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.publish') + t('global.page.mall.product')}
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
        <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiSelect-root': { width: '240px' } }}>
          <CustomizedMultipleSelect name='store_ids' value={mallProductSpuPublish.store_ids} label={t("page.mall.product.title.store")} items={stores} onChange={handleMultiSelectChange} />
        </FormControl>
      </Box>
    </CustomizedDialog>
  )
});

export default MallProductSpuPublish;