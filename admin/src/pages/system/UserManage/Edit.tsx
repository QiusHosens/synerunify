import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { getSystemUserPostByUser, listSystemDepartment, listSystemPost, listSystemRole, SystemDepartmentResponse, SystemRoleResponse, SystemUserRequest, SystemUserResponse, updateSystemUser } from '@/api';
import CustomizedMultipleSelect, { Item } from '@/components/CustomizedMultipleSelect';
import DictSelect from '@/components/DictSelect';
import SelectTree from '@/components/SelectTree';
import CustomizedDialog from '@/components/CustomizedDialog';

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
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [roles, setRoles] = useState<SystemRoleResponse[]>([]);
  const [postItems, setPostItems] = useState<Item[]>([]);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | number>(0);
  const [user, setUser] = useState<SystemUserRequest>({
    id: 0,
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

  useImperativeHandle(ref, () => ({
    show(user: SystemUserResponse) {
      initForm(user);
      initUserPosts(user)
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

    if (!user.nickname.trim()) {
      newErrors.nickname = t('global.error.input.please') + t('page.user.title.nickname');
    }

    if (!user.department_id) {
      newErrors.department_id = t('global.error.select.please') + t('page.user.title.department');
    }

    if (!user.role_id) {
      newErrors.role_id = t('global.error.select.please') + t('page.user.title.role');
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
    setUser(prev => ({
      ...prev,
      ...user,
    }))
    setErrors({});
  }

  const initUserPosts = async (user: SystemUserResponse) => {
    const result = await getSystemUserPostByUser(user.id);
    setUser(prev => ({
      ...prev,
      post_ids: result
    }))
  }

  const listRoles = async () => {
    const result = await listSystemRole();
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

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setUser(prev => ({
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

  const handleTypeChange = (e: SelectChangeEvent<string>) => {
    // console.log('target', e.target);
    const { name, value } = e.target;
    const numberValue = Number(value);
    setUser(prev => ({
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

  const handleMultiSelectChange = (e: SelectChangeEvent<string | number[]>) => {
    const { name, value } = e.target;
    setUser(prev => ({
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
    setUser(prev => ({
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

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.edit') + t('global.page.user')}
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
            value={user.nickname}
            onChange={handleInputChange}
            error={!!errors.nickname}
            helperText={errors.nickname}
          />
        </FormControl>
        <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiSelect-root': { width: '200px' } }}>
          <DictSelect name='sex' dict_type='sex' value={user.sex.toString()} onChange={handleTypeChange} label={t("page.user.title.sex")} />
        </FormControl>
        <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiSelect-root': { width: '200px' } }}>
          <InputLabel required size="small" id="role-select-label">{t("page.user.title.role.name")}</InputLabel>
          <Select
            required
            size="small"
            labelId="role-select-label"
            name="role_id"
            value={user.role_id}
            onChange={(e) => handleSelectChange(e)}
            label={t("page.user.title.role.name")}
          >
            {roles.map(item => (<MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>))}
          </Select>
        </FormControl>
        <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiSelect-root': { width: '200px' } }}>
          <CustomizedMultipleSelect name='post_ids' value={user.post_ids} label={t("page.user.title.post")} items={postItems} onChange={handleMultiSelectChange} />
        </FormControl>
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '200px' } }}>
          <TextField
            size="small"
            label={t("page.user.title.mobile")}
            name="mobile"
            value={user.mobile}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("common.title.email")}
            name="email"
            value={user.email}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("common.title.remark")}
            name="remark"
            value={user.remark}
            onChange={handleInputChange}
          />
        </FormControl>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 4 }}>{t("common.title.status")}</Typography>
          <Switch sx={{ mr: 2 }} name='status' checked={!user.status} onChange={handleStatusChange} />
          <Typography>{user.status == 0 ? t('common.switch.status.true') : t('common.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default UserEdit;