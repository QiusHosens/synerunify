import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteMallTradeDeliveryExpress, MallTradeDeliveryExpressResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface MallTradeDeliveryExpressDeleteProps {
  onSubmit: () => void;
}

const MallTradeDeliveryExpressDelete = forwardRef(({ onSubmit }: MallTradeDeliveryExpressDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [mallTradeDeliveryExpress, setMallTradeDeliveryExpress] = useState<MallTradeDeliveryExpressResponse>();

  useImperativeHandle(ref, () => ({
    show(mallTradeDeliveryExpress: MallTradeDeliveryExpressResponse) {
      setMallTradeDeliveryExpress(mallTradeDeliveryExpress);
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
    if (mallTradeDeliveryExpress) {
      await deleteMallTradeDeliveryExpress(mallTradeDeliveryExpress.id);
    }
    handleClose();
    onSubmit();
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.delete') + t('global.page.mall.trade.delivery.express')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
      <DialogContentText>
        {t('global.description.delete', { name: mallTradeDeliveryExpress && mallTradeDeliveryExpress.name })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default MallTradeDeliveryExpressDelete;