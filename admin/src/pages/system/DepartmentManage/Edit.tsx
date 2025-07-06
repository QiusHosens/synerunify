import { Box, Button, FormControl, InputLabel, MenuItem, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { listDepartmentSystemUser, SystemDepartmentEditRequest, SystemDepartmentResponse, SystemUserBaseResponse, updateSystemDepartment } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors {
  name?: string; // 部门名称
  sort?: string; // 显示顺序
}

interface DepartmentEditProps {
  onSubmit: () => void;
}

const DepartmentEdit = forwardRef(({ onSubmit }: DepartmentEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [users, setUsers] = useState<SystemUserBaseResponse[]>([]);
  const [department, setDepartment] = useState<SystemDepartmentEditRequest>({
    id: 0,
    name: '',
    sort: 0,
    phone: '',
    email: '',
    status: 0,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(department: SystemDepartmentResponse) {
      initForm(department);
      initUsers();
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!department.name.trim()) {
      newErrors.name = t('global.error.input.please') + t('common.title.name');
    }

    if (!department.sort && department.sort != 0) {
      newErrors.sort = t('global.error.input.please') + t('common.title.sort');
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

  const initUsers = async () => {
    const result = await listDepartmentSystemUser();
    setUsers(result);
  }

  const initForm = (department: SystemDepartmentResponse) => {
    setDepartment({
      ...department,
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateSystemDepartment(department);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('target', e.target);
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setDepartment(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setDepartment(prev => ({
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

    setDepartment(prev => ({
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

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setDepartment(prev => ({
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

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.edit') + t('global.page.department')}
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
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '200px' } }}>
          <TextField
            required
            size="small"
            label={t("common.title.name")}
            name='name'
            value={department.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
        </FormControl>
        <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiSelect-root': { width: '200px' } }}>
          <InputLabel size="small" id="leader-select-label">{t("page.department.title.leader.user.name")}</InputLabel>
          <Select
            size="small"
            labelId="leader-select-label"
            name="leader_user_id"
            value={department.leader_user_id}
            onChange={(e) => handleSelectChange(e)}
            label={t("page.department.title.leader.user.name")}
          >
            {users.map(item => (<MenuItem key={item.id} value={item.id}>{item.nickname}</MenuItem>))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '200px' } }}>
          <TextField
            size="small"
            label={t("common.title.phone")}
            name="phone"
            value={department.phone}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("common.title.email")}
            name="email"
            value={department.email}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("common.title.sort")}
            name="sort"
            value={department.sort}
            onChange={handleInputChange}
            error={!!errors.sort}
            helperText={errors.sort}
          />
        </FormControl>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 4 }}>{t("common.title.status")}</Typography>
          <Switch sx={{ mr: 2 }} name='status' checked={!department.status} onChange={handleStatusChange} />
          <Typography>{department.status == 0 ? t('common.switch.status.true') : t('common.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default DepartmentEdit;