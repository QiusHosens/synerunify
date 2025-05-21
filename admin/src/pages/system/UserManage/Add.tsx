import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, styled, SvgIcon, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createSystemUser, listSystemDepartment, listSystemPost, listSystemRole, SystemDepartmentResponse, SystemPostResponse, SystemRoleResponse, SystemUserRequest } from '@/api';
import SelectTree from '@/components/SelectTree';
import PasswordShowIcon from '@/assets/image/svg/password_show.svg';
import PasswordHideIcon from '@/assets/image/svg/password_hide.svg';
import DictSelect from '@/components/DictSelect';
import CustomizedMultipleSelect, { Item } from '@/components/CustomizedMultipleSelect';
import { Md5 } from 'ts-md5';

interface FormValues {
  username: string; // 用户账号
  password: string; // 密码
  nickname: string; // 用户昵称
  remark: string; // 备注
  email: string; // 用户邮箱
  mobile: string; // 手机号码
  sex: number; // 用户性别
  status: number; // 帐号状态（0正常 1停用）
  department_id: number; // 部门ID
  role_id: number; // 角色ID
  post_ids: number[]; // 岗位ID列表
}

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

interface UserAddProps {
  onSubmit: () => void;
}

const UserAdd = forwardRef(({ onSubmit }: UserAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [fullWidth] = useState(true);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState<SystemRoleResponse[]>([]);
  const [postItems, setPostItems] = useState<Item[]>([]);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | number>(0);
  const [formValues, setFormValues] = useState<FormValues>({
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
    post_ids: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const CustomSvgIcon = styled(SvgIcon)({
    fontSize: '1rem',
  });

  useImperativeHandle(ref, () => ({
    show() {
      listRoles();
      initPosts();
      initDepartments();
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formValues.username.trim()) {
      newErrors.username = t('page.user.error.username');
    }

    if (!formValues.password.trim()) {
      newErrors.password = t('page.user.error.password');
    }

    if (!formValues.nickname.trim()) {
      newErrors.nickname = t('page.user.error.nickname');
    }

    if (!formValues.department_id) {
      newErrors.department_id = t('page.user.error.department');
    }

    if (!formValues.role_id) {
      newErrors.role_id = t('page.user.error.role');
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
      post_ids: [],
    });
    setErrors({});
  }

  const listRoles = async () => {
    const result = await listSystemRole();
    if (result.length > 0) {
      setFormValues(prev => ({
        ...prev,
        role_id: result[0].id
      }));
    }
    setRoles(result);
  }

  const initPosts = async () => {
    const result = await listSystemPost();
    const items = result.map(item => {
      return {
        value: item.id,
        label: item.name,
        status: item.status
      } as Item;
    });
    setPostItems(items);
  }

  const initDepartments = async () => {
    const result = await listSystemDepartment();
    const root = findRoot(result);
    if (root) {
      setSelectedDepartmentId(root.id);
      setFormValues(prev => ({
        ...prev,
        department_id: root.id
      }))
    }
    const tree = buildTree(result, root?.parent_id);
    setTreeData(tree);
  }

  const findRoot = (list: SystemDepartmentResponse[]): SystemDepartmentResponse | undefined => {
    const ids = list.map(item => item.id);
    const parentIds = list.map(item => item.parent_id);
    const rootIds = parentIds.filter(id => ids.indexOf(id) < 0);
    if (rootIds.length > 0) {
      const rootId = rootIds[0];
      return list.filter(item => rootId === item.parent_id)[0];
    }
    return undefined;
  }

  const buildTree = (list: SystemDepartmentResponse[], rootParentId: number | undefined): TreeNode[] => {
    const map: { [key: string]: TreeNode } = {};
    const tree: TreeNode[] = [];

    // Create a map for quick lookup
    for (const item of list) {
      map[item.id] = {
        id: item.id,
        parent_id: item.parent_id,
        label: item.name,
        children: [],
      };
    }

    // Build the tree structure
    for (const item of list) {
      if (item.parent_id === rootParentId) {
        tree.push(map[item.id]);
      } else if (map[item.parent_id]) {
        map[item.parent_id].children.push(map[item.id]);
      }
    }

    return tree;
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      const user = formValues as SystemUserRequest;
      if (user.password) {
        user.password = Md5.hashStr(user.password);
      }
      await createSystemUser(user);
      handleClose();
      onSubmit();
    }
  };

  const handleSubmitAndContinue = async () => {
    if (validateForm()) {
      console.log('formValues', formValues);
      const user = formValues as SystemUserRequest;
      if (user.password) {
        user.password = Md5.hashStr(user.password);
      }
      await createSystemUser(user);
      // reset();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('target', e.target);
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

  const handleSelectChange = (e: SelectChangeEvent<string | number[]>) => {
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

  const handleChange = (name: string, node: TreeNode) => {
    setSelectedDepartmentId(node.id);
    setFormValues(prev => ({
      ...prev,
      [name]: node.id
    }));

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
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>{t('global.operate.add')}{t('global.page.user')}</DialogTitle>
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
          <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiSelect-root': { width: '200px' } }}>
            <SelectTree
              expandToSelected
              name='department_id'
              size="small"
              label={t('page.user.title.department.name')}
              treeData={treeData}
              value={selectedDepartmentId}
              onChange={(name, node) => handleChange(name, node as TreeNode)}
            />
          </FormControl>
          <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '200px' } }}>
            <TextField
              required
              size="small"
              label={t("page.user.title.nickname")}
              name='nickname'
              value={formValues.nickname}
              onChange={handleInputChange}
              error={!!errors.nickname}
              helperText={errors.nickname}
            />
            <TextField
              required
              size="small"
              label={t("page.user.title.username")}
              name='username'
              value={formValues.username}
              onChange={handleInputChange}
              error={!!errors.username}
              helperText={errors.username}
              autoComplete="off"
            />
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
          <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiSelect-root': { width: '200px' } }}>
            <DictSelect name='sex' dict_type='sex' value={formValues.sex.toString()} onChange={handleTypeChange} label={t("page.user.title.sex")} />
          </FormControl>
          <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiSelect-root': { width: '200px' } }}>
            <InputLabel required size="small" id="role-select-label">{t("page.user.title.role.name")}</InputLabel>
            <Select
              required
              size="small"
              labelId="role-select-label"
              name="role_id"
              value={formValues.role_id}
              onChange={(e) => handleInputChange(e as any)}
              label={t("page.user.title.role.name")}
            >
              {roles.map(item => (<MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>))}
            </Select>
          </FormControl>
          <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiSelect-root': { width: '200px' } }}>
            <CustomizedMultipleSelect name='post_ids' value={formValues.post_ids} label={t("page.user.title.post")} items={postItems} onChange={handleSelectChange} />
          </FormControl>
          <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '200px' } }}>
            <TextField
              size="small"
              label={t("page.user.title.mobile")}
              name="mobile"
              value={formValues.mobile}
              onChange={handleInputChange}
            />
            <TextField
              size="small"
              label={t("page.user.title.email")}
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
            />
            <TextField
              size="small"
              label={t("page.user.title.remark")}
              name="remark"
              value={formValues.remark}
              onChange={handleInputChange}
            />
          </FormControl>
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ mr: 4 }}>{t("page.user.title.status")}</Typography>
            <Switch sx={{ mr: 2 }} name='status' checked={!formValues.status} onChange={handleStatusChange} />
            <Typography>{formValues.status == 0 ? t('page.user.switch.status.true') : t('page.user.switch.status.false')}</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmitAndContinue}>{t('global.operate.confirm.continue')}</Button>
        <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
        <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
      </DialogActions>
    </Dialog >
  )
});

export default UserAdd;