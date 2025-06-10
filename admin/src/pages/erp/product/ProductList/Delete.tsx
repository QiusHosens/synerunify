import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteErpProduct, ErpProductResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface ErpProductDeleteProps {
  onSubmit: () => void;
}

const ErpProductDelete = forwardRef(({ onSubmit }: ErpProductDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [erpProduct, setErpProduct] = useState<ErpProductResponse>();

  useImperativeHandle(ref, () => ({
    show(erpProduct: ErpProductResponse) {
      setErpProduct(erpProduct);
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
    if (erpProduct) {
      await deleteErpProduct(erpProduct.id);
    }
    handleClose();
    onSubmit();
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.delete') + t('global.page.erp.product.list')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
      <DialogContentText>
        {t('global.description.delete', { name: erpProduct && erpProduct.name })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default ErpProductDelete;