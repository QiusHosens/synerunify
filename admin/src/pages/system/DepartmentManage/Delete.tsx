import { Button, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteSystemDepartment, SystemDepartmentResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface MenuDeleteProps {
  onSubmit: () => void;
}

const MenuDelete = forwardRef(({ onSubmit }: MenuDeleteProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [department, setDepartment] = useState<SystemDepartmentResponse>();

  useImperativeHandle(ref, () => ({
    show(department: SystemDepartmentResponse) {
      setDepartment(department);
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
    if (department) {
      await deleteSystemDepartment(department.id);
    }
    handleClose();
    onSubmit();
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.delete') + t('global.page.department')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
      <DialogContentText>
        {t('global.description.delete', { name: department && department.name })}
      </DialogContentText>
    </CustomizedDialog>
  )
});

export default MenuDelete;