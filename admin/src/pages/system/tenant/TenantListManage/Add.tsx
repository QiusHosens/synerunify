import { Box, Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, SvgIcon, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createSystemTenant, listSystemTenantPackage, SystemTenantPackageResponse, SystemTenantRequest } from '@/api';
import PasswordShowIcon from '@/assets/image/svg/password_show.svg';
import PasswordHideIcon from '@/assets/image/svg/password_hide.svg';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { Md5 } from 'ts-md5';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormValues {
  name: string; // 租户名
  contact_name: string; // 联系人
  contact_mobile: string; // 联系手机
  username: string; // 租户管理员用户账号
  password: string; // 租户管理员密码
  nickname: string; // 租户管理员用户昵称
  status: number; // 租户状态（0正常 1停用）
  website: string; // 绑定域名
  package_id: number; // 租户套餐编号
  expire_time: string; // 过期时间
  account_count: number; // 账号数量
}

interface FormErrors {
  name?: string; // 租户名
  contact_name?: string; // 联系人
  username?: string; // 租户管理员用户账号
  password?: string; // 租户管理员密码
  nickname?: string; // 租户管理员用户昵称
  status?: string; // 租户状态（0正常 1停用）
  expire_time?: string; // 过期时间
  account_count?: string; // 账号数量
}

interface TenantAddProps {
  onSubmit: () => void;
}

const TenantAdd = forwardRef(({ onSubmit }: TenantAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [showPassword, setShowPassword] = useState(false);
  const [packages, setPackages] = useState<SystemTenantPackageResponse[]>([]);
  const [expireTime, setExpireTime] = useState<Dayjs | null>();
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    contact_name: '',
    contact_mobile: '',
    username: '',
    password: '',
    nickname: '',
    status: 0,
    website: '',
    package_id: 1,
    expire_time: '',
    account_count: 1,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show() {
      initTime();
      listPackage();
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const initTime = () => {
    const date = dayjs().add(1, 'month');
    const time = date.format('YYYY-MM-DD HH:mm:ss');
    setFormValues(prev => ({
      ...prev,
      expire_time: time
    }));
    setExpireTime(date);
  }

  const listPackage = async () => {
    const packages = await listSystemTenantPackage();
    setPackages(packages);
    if (packages.length > 0) {
      setFormValues(prev => ({
        ...prev,
        package_id: packages[0].id
      }));
    }
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formValues.name.trim()) {
      newErrors.name = t('global.error.input.please') + t('common.title.name');
    }

    if (!formValues.contact_name.trim()) {
      newErrors.contact_name = t('global.error.input.please') + t('common.title.contact.person');
    }

    if (!formValues.username.trim()) {
      newErrors.username = t('global.error.input.please') + t('page.tenant.title.admin.username');
    }

    if (!formValues.password.trim()) {
      newErrors.password = t('global.error.input.please') + t('page.tenant.title.admin.password');
    }

    if (!formValues.nickname.trim()) {
      newErrors.nickname = t('global.error.input.please') + t('page.tenant.title.admin.nickname');
    }

    if (!formValues.expire_time.trim()) {
      newErrors.expire_time = t('global.error.select.please') + t('page.tenant.title.expire.time');
    }

    if (!formValues.account_count) {
      newErrors.account_count = t('global.error.input.please') + t('page.tenant.title.account.count');
    }

    console.log('errors', newErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    setOpen(false);
    reset();
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const reset = () => {
    setFormValues({
      name: '',
      contact_name: '',
      contact_mobile: '',
      username: '',
      password: '',
      nickname: '',
      status: 0,
      website: '',
      package_id: 1,
      expire_time: '',
      account_count: 1,
    });
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      const tenant = formValues as SystemTenantRequest;
      tenant.password = Md5.hashStr(tenant.password);
      await createSystemTenant(tenant);
      handleClose();
      onSubmit();
    }
  };

  const handleSubmitAndContinue = async () => {
    if (validateForm()) {
      // console.log('formValues', formValues);
      const tenant = formValues as SystemTenantRequest;
      tenant.password = Md5.hashStr(tenant.password);
      await createSystemTenant(tenant);
      // reset();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('target', e.target);
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setFormValues(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setFormValues(prev => ({
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

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));

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

    setFormValues(prev => ({
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

  const handleDateTimeChange = (value: PickerValue) => {
    setExpireTime(value);
    if (!value) {
      return;
    }
    const name = 'expire_time';
    const time = value.format('YYYY-MM-DD HH:mm:ss');
    setFormValues(prev => ({
      ...prev,
      [name]: time
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
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.add') + t('global.page.tenant')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmitAndContinue}>{t('global.operate.confirm.continue')}</Button>
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
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '240px' } }}>
          <TextField
            required
            size="small"
            label={t("common.title.name")}
            name='name'
            value={formValues.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
        </FormControl>
        <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiSelect-root': { width: '240px' } }}>
          <InputLabel required size="small" id="package-select-label">{t("page.tenant.title.package")}</InputLabel>
          <Select
            required
            size="small"
            classes={{ select: 'CustomSelectSelect' }}
            labelId="package-select-label"
            name="package_id"
            value={formValues.package_id}
            onChange={(e) => handleSelectChange(e)}
            label={t("page.tenant.title.package")}
          >
            {packages.map(item => (<MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '240px' } }}>
          <TextField
            required
            size="small"
            label={t("common.title.contact.person")}
            name='contact_name'
            value={formValues.contact_name}
            onChange={handleInputChange}
            error={!!errors.contact_name}
            helperText={errors.contact_name}
          />
          <TextField
            size="small"
            label={t("page.tenant.title.contact.mobile")}
            name="contact_mobile"
            value={formValues.contact_mobile}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.tenant.title.admin.username")}
            name="username"
            value={formValues.username}
            onChange={handleInputChange}
            error={!!errors.username}
            helperText={errors.username}
            autoComplete="off"
          />
        </FormControl>
        <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiOutlinedInput-root': { width: '240px' } }} variant="outlined" error={!!errors.password}>
          <InputLabel required size="small" htmlFor="tenant-admin-password">{t("page.tenant.title.admin.password")}</InputLabel>
          <OutlinedInput
            required
            size="small"
            id="tenant-admin-password"
            type={showPassword ? 'text' : 'password'}
            label={t("page.tenant.title.admin.password")}
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
          <FormHelperText id="tenant-admin-password">{errors.password}</FormHelperText>
        </FormControl>
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '240px' } }}>
          <TextField
            required
            size="small"
            label={t("page.tenant.title.admin.nickname")}
            name="nickname"
            value={formValues.nickname}
            onChange={handleInputChange}
            error={!!errors.nickname}
            helperText={errors.nickname}
          />
          <TextField
            size="small"
            label={t("page.tenant.title.website")}
            name="website"
            value={formValues.website}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl sx={{ minWidth: 120, '& .MuiPickersTextField-root': { mt: 2, width: '240px' } }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              name='expire_time'
              label={t("page.tenant.title.expire.time")}
              value={expireTime}
              onChange={(value) => handleDateTimeChange(value)}
              slotProps={{
                textField: {
                  size: 'small',
                  required: true,
                  error: !!errors.expire_time,
                  helperText: errors.expire_time,
                },
                openPickerButton: {
                  sx: {
                    mr: -1,
                    '& .MuiSvgIcon-root': {
                      fontSize: '1rem',
                    }
                  }
                },
              }}
            />
          </LocalizationProvider>
        </FormControl>
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '240px' } }}>
          <TextField
            required
            size="small"
            type="number"
            label={t("page.tenant.title.account.count")}
            name="account_count"
            value={formValues.account_count}
            onChange={handleInputChange}
            error={!!errors.account_count}
            helperText={errors.account_count}
          />
        </FormControl>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 4 }}>{t("common.title.status")}</Typography>
          <Switch sx={{ mr: 2 }} name='status' checked={!formValues.status} onChange={handleStatusChange} />
          <Typography>{formValues.status == 0 ? t('common.switch.status.true') : t('common.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default TenantAdd;