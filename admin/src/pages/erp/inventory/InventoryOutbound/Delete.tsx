import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteErpOutboundRecord, ErpOutboundRecordResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface ErpOutboundRecordDeleteProps {
  onSubmit: () => void;
}

const ErpOutboundRecordDelete = forwardRef(({ onSubmit }: ErpOutboundRecordDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [erpOutboundRecord, setErpOutboundRecord] = useState<ErpOutboundRecordResponse>();

  useImperativeHandle(ref, () => ({
    show(erpOutboundRecord: ErpOutboundRecordResponse) {
      setErpOutboundRecord(erpOutboundRecord);
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
    if (erpOutboundRecord) {
      await deleteErpOutboundRecord(erpOutboundRecord.id);
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
        {t('global.description.delete', { name: erpOutboundRecord && erpOutboundRecord.name })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default ErpOutboundRecordDelete;