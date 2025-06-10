import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteErpProductCategory, ErpProductCategoryResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface ErpProductCategoryDeleteProps {
  onSubmit: () => void;
}

const ErpProductCategoryDelete = forwardRef(({ onSubmit }: ErpProductCategoryDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [erpProductCategory, setErpProductCategory] = useState<ErpProductCategoryResponse>();

  useImperativeHandle(ref, () => ({
    show(erpProductCategory: ErpProductCategoryResponse) {
      setErpProductCategory(erpProductCategory);
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
    if (erpProductCategory) {
      await deleteErpProductCategory(erpProductCategory.id);
    }
    handleClose();
    onSubmit();
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.delete') + t('global.page.erp.product.category')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
      <DialogContentText>
        {t('global.description.delete', { name: erpProductCategory && erpProductCategory.name })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default ErpProductCategoryDelete;