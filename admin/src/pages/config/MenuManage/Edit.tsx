import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Stack, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { SelectChangeEvent } from '@mui/material/Select';
import DictSelect from '@/components/DictSelect';
import { listMenu, SystemMenuRequest, SystemMenuResponse, updateMenu } from '@/api';
import QuestionBadge from '@/components/QuestionBadge';
import SelectTree from '@/components/SelectTree';

interface FormErrors {
  name?: string; // 菜单名称
  // permission?: string; // 权限标识
  type?: string; // 菜单类型
  sort?: string; // 显示顺序
  parent_id?: string; // 父菜单ID
  path?: string; // 路由地址
  // icon?: string; // 菜单图标
  // component?: string; // 组件路径
  // component_name?: string; // 组件名
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

interface MenuEditProps {
  onSubmit: () => void;
}

const MenuEdit = forwardRef(({ onSubmit }: MenuEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [type, setType] = useState<string>('1');
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
  const [menu, setMenu] = useState<SystemMenuRequest>({
    id: 0,
    name: '',
    permission: '',
    type: 0,
    sort: 0,
    parent_id: 0,
    path: '',
    icon: '',
    component: '',
    component_name: '',
    i18n: '',
    status: 0,
    visible: true,
    keep_alive: true,
    always_show: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(menu: SystemMenuResponse) {
      initMenus();
      initForm(menu);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const type = menu.type;

    if (!menu.name.trim()) {
      newErrors.name = t('page.menu.error.name');
    }

    // if (type != 0 && !menu.permission.trim()) {
    //   newErrors.permission = t('page.menu.error.permission');
    // }

    if (!menu.type && menu.type != 0) {
      newErrors.type = t('page.menu.error.type');
    }

    if (!menu.sort && menu.sort != 0) {
      newErrors.sort = t('page.menu.error.sort');
    }

    if (!menu.parent_id && menu.parent_id != 0) {
      newErrors.parent_id = t('page.menu.error.parent');
    }

    if (type != 3 && !menu.path.trim()) {
      newErrors.path = t('page.menu.error.path');
    }

    // if (type != 2 && !menu.icon.trim()) {
    //   newErrors.icon = t('page.menu.error.icon');
    // }

    // if (type == 1 && !menu.component.trim()) {
    //   newErrors.component = t('page.menu.error.component');
    // }

    // if (type == 1 && !menu.component_name.trim()) {
    //   newErrors.component_name = t('page.menu.error.component.name');
    // }

    if (!menu.status && menu.status != 0) {
      newErrors.status = t('page.menu.error.status');
    }

    // console.log('errors', newErrors);

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

  const initForm = (menu: SystemMenuResponse) => {
    setType(menu.type.toString());
    setSelectedMenuId(menu.parent_id);
    setMenu({
      ...menu,
    })
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
      await updateMenu(menu);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('target', e.target);
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setMenu(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setMenu(prev => ({
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

    setMenu(prev => ({
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

    setMenu(prev => ({
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
      case 1:
        setMenu(prev => ({
          ...prev,
          type: numberType,
          permission: '',
          component: '',
          component_name: '',
          keep_alive: false,
        }));
        setErrors({});
        break;
      case 2:
        setMenu(prev => ({
          ...prev,
          type: numberType,
        }));
        setErrors({});
        break;
      case 3:
        setMenu(prev => ({
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



  const handleChange = (name: string, node: TreeNode) => {
    setSelectedMenuId(node.id);
    // console.log('Selected:', value);
    setMenu(prev => ({
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
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>{t('global.operate.edit')}{t('global.page.menu')}</DialogTitle>
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
            <DictSelect dict_type='menu_type' value={type} onChange={handleTypeChange} label={t("page.menu.title.type")}></DictSelect>
          </FormControl>
          <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiSelect-root': { width: '200px' } }}>
            <SelectTree
              expandToSelected
              name='parent_id'
              size="small"
              label={t('page.menu.title.parent')}
              treeData={menuTreeData}
              value={selectedMenuId}
              onChange={(name, node) => handleChange(name, node as TreeNode)}
            />
          </FormControl>
          <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '200px' } }}>
            <TextField
              required
              size="small"
              label={t("page.menu.title.name")}
              name='name'
              value={menu.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
            />
            {type != '3' && <TextField
              size="small"
              label={t("page.menu.title.icon")}
              name="icon"
              value={menu.icon}
              onChange={handleInputChange}
            // error={!!errors.icon}
            // helperText={errors.icon}
            />}
            {type != '3' && <TextField
              required
              size="small"
              label={t("page.menu.title.path")}
              name="path"
              value={menu.path}
              onChange={handleInputChange}
              error={!!errors.path}
              helperText={errors.path}
            />}

            {type == '2' && <TextField
              size="small"
              label={t("page.menu.title.component")}
              name="component"
              value={menu.component}
              onChange={handleInputChange}
            // error={!!errors.component}
            // helperText={errors.component}
            />}
            {type == '2' && <TextField
              size="small"
              label={t("page.menu.title.component.name")}
              name="component_name"
              value={menu.component_name}
              onChange={handleInputChange}
            // error={!!errors.component_name}
            // helperText={errors.component_name}
            />}

            {type != '3' && <TextField
              size="small"
              label={t("page.menu.title.i18n")}
              name="i18n"
              value={menu.i18n}
              onChange={handleInputChange}
            />}

            {type != '1' && <TextField
              size="small"
              label={t("page.menu.title.permission")}
              name="permission"
              value={menu.permission}
              onChange={handleInputChange}
            // error={!!errors.permission}
            // helperText={errors.permission}
            />}
            <TextField
              required
              size="small"
              type="number"
              label={t("page.menu.title.sort")}
              name="sort"
              value={menu.sort}
              onChange={handleInputChange}
              error={!!errors.sort}
              helperText={errors.sort}
            />

          </FormControl>
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ mr: 4 }}>{t("page.menu.title.status")}</Typography>
            <Switch sx={{ mr: 2 }} name='status' checked={!menu.status} onChange={handleStatusChange} />
            <Typography>{menu.status == 0 ? t('page.menu.switch.status.true') : t('page.menu.switch.status.false')}</Typography>
          </Box>
          {type != '3' && <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
            <QuestionBadge title={t("page.menu.tip.visible")}>
              <Typography>{t("page.menu.title.visible")}</Typography>
            </QuestionBadge>
            <Switch name='visible' checked={menu.visible} onChange={handleSwitchChange} />
            <Typography>{menu.visible ? t('page.menu.switch.visible.true') : t('page.menu.switch.visible.false')}</Typography>
          </Stack>}
          {type != '3' && <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
            <QuestionBadge title={t("page.menu.tip.always.show")}>
              <Typography>{t("page.menu.title.always.show")}</Typography>
            </QuestionBadge>
            <Switch name='always_show' checked={menu.always_show} onChange={handleSwitchChange} />
            <Typography>{menu.always_show ? t('page.menu.switch.always.true') : t('page.menu.switch.always.false')}</Typography>
          </Stack>}
          {type == '2' && <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
            <QuestionBadge title={t("page.menu.tip.keep.alive")}>
              <Typography>{t("page.menu.title.keep.alive")}</Typography>
            </QuestionBadge>
            <Switch name='keep_alive' checked={menu.keep_alive} onChange={handleSwitchChange} />
            <Typography>{menu.keep_alive ? t('page.menu.switch.keep.true') : t('page.menu.switch.keep.false')}</Typography>
          </Stack>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>{t('global.operate.update')}</Button>
        <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
      </DialogActions>
    </Dialog >
  )
});

export default MenuEdit;