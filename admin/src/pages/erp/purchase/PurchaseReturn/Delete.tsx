import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteErpPurchaseReturn, ErpPurchaseReturnResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface ErpPurchaseReturnDeleteProps {
  onSubmit: () => void;
}

const ErpPurchaseReturnDelete = forwardRef(({ onSubmit }: ErpPurchaseReturnDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [erpPurchaseReturn, setErpPurchaseReturn] = useState<ErpPurchaseReturnResponse>();

  useImperativeHandle(ref, () => ({
    show(erpPurchaseReturn: ErpPurchaseReturnResponse) {
      setErpPurchaseReturn(erpPurchaseReturn);
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
    if (erpPurchaseReturn) {
      await deleteErpPurchaseReturn(erpPurchaseReturn.id);
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
        {t('global.description.delete', { name: erpPurchaseReturn && erpPurchaseReturn.name })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default ErpPurchaseReturnDelete;