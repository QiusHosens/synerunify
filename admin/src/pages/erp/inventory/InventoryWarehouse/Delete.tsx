import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteErpWarehouse, ErpWarehouseResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface ErpWarehouseDeleteProps {
  onSubmit: () => void;
}

const ErpWarehouseDelete = forwardRef(({ onSubmit }: ErpWarehouseDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [erpWarehouse, setErpWarehouse] = useState<ErpWarehouseResponse>();

  useImperativeHandle(ref, () => ({
    show(erpWarehouse: ErpWarehouseResponse) {
      setErpWarehouse(erpWarehouse);
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
    if (erpWarehouse) {
      await deleteErpWarehouse(erpWarehouse.id);
    }
    handleClose();
    onSubmit();
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.delete') + t('global.page.erp.inventory.warehouse')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
      <DialogContentText>
        {t('global.description.delete', { name: erpWarehouse && erpWarehouse.name })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default ErpWarehouseDelete;