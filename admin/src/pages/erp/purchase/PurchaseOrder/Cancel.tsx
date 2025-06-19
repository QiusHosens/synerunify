import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { cancelErpPurchaseOrder, ErpPurchaseOrderResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface ErpPurchaseOrderCancelProps {
  onSubmit: () => void;
}

const ErpPurchaseOrderCancel = forwardRef(({ onSubmit }: ErpPurchaseOrderCancelProps, ref) => {
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
      await cancelErpPurchaseOrder(erpPurchaseOrder.id);
    }
    handleClose();
    onSubmit();
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.cancel') + t('global.page.erp.purchase.order')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
      <DialogContentText>
        {t('page.erp.purchase.order.description.cancel', { name: erpPurchaseOrder && erpPurchaseOrder.order_number })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default ErpPurchaseOrderCancel;