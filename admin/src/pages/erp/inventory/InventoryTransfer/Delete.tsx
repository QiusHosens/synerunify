import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteErpInventoryTransfer, ErpInventoryTransferResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface ErpInventoryTransferDeleteProps {
  onSubmit: () => void;
}

const ErpInventoryTransferDelete = forwardRef(({ onSubmit }: ErpInventoryTransferDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [erpInventoryTransfer, setErpInventoryTransfer] = useState<ErpInventoryTransferResponse>();

  useImperativeHandle(ref, () => ({
    show(erpInventoryTransfer: ErpInventoryTransferResponse) {
      setErpInventoryTransfer(erpInventoryTransfer);
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
    if (erpInventoryTransfer) {
      await deleteErpInventoryTransfer(erpInventoryTransfer.id);
    }
    handleClose();
    onSubmit();
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.delete') + t('global.page.erp.inventory.transfer')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
      <DialogContentText>
        {t('global.description.delete', { name: erpInventoryTransfer && erpInventoryTransfer.order_number })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default ErpInventoryTransferDelete;