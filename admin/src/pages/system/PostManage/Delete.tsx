import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteSystemPost, SystemPostResponse } from '@/api';

interface PostDeleteProps {
  onSubmit: () => void;
}

const PostDelete = forwardRef(({ onSubmit }: PostDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [fullWidth] = useState(true);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [post, setPost] = useState<SystemPostResponse>();

  useImperativeHandle(ref, () => ({
    show(post: SystemPostResponse) {
      setPost(post);
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
    if (post) {
      await deleteSystemPost(post.id);
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
      <DialogTitle>{t('global.operate.delete')}{t('global.page.post')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('global.description.delete', { name: post && post.name })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
        <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
      </DialogActions>
    </Dialog>
  )
});

export default PostDelete;