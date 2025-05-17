import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteSystemRole, SystemRoleResponse } from '@/api/role';

interface RoleDeleteProps {
  onSubmit: () => void;
}

const RoleDelete = forwardRef(({ onSubmit }: RoleDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [fullWidth] = useState(true);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [role, setRole] = useState<SystemRoleResponse>();

  useImperativeHandle(ref, () => ({
    show(role: SystemRoleResponse) {
      setRole(role);
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
    if (role) {
      await deleteSystemRole(role.id);
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
      <DialogTitle>{t('global.operate.delete')}{t('global.page.role')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('global.description.delete', { name: role && role.name })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
        <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
      </DialogActions>
    </Dialog>
  )
});

export default RoleDelete;