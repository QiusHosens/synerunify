import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteSystemUser, SystemUserResponse } from '@/api';

interface UserDeleteProps {
  onSubmit: () => void;
}

const UserDelete = forwardRef(({ onSubmit }: UserDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [fullWidth] = useState(true);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [user, setUser] = useState<SystemUserResponse>();

  useImperativeHandle(ref, () => ({
    show(user: SystemUserResponse) {
      setUser(user);
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
    if (user) {
      await deleteSystemUser(user.id);
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
      <DialogTitle>{t('global.operate.delete')}{t('global.page.user')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('global.description.delete', { name: user && user.nickname })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
        <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
      </DialogActions>
    </Dialog>
  )
});

export default UserDelete;