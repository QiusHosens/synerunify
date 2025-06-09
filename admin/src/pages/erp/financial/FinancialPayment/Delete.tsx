import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteErpPayment, ErpPaymentResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface ErpPaymentDeleteProps {
  onSubmit: () => void;
}

const ErpPaymentDelete = forwardRef(({ onSubmit }: ErpPaymentDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [erpPayment, setErpPayment] = useState<ErpPaymentResponse>();

  useImperativeHandle(ref, () => ({
    show(erpPayment: ErpPaymentResponse) {
      setErpPayment(erpPayment);
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
    if (erpPayment) {
      await deleteErpPayment(erpPayment.id);
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
        {t('global.description.delete', { name: erpPayment && erpPayment.name })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default ErpPaymentDelete;