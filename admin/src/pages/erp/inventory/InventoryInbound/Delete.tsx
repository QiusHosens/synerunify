import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteErpInboundRecord, ErpInboundRecordResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface ErpInboundRecordDeleteProps {
  onSubmit: () => void;
}

const ErpInboundRecordDelete = forwardRef(({ onSubmit }: ErpInboundRecordDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [erpInboundRecord, setErpInboundRecord] = useState<ErpInboundRecordResponse>();

  useImperativeHandle(ref, () => ({
    show(erpInboundRecord: ErpInboundRecordResponse) {
      setErpInboundRecord(erpInboundRecord);
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
    if (erpInboundRecord) {
      await deleteErpInboundRecord(erpInboundRecord.id);
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
        {t('global.description.delete', { name: erpInboundRecord && erpInboundRecord.name })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default ErpInboundRecordDelete;