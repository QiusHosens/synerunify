import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteErpReceipt, ErpReceiptResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface ErpReceiptDeleteProps {
  onSubmit: () => void;
}

const ErpReceiptDelete = forwardRef(({ onSubmit }: ErpReceiptDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [erpReceipt, setErpReceipt] = useState<ErpReceiptResponse>();

  useImperativeHandle(ref, () => ({
    show(erpReceipt: ErpReceiptResponse) {
      setErpReceipt(erpReceipt);
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
    if (erpReceipt) {
      await deleteErpReceipt(erpReceipt.id);
    }
    handleClose();
    onSubmit();
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.delete') + t('global.page.erp.receipt')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
      <DialogContentText>
        {t('global.description.delete', { name: erpReceipt && erpReceipt.order_number })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default ErpReceiptDelete;