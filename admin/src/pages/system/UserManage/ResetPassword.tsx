import { Box, Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack, SvgIcon } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { resetPasswordSystemUser, ResetPasswordSystemUserRequest, SystemUserResponse } from '@/api';
import { Md5 } from 'ts-md5';
import PasswordShowIcon from '@/assets/image/svg/password_show.svg';
import PasswordHideIcon from '@/assets/image/svg/password_hide.svg';
import CustomizedTag from '@/components/CustomizedTag';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors {
  password?: string; // 密码
}

interface UserResetPasswordProps {
  onSubmit: () => void;
}

const UserResetPassword = forwardRef(({ onSubmit }: UserResetPasswordProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [showPassword, setShowPassword] = useState(false);
  const [originUser, setOriginUser] = useState<SystemUserResponse>();
  const [user, setUser] = useState<ResetPasswordSystemUserRequest>({
    id: 0,
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(user: SystemUserResponse) {
      setOriginUser(user);
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
      newErrors.password = t('global.error.input.please') + t('page.user.title.password');
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
    if (validateForm()) {
      user.password = Md5.hashStr(user.password);
      await resetPasswordSystemUser(user);
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

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('page.user.operate.reset')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
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
        <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiStack-root': { mt: 2, width: '200px' } }}>
          <Stack direction="row" spacing={2}>
            <Box>{t('page.user.title.username')}</Box>
            <Box>{originUser && <CustomizedTag label={originUser.username} />}</Box>
          </Stack>
        </FormControl>
        <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiOutlinedInput-root': { width: '200px' } }} variant="outlined" error={!!errors.password}>
          <InputLabel required size="small" htmlFor="user-password">{t("page.user.title.password")}</InputLabel>
          <OutlinedInput
            required
            size="small"
            id="user-password"
            type={showPassword ? 'text' : 'password'}
            label={t("page.user.title.password")}
            name="password"
            value={user.password}
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
                    p: 0.5,
                    mr: -1,
                  }}
                >
                  {/* <CustomSvgIcon fontSize="small" component={showPassword ? PasswordShowIcon : PasswordHideIcon} /> */}
                  <SvgIcon fontSize="small">
                    {showPassword ? <PasswordShowIcon /> : <PasswordHideIcon />}
                  </SvgIcon>
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText id="user-password">{errors.password}</FormHelperText>
        </FormControl>
      </Box>
    </CustomizedDialog>
  )
});

export default UserResetPassword;