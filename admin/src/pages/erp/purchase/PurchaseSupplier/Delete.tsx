import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteErpSupplier, ErpSupplierResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface ErpSupplierDeleteProps {
  onSubmit: () => void;
}

const ErpSupplierDelete = forwardRef(({ onSubmit }: ErpSupplierDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [erpSupplier, setErpSupplier] = useState<ErpSupplierResponse>();

  useImperativeHandle(ref, () => ({
    show(erpSupplier: ErpSupplierResponse) {
      setErpSupplier(erpSupplier);
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
    if (erpSupplier) {
      await deleteErpSupplier(erpSupplier.id);
    }
    handleClose();
    onSubmit();
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.delete') + t('global.page.erp.purchase.supplier')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
      <DialogContentText>
        {t('global.description.delete', { name: erpSupplier && erpSupplier.name })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default ErpSupplierDelete;