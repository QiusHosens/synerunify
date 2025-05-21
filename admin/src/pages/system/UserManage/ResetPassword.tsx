import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, styled, SvgIcon } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { deleteSystemUser, ResetPasswordSystemUserRequest, SystemUserResponse } from '@/api';

interface FormErrors {
  password?: string; // 密码
}

interface UserResetPasswordProps {
  onSubmit: () => void;
}

const UserResetPassword = forwardRef(({ onSubmit }: UserResetPasswordProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [fullWidth] = useState(true);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<ResetPasswordSystemUserRequest>({
    id: 0,
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const CustomSvgIcon = styled(SvgIcon)({
    fontSize: '1rem',
  });

  useImperativeHandle(ref, () => ({
    show(user: SystemUserResponse) {
      initUser(user);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const initUser = (user: SystemUserResponse) => {
    setUser(prev => ({
      ...prev,
      id: user.id
    }));
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!user.password.trim()) {
      newErrors.password = t('page.user.error.password');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
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
          <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiOutlinedInput-root': { width: '200px' } }} variant="outlined" error={!!errors.password}>
            <InputLabel required size="small" htmlFor="user-password">{t("page.user.title.password")}</InputLabel>
            <OutlinedInput
              required
              size="small"
              id="user-password"
              type={showPassword ? 'text' : 'password'}
              label={t("page.user.title.password")}
              name="password"
              value={formValues.password}
              onChange={handleInputChange}
              error={!!errors.password}
              autoComplete="new-password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? t("global.helper.password.hide") : t("global.helper.password.show")
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                    sx={{
                      p: 1,
                      mr: -1,
                    }}
                  >
                    <CustomSvgIcon fontSize="small" component={showPassword ? PasswordShowIcon : PasswordHideIcon} />
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText id="user-password">{errors.password}</FormHelperText>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
        <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
      </DialogActions>
    </Dialog>
  )
});

export default UserResetPassword;