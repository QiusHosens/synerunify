import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteErpInventoryRecord, ErpInventoryRecordResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface ErpInventoryRecordDeleteProps {
  onSubmit: () => void;
}

const ErpInventoryRecordDelete = forwardRef(({ onSubmit }: ErpInventoryRecordDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [erpInventoryRecord, setErpInventoryRecord] = useState<ErpInventoryRecordResponse>();

  useImperativeHandle(ref, () => ({
    show(erpInventoryRecord: ErpInventoryRecordResponse) {
      setErpInventoryRecord(erpInventoryRecord);
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
    if (erpInventoryRecord) {
      await deleteErpInventoryRecord(erpInventoryRecord.id);
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
        {t('global.description.delete', { name: erpInventoryRecord && erpInventoryRecord.name })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default ErpInventoryRecordDelete;