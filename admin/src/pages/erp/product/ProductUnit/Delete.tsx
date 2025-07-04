import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteErpProductUnit, ErpProductUnitResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface ErpProductUnitDeleteProps {
  onSubmit: () => void;
}

const ErpProductUnitDelete = forwardRef(({ onSubmit }: ErpProductUnitDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [erpProductUnit, setErpProductUnit] = useState<ErpProductUnitResponse>();

  useImperativeHandle(ref, () => ({
    show(erpProductUnit: ErpProductUnitResponse) {
      setErpProductUnit(erpProductUnit);
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
    if (erpProductUnit) {
      await deleteErpProductUnit(erpProductUnit.id);
    }
    handleClose();
    onSubmit();
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.delete') + t('global.page.erp.product.unit')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
      <DialogContentText>
        {t('global.description.delete', { name: erpProductUnit && erpProductUnit.name })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default ErpProductUnitDelete;