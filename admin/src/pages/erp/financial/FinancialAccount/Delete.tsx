import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteErpSettlementAccount, ErpSettlementAccountResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface ErpSettlementAccountDeleteProps {
  onSubmit: () => void;
}

const ErpSettlementAccountDelete = forwardRef(({ onSubmit }: ErpSettlementAccountDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [erpSettlementAccount, setErpSettlementAccount] = useState<ErpSettlementAccountResponse>();

  useImperativeHandle(ref, () => ({
    show(erpSettlementAccount: ErpSettlementAccountResponse) {
      setErpSettlementAccount(erpSettlementAccount);
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
    if (erpSettlementAccount) {
      await deleteErpSettlementAccount(erpSettlementAccount.id);
    }
    handleClose();
    onSubmit();
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.delete') + t('global.page.erp.financial.account')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
      <DialogContentText>
        {t('global.description.delete', { name: erpSettlementAccount && erpSettlementAccount.name })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default ErpSettlementAccountDelete;