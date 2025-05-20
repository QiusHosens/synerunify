import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { SystemUserRequest, SystemUserResponse, updateSystemUser } from '@/api';

interface FormErrors {
  username?: string; // 用户账号
  password?: string; // 密码
  nickname?: string; // 用户昵称
  department_id?: string; // 部门ID
  role_id?: string; // 角色ID
}

interface TreeNode {
  id: string | number;
  parent_id: number; // 父菜单ID
  label: string;
  children: TreeNode[];
}

interface UserEditProps {
  onSubmit: () => void;
}

const UserEdit = forwardRef(({ onSubmit }: UserEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [fullWidth] = useState(true);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [user, setUser] = useState<SystemUserResponse>({
    id: 0,
    username: '',
    password: '',
    nickname: '',
    remark: '',
    email: '',
    mobile: '',
    sex: 0,
    status: 0,
    department_id: 0,
    role_id: 0,
    user_ids: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(user: SystemUserResponse) {
      initForm(user);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!user.name.trim()) {
      newErrors.name = t('page.user.error.name');
    }

    if (!user.sort && user.sort != 0) {
      newErrors.sort = t('page.user.error.sort');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    setOpen(false);
    // reset();
  };

  const handleClose = () => {
    setOpen(false);
    // reset();
  };

  const initForm = (user: SystemUserResponse) => {
    setUser({
      ...user,
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateSystemUser(user);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('target', e.target);
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setUser(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setUser(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // console.log('formValues', formValues);

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    // console.log('target', e.target, checked);
    const { name } = e.target;

    setUser(prev => ({
      ...prev,
      [name]: checked ? 0 : 1
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>{t('global.operate.edit')}{t('global.page.user')}</DialogTitle>
      <DialogContent>
        <Box
          noValidate
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            m: 'auto',
            width: 'fit-content',
          }}
        >
          <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '200px' } }}>
            <TextField
              required
              size="small"
              label={t("page.user.title.name")}
              name='name'
              value={user.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              size="small"
              label={t("page.user.title.code")}
              name='code'
              value={user.code}
              onChange={handleInputChange}
            />
            <TextField
              required
              size="small"
              type="number"
              label={t("page.user.title.sort")}
              name="sort"
              value={user.sort}
              onChange={handleInputChange}
              error={!!errors.sort}
              helperText={errors.sort}
            />
            <TextField
              size="small"
              label={t("page.user.title.remark")}
              name="remark"
              value={user.remark}
              onChange={handleInputChange}
            />
          </FormControl>
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ mr: 4 }}>{t("page.user.title.status")}</Typography>
            <Switch sx={{ mr: 2 }} name='status' checked={!user.status} onChange={handleStatusChange} />
            <Typography>{user.status == 0 ? t('page.user.switch.status.true') : t('page.user.switch.status.false')}</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>{t('global.operate.update')}</Button>
        <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
      </DialogActions>
    </Dialog >
  )
});

export default UserEdit;