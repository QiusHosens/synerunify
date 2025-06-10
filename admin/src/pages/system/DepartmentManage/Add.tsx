import { Box, Button, FormControl, InputLabel, MenuItem, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { createSystemDepartment, listDepartmentSystemUser, listSystemDepartment, SystemDepartmentRequest, SystemDepartmentResponse, SystemUserBaseResponse } from '@/api';
import SelectTree from '@/components/SelectTree';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormValues {
  name: string; // 部门名称
  parent_id: number; // 父部门id
  sort: number; // 显示顺序
  leader_user_id?: number; // 负责人
  phone: string; // 联系电话
  email: string; // 邮箱
  status: number; // 部门状态（0正常 1停用）
}

interface FormErrors {
  name?: string; // 部门名称
  parent_id?: string; // 父部门id
  sort?: string; // 显示顺序
}

interface TreeNode {
  id: string | number;
  parent_id: number; // 父菜单ID
  label: string;
  children: TreeNode[];
}

interface DepartmentAddProps {
  onSubmit: () => void;
}

const DepartmentAdd = forwardRef(({ onSubmit }: DepartmentAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [users, setUsers] = useState<SystemUserBaseResponse[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | number>(0);
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    parent_id: 0,
    sort: 0,
    phone: '',
    email: '',
    status: 0,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show() {
      refreshDepartments(true);
      initUsers();
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formValues.name.trim()) {
      newErrors.name = t('page.department.error.name');
    }

    if (!formValues.parent_id && formValues.parent_id != 0) {
      newErrors.parent_id = t('page.department.error.parent');
    }

    if (!formValues.sort && formValues.sort != 0) {
      newErrors.sort = t('page.department.error.sort');
    }

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
      parent_id: 0,
      sort: 0,
      phone: '',
      email: '',
      status: 0,
    });
    setErrors({});
  }

  const initUsers = async () => {
    const result = await listDepartmentSystemUser();
    setUsers(result);
  }

  const refreshDepartments = async (isInit: boolean) => {
    const result = await listSystemDepartment();
    const root = findRoot(result);
    if (root && isInit) {
      setSelectedDepartmentId(root.id);
      setFormValues(prev => ({
        ...prev,
        parent_id: root.id
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
      await createSystemDepartment(formValues as SystemDepartmentRequest);
      handleClose();
      onSubmit();
    }
  };

  const handleSubmitAndContinue = async () => {
    if (validateForm()) {
      await createSystemDepartment(formValues as SystemDepartmentRequest);
      refreshDepartments(false);
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

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.add') + t('global.page.department')}
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
          <SelectTree
            expandToSelected
            name='parent_id'
            size="small"
            label={t('page.department.title.parent')}
            treeData={treeData}
            value={selectedDepartmentId}
            onChange={(name, node) => handleChange(name, node as TreeNode)}
          />
        </FormControl>
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '200px' } }}>
          <TextField
            required
            size="small"
            label={t("page.department.title.name")}
            name='name'
            value={formValues.name}
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
            name="package_id"
            value={formValues.leader_user_id}
            onChange={(e) => handleSelectChange(e)}
            label={t("page.department.title.leader.user.name")}
          >
            {users.map(item => (<MenuItem key={item.id} value={item.id}>{item.nickname}</MenuItem>))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '200px' } }}>
          <TextField
            size="small"
            label={t("page.department.title.phone")}
            name="phone"
            value={formValues.phone}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.department.title.email")}
            name="email"
            value={formValues.email}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.department.title.sort")}
            name="sort"
            value={formValues.sort}
            onChange={handleInputChange}
            error={!!errors.sort}
            helperText={errors.sort}
          />
        </FormControl>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 4 }}>{t("page.department.title.status")}</Typography>
          <Switch sx={{ mr: 2 }} name='status' checked={!formValues.status} onChange={handleStatusChange} />
          <Typography>{formValues.status == 0 ? t('page.department.switch.status.true') : t('page.department.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default DepartmentAdd;