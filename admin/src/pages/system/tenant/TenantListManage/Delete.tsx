import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteSystemTenant, SystemTenantResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface TenantDeleteProps {
  onSubmit: () => void;
}

const TenantDelete = forwardRef(({ onSubmit }: TenantDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [tenant, setTenant] = useState<SystemTenantResponse>();

  useImperativeHandle(ref, () => ({
    show(tenant: SystemTenantResponse) {
      setTenant(tenant);
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
    if (tenant) {
      await deleteSystemTenant(tenant.id);
    }
    handleClose();
    onSubmit();
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.delete') + t('global.page.tenant')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
      <DialogContentText>
        {t('global.description.delete', { name: tenant && tenant.name })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default TenantDelete;