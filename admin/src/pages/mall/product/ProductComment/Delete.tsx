import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteMallProductComment, MallProductCommentResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface MallProductCommentDeleteProps {
  onSubmit: () => void;
}

const MallProductCommentDelete = forwardRef(({ onSubmit }: MallProductCommentDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [mallProductComment, setMallProductComment] = useState<MallProductCommentResponse>();

  useImperativeHandle(ref, () => ({
    show(mallProductComment: MallProductCommentResponse) {
      setMallProductComment(mallProductComment);
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
    if (mallProductComment) {
      await deleteMallProductComment(mallProductComment.id);
    }
    handleClose();
    onSubmit();
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.delete') + t('global.page.mall.product.comment')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
      <DialogContentText>
        {t('global.description.delete', { name: mallProductComment?.spu_name || '' })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default MallProductCommentDelete;