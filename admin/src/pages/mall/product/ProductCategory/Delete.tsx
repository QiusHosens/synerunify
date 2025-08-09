import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteMallProductCategory, MallProductCategoryResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface MallProductCategoryDeleteProps {
  onSubmit: () => void;
}

const MallProductCategoryDelete = forwardRef(({ onSubmit }: MallProductCategoryDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [mallProductCategory, setMallProductCategory] = useState<MallProductCategoryResponse>();

  useImperativeHandle(ref, () => ({
    show(mallProductCategory: MallProductCategoryResponse) {
      setMallProductCategory(mallProductCategory);
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
    if (mallProductCategory) {
      await deleteMallProductCategory(mallProductCategory.id);
    }
    handleClose();
    onSubmit();
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.delete') + t('global.page.mall.product.category')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
      <DialogContentText>
        {t('global.description.delete', { name: mallProductCategory && mallProductCategory.name })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default MallProductCategoryDelete;