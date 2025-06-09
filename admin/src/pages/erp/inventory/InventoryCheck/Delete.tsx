import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteErpInventoryCheck, ErpInventoryCheckResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface ErpInventoryCheckDeleteProps {
  onSubmit: () => void;
}

const ErpInventoryCheckDelete = forwardRef(({ onSubmit }: ErpInventoryCheckDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [erpInventoryCheck, setErpInventoryCheck] = useState<ErpInventoryCheckResponse>();

  useImperativeHandle(ref, () => ({
    show(erpInventoryCheck: ErpInventoryCheckResponse) {
      setErpInventoryCheck(erpInventoryCheck);
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
    if (erpInventoryCheck) {
      await deleteErpInventoryCheck(erpInventoryCheck.id);
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
        {t('global.description.delete', { name: erpInventoryCheck && erpInventoryCheck.name })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default ErpInventoryCheckDelete;