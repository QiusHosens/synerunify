import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteMallProductBrand, MallProductBrandResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface MallProductBrandDeleteProps {
  onSubmit: () => void;
}

const MallProductBrandDelete = forwardRef(({ onSubmit }: MallProductBrandDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [mallProductBrand, setMallProductBrand] = useState<MallProductBrandResponse>();

  useImperativeHandle(ref, () => ({
    show(mallProductBrand: MallProductBrandResponse) {
      setMallProductBrand(mallProductBrand);
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
    if (mallProductBrand) {
      await deleteMallProductBrand(mallProductBrand.id);
    }
    handleClose();
    onSubmit();
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.delete') + t('global.page.mall.product.brand')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
      <DialogContentText>
        {t('global.description.delete', { name: mallProductBrand && mallProductBrand.name })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default MallProductBrandDelete;