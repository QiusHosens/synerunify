import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteErpPurchaseOrder, ErpPurchaseOrderResponse, receivedErpPurchaseOrder } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface ErpPurchaseOrderReceivedProps {
  onSubmit: () => void;
}

const ErpPurchaseOrderReceived = forwardRef(({ onSubmit }: ErpPurchaseOrderReceivedProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [erpPurchaseOrder, setErpPurchaseOrder] = useState<ErpPurchaseOrderResponse>();

  useImperativeHandle(ref, () => ({
    show(erpPurchaseOrder: ErpPurchaseOrderResponse) {
      setErpPurchaseOrder(erpPurchaseOrder);
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
    if (erpPurchaseOrder) {
      await receivedErpPurchaseOrder(erpPurchaseOrder.id);
    }
    handleClose();
    onSubmit();
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('page.erp.purchase.order.operate.received') + t('global.page.erp.purchase.order')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
      <DialogContentText>
        {t('page.erp.purchase.order.description.received', { name: erpPurchaseOrder && erpPurchaseOrder.order_number })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default ErpPurchaseOrderReceived;