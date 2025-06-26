import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteErpInboundOrder, ErpInboundOrderResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface ErpInboundOrderDeleteProps {
  onSubmit: () => void;
}

const ErpInboundOrderDelete = forwardRef(({ onSubmit }: ErpInboundOrderDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [erpInboundOrder, setErpInboundOrder] = useState<ErpInboundOrderResponse>();

  useImperativeHandle(ref, () => ({
    show(erpInboundOrder: ErpInboundOrderResponse) {
      setErpInboundOrder(erpInboundOrder);
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
    if (erpInboundOrder) {
      await deleteErpInboundOrder(erpInboundOrder.id);
    }
    handleClose();
    onSubmit();
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.delete') + t('global.page.erp.purchase.inbound')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
      <DialogContentText>
        {t('global.description.delete', { name: erpInboundOrder && erpInboundOrder.order_number })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default ErpInboundOrderDelete;