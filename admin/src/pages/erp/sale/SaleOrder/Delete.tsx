import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteErpSalesOrder, ErpSalesOrderResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface ErpSalesOrderDeleteProps {
  onSubmit: () => void;
}

const ErpSalesOrderDelete = forwardRef(({ onSubmit }: ErpSalesOrderDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [erpSalesOrder, setErpSalesOrder] = useState<ErpSalesOrderResponse>();

  useImperativeHandle(ref, () => ({
    show(erpSalesOrder: ErpSalesOrderResponse) {
      setErpSalesOrder(erpSalesOrder);
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
    if (erpSalesOrder) {
      await deleteErpSalesOrder(erpSalesOrder.id);
    }
    handleClose();
    onSubmit();
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.delete') + t('global.page.post')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
      <DialogContentText>
        {t('global.description.delete', { name: erpSalesOrder && erpSalesOrder.name })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default ErpSalesOrderDelete;