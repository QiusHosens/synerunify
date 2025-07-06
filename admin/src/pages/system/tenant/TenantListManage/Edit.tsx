import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { listSystemTenantPackage, SystemTenantEditRequest, SystemTenantPackageResponse, SystemTenantResponse, updateSystemTenant } from '@/api';
import { PickerValue } from '@mui/x-date-pickers/internals';
import dayjs, { Dayjs } from 'dayjs';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors {
  name?: string; // 租户名
  contact_name?: string; // 联系人
  status?: string; // 租户状态（0正常 1停用）
  expire_time?: string; // 过期时间
  account_count?: string; // 账号数量
}

interface TenantEditProps {
  onSubmit: () => void;
}

const TenantEdit = forwardRef(({ onSubmit }: TenantEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [packages, setPackages] = useState<SystemTenantPackageResponse[]>([]);
  const [expireTime, setExpireTime] = useState<Dayjs | null>();
  const [tenant, setTenant] = useState<SystemTenantEditRequest>({
    id: 0,
    name: '',
    contact_name: '',
    contact_mobile: '',
    status: 0,
    website: '',
    package_id: 1,
    expire_time: '',
    account_count: 1,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(tenant: SystemTenantResponse) {
      initForm(tenant);
      listPackage();
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const listPackage = async () => {
    const packages = await listSystemTenantPackage();
    setPackages(packages);
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!tenant.name.trim()) {
      newErrors.name = t('global.error.input.please') + t('common.title.name');
    }

    if (!tenant.contact_name.trim()) {
      newErrors.contact_name = t('global.error.input.please') + t('common.title.contact.person');
    }

    if (!tenant.expire_time.trim()) {
      newErrors.expire_time = t('global.error.select.please') + t('page.tenant.title.expire.time');
    }

    if (!tenant.account_count) {
      newErrors.account_count = t('global.error.input.please') + t('page.tenant.title.account.count');
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

  const initForm = (tenant: SystemTenantResponse) => {
    const date = dayjs(tenant.expire_time, 'YYYY-MM-DD HH:mm:ss', true);
    setExpireTime(date)
    setTenant({
      ...tenant,
    });
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateSystemTenant(tenant);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('target', e.target);
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setTenant(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setTenant(prev => ({
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
    setTenant(prev => ({
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

    setTenant(prev => ({
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
    setTenant(prev => ({
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
          <Button onClick={handleSubmit}>{t('global.operate.update')}</Button>
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
            label={t("page.tenant.title.name")}
            name='name'
            value={tenant.name}
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
            value={tenant.package_id}
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
            value={tenant.contact_name}
            onChange={handleInputChange}
            error={!!errors.contact_name}
            helperText={errors.contact_name}
          />
          <TextField
            size="small"
            label={t("page.tenant.title.contact.mobile")}
            name="contact_mobile"
            value={tenant.contact_mobile}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '240px' } }}>
          <TextField
            size="small"
            label={t("page.tenant.title.website")}
            name="website"
            value={tenant.website}
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
            value={tenant.account_count}
            onChange={handleInputChange}
            error={!!errors.account_count}
            helperText={errors.account_count}
          />
        </FormControl>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 4 }}>{t("page.tenant.title.status")}</Typography>
          <Switch sx={{ mr: 2 }} name='status' checked={!tenant.status} onChange={handleStatusChange} />
          <Typography>{tenant.status == 0 ? t('page.tenant.switch.status.true') : t('page.tenant.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default TenantEdit;