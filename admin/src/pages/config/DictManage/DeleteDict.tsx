import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteDict, SystemDictDataResponse } from '@/api/dict';
import CustomizedDialog from '@/components/CustomizedDialog';

interface DictAddProps {
  onSubmit: () => void;
}

const DictDelete = forwardRef(({ onSubmit }: DictAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [dict, setDict] = useState<SystemDictDataResponse>();

  useImperativeHandle(ref, () => ({
    show(dict: SystemDictDataResponse) {
      setDict(dict);
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
    if (dict) {
      await deleteDict(dict.id);
    }
    handleClose();
    onSubmit();
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.delete') + t('global.page.dict')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
      <DialogContentText>
        {t('global.description.delete', { name: dict && dict.label })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default DictDelete;