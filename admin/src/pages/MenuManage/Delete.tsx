import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteMenu, SystemMenuResponse } from '@/api';

interface DictAddProps {
  onSubmit: () => void;
}

const MenuDelete = forwardRef(({ onSubmit }: DictAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [menu, setMenu] = useState<SystemMenuResponse>();

  useImperativeHandle(ref, () => ({
    show(menu: SystemMenuResponse) {
      setMenu(menu);
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
    menu && await deleteMenu(menu.id);
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
      <DialogTitle>{t('global.operate.delete')}{t('global.page.dict')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('global.description.delete', { name: menu && menu.name })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
        <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
      </DialogActions>
    </Dialog>
  )
});

export default MenuDelete;