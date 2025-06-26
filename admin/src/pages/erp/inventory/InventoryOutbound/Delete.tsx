import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteErpOutboundOrder, ErpOutboundOrderResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface ErpOutboundOrderDeleteProps {
  onSubmit: () => void;
}

const ErpOutboundOrderDelete = forwardRef(({ onSubmit }: ErpOutboundOrderDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [erpOutboundOrder, setErpOutboundOrder] = useState<ErpOutboundOrderResponse>();

  useImperativeHandle(ref, () => ({
    show(erpOutboundOrder: ErpOutboundOrderResponse) {
      setErpOutboundOrder(erpOutboundOrder);
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
    if (erpOutboundOrder) {
      await deleteErpOutboundOrder(erpOutboundOrder.id);
    }
    handleClose();
    onSubmit();
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.delete') + t('global.page.erp.sale.outbound')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
      <DialogContentText>
        {t('global.description.delete', { name: erpOutboundOrder && erpOutboundOrder.order_number })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default ErpOutboundOrderDelete;