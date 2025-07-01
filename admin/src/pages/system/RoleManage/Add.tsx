import { Box, Button, FormControl, SelectChangeEvent, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import DictSelect from '@/components/DictSelect';
import { createSystemRole, SystemRoleRequest } from '@/api/role';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormValues {
  type: number; // 角色类型
  name: string; // 角色名称
  code: string; // 角色权限字符串
  status: number; // 角色状态（0正常 1停用）
  sort: number; // 显示顺序
  remark: string; // 备注
}

interface FormErrors {
  type?: string; // 角色类型
  name?: string; // 角色名称
  code?: string; // 角色权限字符串
  status?: string; // 角色状态（0正常 1停用）
  sort?: string; // 显示顺序
}

interface RoleAddProps {
  onSubmit: () => void;
}

const RoleAdd = forwardRef(({ onSubmit }: RoleAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [formValues, setFormValues] = useState<FormValues>({
    type: 0,
    name: '',
    code: '',
    status: 0,
    sort: 0,
    remark: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show() {
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formValues.type && formValues.type != 0) {
      newErrors.type = t('global.error.select.please') + t('common.title.type');
    }

    if (!formValues.name.trim()) {
      newErrors.name = t('global.error.input.please') + t('common.title.name');
    }

    if (!formValues.code.trim()) {
      newErrors.code = t('global.error.input.please') + t('common.title.code');
    }

    if (!formValues.sort && formValues.sort != 0) {
      newErrors.sort = t('global.error.input.please') + t('common.title.sort');
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
      type: 0,
      name: '',
      code: '',
      status: 0,
      sort: 0,
      remark: '',
    });
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await createSystemRole(formValues as SystemRoleRequest);
      handleClose();
      onSubmit();
    }
  };

  const handleSubmitAndContinue = async () => {
    if (validateForm()) {
      // console.log('formValues', formValues);
      await createSystemRole(formValues as SystemRoleRequest);
      reset();
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

  const handleTypeChange = (e: SelectChangeEvent<string>) => {
    // console.log('target', e.target);
    const { name, value } = e.target;
    const numberValue = Number(value);
    setFormValues(prev => ({
      ...prev,
      [name]: numberValue
    }));

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

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.add') + t('global.page.role')}
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
        <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiSelect-root': { width: '200px' } }}>
          <DictSelect name='type' dict_type='role_type' value={formValues.type.toString()} onChange={handleTypeChange} label={t("page.role.title.type")}></DictSelect>
        </FormControl>
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '200px' } }}>
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
          <TextField
            size="small"
            label={t("common.title.code")}
            name="code"
            value={formValues.code}
            onChange={handleInputChange}
            error={!!errors.code}
            helperText={errors.code}
          />

          <TextField
            required
            size="small"
            type="number"
            label={t("common.title.sort")}
            name="sort"
            value={formValues.sort}
            onChange={handleInputChange}
            error={!!errors.sort}
            helperText={errors.sort}
          />
          <TextField
            size="small"
            label={t("common.title.remark")}
            name="remark"
            value={formValues.remark}
            onChange={handleInputChange}
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

export default RoleAdd;