import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteErpSalesReturn, ErpSalesReturnResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface ErpSalesReturnDeleteProps {
  onSubmit: () => void;
}

const ErpSalesReturnDelete = forwardRef(({ onSubmit }: ErpSalesReturnDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [erpSalesReturn, setErpSalesReturn] = useState<ErpSalesReturnResponse>();

  useImperativeHandle(ref, () => ({
    show(erpSalesReturn: ErpSalesReturnResponse) {
      setErpSalesReturn(erpSalesReturn);
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
    if (erpSalesReturn) {
      await deleteErpSalesReturn(erpSalesReturn.id);
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
        {t('global.description.delete', { name: erpSalesReturn && erpSalesReturn.name })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default ErpSalesReturnDelete;