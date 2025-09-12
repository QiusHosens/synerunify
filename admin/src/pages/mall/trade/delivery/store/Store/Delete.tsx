import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteMallTradeDeliveryPickUpStore, MallTradeDeliveryPickUpStoreResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface MallTradeDeliveryPickUpStoreDeleteProps {
  onSubmit: () => void;
}

const MallTradeDeliveryPickUpStoreDelete = forwardRef(({ onSubmit }: MallTradeDeliveryPickUpStoreDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [mallTradeDeliveryPickUpStore, setMallTradeDeliveryPickUpStore] = useState<MallTradeDeliveryPickUpStoreResponse>();

  useImperativeHandle(ref, () => ({
    show(mallTradeDeliveryPickUpStore: MallTradeDeliveryPickUpStoreResponse) {
      setMallTradeDeliveryPickUpStore(mallTradeDeliveryPickUpStore);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const handleCancel = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (mallTradeDeliveryPickUpStore) {
      await deleteMallTradeDeliveryPickUpStore(mallTradeDeliveryPickUpStore.id);
    }
    handleClose();
    onSubmit();
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.delete') + t('global.page.mall.trade.delivery.store')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
      <DialogContentText>
        {t('global.description.delete', { name: mallTradeDeliveryPickUpStore && mallTradeDeliveryPickUpStore.name })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default MallTradeDeliveryPickUpStoreDelete;