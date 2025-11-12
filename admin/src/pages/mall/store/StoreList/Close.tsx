import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { closeMallStore, MallStoreResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface MallStoreCloseProps {
  onSubmit: () => void;
}

const MallStoreClose = forwardRef(({ onSubmit }: MallStoreCloseProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [mallStore, setMallStore] = useState<MallStoreResponse>();

  useImperativeHandle(ref, () => ({
    show(mallStore: MallStoreResponse) {
      setMallStore(mallStore);
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
    if (mallStore) {
      await closeMallStore(mallStore.id);
    }
    handleClose();
    onSubmit();
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.close') + t('global.page.mall.store')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
      <DialogContentText>
        {t('global.description.close', { name: mallStore && mallStore.name })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default MallStoreClose;