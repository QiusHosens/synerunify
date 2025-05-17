import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteSystemTenantPackage, SystemTenantPackageResponse } from '@/api';

interface TenantPackageDeleteProps {
  onSubmit: () => void;
}

const TenantPackageDelete = forwardRef(({ onSubmit }: TenantPackageDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [fullWidth] = useState(true);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [tenantPackage, setTenantPackage] = useState<SystemTenantPackageResponse>();

  useImperativeHandle(ref, () => ({
    show(tenantPackage: SystemTenantPackageResponse) {
      setTenantPackage(tenantPackage);
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
    if (tenantPackage) {
      await deleteSystemTenantPackage(tenantPackage.id);
    }
    handleClose();
    onSubmit();
  };

  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>{t('global.operate.delete')}{t('global.page.tenant.package')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('global.description.delete', { name: tenantPackage && tenantPackage.name })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
        <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
      </DialogActions>
    </Dialog>
  )
});

export default TenantPackageDelete;