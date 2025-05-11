import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Stack, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { SelectChangeEvent } from '@mui/material/Select';
import DictSelect from '@/components/DictSelect';
import { createMenu, listMenu, SystemMenuRequest, SystemMenuResponse } from '@/api';
import QuestionBadge from '@/components/QuestionBadge';
import SelectTree from '@/components/SelectTree';

interface FormValues {
  name: string; // 菜单名称
  permission: string; // 权限标识
  type: number; // 菜单类型
  sort: number; // 显示顺序
  parent_id: number; // 父菜单ID
  path: string; // 路由地址
  icon: string; // 菜单图标
  component: string; // 组件路径
  component_name: string; // 组件名
  status: number; // 菜单状态
  visible: boolean; // 是否可见
  keep_alive: boolean; // 是否缓存
  always_show: boolean; // 是否总是显示
}

interface FormErrors {
  name?: string; // 菜单名称
  permission?: string; // 权限标识
  type?: string; // 菜单类型
  sort?: string; // 显示顺序
  parent_id?: string; // 父菜单ID
  path?: string; // 路由地址
  icon?: string; // 菜单图标
  component?: string; // 组件路径
  component_name?: string; // 组件名
  status?: string; // 菜单状态
  visible?: string; // 是否可见
  keep_alive?: string; // 是否缓存
  always_show?: string; // 是否总是显示
}

interface TreeNode {
  id: string | number;
  parent_id: number; // 父菜单ID
  label: string;
  children: TreeNode[];
}

interface MenuAddProps {
  onSubmit: () => void;
}

const MenuAdd = forwardRef(({ onSubmit }: MenuAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [type, setType] = useState<string>('0');
  const [fullWidth] = useState(true);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [menuTreeData, setMenuTreeData] = useState<TreeNode[]>([
    {
      id: 0,
      parent_id: -1,
      label: '根节点',
      children: [],
    }
  ]);
  const [selectedMenuId, setSelectedMenuId] = useState<string | number>(0);
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    permission: '',
    type: 0,
    sort: 0,
    parent_id: 0,
    path: '',
    icon: '',
    component: '',
    component_name: '',
    status: 0,
    visible: true,
    keep_alive: true,
    always_show: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show() {
      initMenus();
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const type = formValues.type;

    if (!formValues.name.trim()) {
      newErrors.name = t('page.menu.error.name');
    }

    if (type != 0 && !formValues.permission.trim()) {
      newErrors.permission = t('page.menu.error.permission');
    }

    if (!formValues.type && formValues.type != 0) {
      newErrors.type = t('page.menu.error.type');
    }

    if (!formValues.sort && formValues.sort != 0) {
      newErrors.sort = t('page.menu.error.sort');
    }

    if (!formValues.parent_id && formValues.parent_id != 0) {
      newErrors.parent_id = t('page.menu.error.parent');
    }

    if (type != 2 && !formValues.path.trim()) {
      newErrors.path = t('page.menu.error.path');
    }

    if (type != 2 && !formValues.icon.trim()) {
      newErrors.icon = t('page.menu.error.icon');
    }

    if (type == 1 && !formValues.component.trim()) {
      newErrors.component = t('page.menu.error.component');
    }

    if (type == 1 && !formValues.component_name.trim()) {
      newErrors.component_name = t('page.menu.error.component.name');
    }

    if (!formValues.status && formValues.status != 0) {
      newErrors.status = t('page.menu.error.status');
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
      permission: '',
      type: 0,
      sort: 0,
      parent_id: 0,
      path: '',
      icon: '',
      component: '',
      component_name: '',
      status: 0,
      visible: true,
      keep_alive: true,
      always_show: true,
    });
    setErrors({});
  }

  const initMenus = async () => {
    const result = await listMenu();
    const tree = buildMenuTree(result);
    setMenuTreeData(tree);
  }

  const buildMenuTree = (list: SystemMenuResponse[]): TreeNode[] => {
    const map: { [key: string]: TreeNode } = {};
    const tree: TreeNode[] = [];

    // 添加根节点
    list.splice(0, 0, {
      id: 0,
      parent_id: -1,
      name: '根节点',
    } as SystemMenuResponse);

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
      if (item.parent_id === -1) {
        tree.push(map[item.id]);
      } else if (map[item.parent_id]) {
        map[item.parent_id].children.push(map[item.id]);
      }
    }

    return tree;
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await createMenu(formValues as SystemMenuRequest);
      handleClose();
      onSubmit();
    }
  };

  const handleSubmitAndContinue = async () => {
    if (validateForm()) {
      console.log('formValues', formValues);
      await createMenu(formValues as SystemMenuRequest);
      reset();
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

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    // console.log('target', e.target, checked);
    const { name } = e.target;

    setFormValues(prev => ({
      ...prev,
      [name]: checked
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

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    const type = event.target.value as string;
    setType(type);
    // 重新设置值
    const numberType = Number(type);
    switch (numberType) {
      case 0:
        setFormValues(prev => ({
          ...prev,
          type: numberType,
          permission: '',
          component: '',
          component_name: '',
          keep_alive: false,
        }));
        setErrors({});
        break;
      case 1:
        setFormValues(prev => ({
          ...prev,
          type: numberType,
        }));
        setErrors({});
        break;
      case 2:
        setFormValues(prev => ({
          ...prev,
          type: numberType,
          path: '',
          icon: '',
          component: '',
          component_name: '',
          visible: true,
          always_show: true,
          keep_alive: false,
        }));
        setErrors({});
        break;
    }
  }



  const handleChange = (name: string, value: string | number) => {
    setSelectedMenuId(value);
    // console.log('Selected:', value);
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

  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>{t('global.operate.add')}{t('global.page.menu')}</DialogTitle>
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
            <DictSelect type='menu_type' value={type} onChange={handleTypeChange} label={t("page.menu.title.type")}></DictSelect>
          </FormControl>
          <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiSelect-root': { width: '200px' } }}>
            <SelectTree
              name='parent_id'
              size="small"
              label={t('page.menu.title.parent')}
              treeData={menuTreeData}
              value={selectedMenuId}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '200px' } }}>
            <TextField
              required
              size="small"
              label={t("page.menu.title.name")}
              name='name'
              value={formValues.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
            />
            {type != '2' && <TextField
              size="small"
              label={t("page.menu.title.icon")}
              name="icon"
              value={formValues.icon}
              onChange={handleInputChange}
              error={!!errors.icon}
              helperText={errors.icon}
            />}
            {type != '2' && <TextField
              required
              size="small"
              label={t("page.menu.title.path")}
              name="path"
              value={formValues.path}
              onChange={handleInputChange}
              error={!!errors.path}
              helperText={errors.path}
            />}

            {type == '1' && <TextField
              size="small"
              label={t("page.menu.title.component")}
              name="component"
              value={formValues.component}
              onChange={handleInputChange}
              error={!!errors.component}
              helperText={errors.component}
            />}
            {type == '1' && <TextField
              size="small"
              label={t("page.menu.title.component.name")}
              name="component_name"
              value={formValues.component_name}
              onChange={handleInputChange}
              error={!!errors.component_name}
              helperText={errors.component_name}
            />}

            {type != '0' && <TextField
              size="small"
              label={t("page.menu.title.permission")}
              name="permission"
              value={formValues.permission}
              onChange={handleInputChange}
              error={!!errors.permission}
              helperText={errors.permission}
            />}
            <TextField
              required
              size="small"
              type="number"
              label={t("page.menu.title.sort")}
              name="sort"
              value={formValues.sort}
              onChange={handleInputChange}
              error={!!errors.sort}
              helperText={errors.sort}
            />

          </FormControl>
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ mr: 4 }}>{t("page.menu.title.status")}</Typography>
            <Switch sx={{ mr: 2 }} name='status' checked={!formValues.status} onChange={handleStatusChange} />
            <Typography>{formValues.status == 0 ? t('page.menu.switch.status.true') : t('page.menu.switch.status.false')}</Typography>
          </Box>
          {type != '2' && <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
            <QuestionBadge title={t("page.menu.tip.visible")}>
              <Typography>{t("page.menu.title.visible")}</Typography>
            </QuestionBadge>
            <Switch name='visible' checked={formValues.visible} onChange={handleSwitchChange} />
            <Typography>{formValues.visible ? t('page.menu.switch.visible.true') : t('page.menu.switch.visible.false')}</Typography>
          </Stack>}
          {type != '2' && <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
            <QuestionBadge title={t("page.menu.tip.always.show")}>
              <Typography>{t("page.menu.title.always.show")}</Typography>
            </QuestionBadge>
            <Switch name='always_show' checked={formValues.always_show} onChange={handleSwitchChange} />
            <Typography>{formValues.always_show ? t('page.menu.switch.always.true') : t('page.menu.switch.always.false')}</Typography>
          </Stack>}
          {type == '1' && <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
            <QuestionBadge title={t("page.menu.tip.keep.alive")}>
              <Typography>{t("page.menu.title.keep.alive")}</Typography>
            </QuestionBadge>
            <Switch name='keep_alive' checked={formValues.keep_alive} onChange={handleSwitchChange} />
            <Typography>{formValues.keep_alive ? t('page.menu.switch.keep.true') : t('page.menu.switch.keep.false')}</Typography>
          </Stack>}
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

export default MenuAdd;