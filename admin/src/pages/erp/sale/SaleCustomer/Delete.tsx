import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteErpCustomer, ErpCustomerResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface ErpCustomerDeleteProps {
  onSubmit: () => void;
}

const ErpCustomerDelete = forwardRef(({ onSubmit }: ErpCustomerDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [erpCustomer, setErpCustomer] = useState<ErpCustomerResponse>();

  useImperativeHandle(ref, () => ({
    show(erpCustomer: ErpCustomerResponse) {
      setErpCustomer(erpCustomer);
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
    if (erpCustomer) {
      await deleteErpCustomer(erpCustomer.id);
    }
    handleClose();
    onSubmit();
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.delete') + t('global.page.erp.sale.customer')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
      <DialogContentText>
        {t('global.description.delete', { name: erpCustomer && erpCustomer.name })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default ErpCustomerDelete;