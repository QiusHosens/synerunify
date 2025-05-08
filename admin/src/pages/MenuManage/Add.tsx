import { Badge, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Select, Stack, Switch, TextField, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, ReactNode, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { SelectChangeEvent } from '@mui/material/Select';
import DictSelect from '@/components/DictSelect';
import { createMenu, SystemMenuRequest } from '@/api';
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
  id: string;
  label: string;
  children?: TreeNode[];
}

const sampleTreeData: TreeNode[] = [
  {
    id: '1',
    label: 'Root 1',
    children: [
      { id: '1-1', label: 'Child 1-1' },
      { id: '1-2', label: 'Child 1-2' },
    ],
  },
  {
    id: '2',
    label: 'Root 2',
    children: [
      { id: '2-1', label: 'Child 2-1' },
      { id: '2-2', label: 'Child 2-2' },
    ],
  },
];

interface MenuAddProps {
  onSubmit: () => void;
}

const MenuAdd = forwardRef(({ onSubmit }: MenuAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [type, setType] = useState<number>(1);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('sm');
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
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formValues.name.trim()) {
      newErrors.name = t('page.menu.error.name');
    }

    if (!formValues.permission.trim()) {
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

    if (!formValues.path.trim()) {
      newErrors.path = t('page.menu.error.path');
    }

    if (!formValues.icon.trim()) {
      newErrors.icon = t('page.menu.error.icon');
    }

    if (!formValues.component.trim()) {
      newErrors.component = t('page.menu.error.component');
    }

    if (!formValues.component_name.trim()) {
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
      // await createMenu(formValues as SystemMenuRequest);
      // reset();
      // onSubmit();
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

  const handleTypeChange = (event: SelectChangeEvent<number>, child: ReactNode) => {
    setType(event.target.value as number);
  }

  const [selectedValue, setSelectedValue] = useState<string>('');

  const handleChange = (value: string) => {
    setSelectedValue(value);
    console.log('Selected:', value);
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
              size="small"
              label="Select Category"
              treeData={sampleTreeData}
              value={selectedValue}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '200px' } }}>
            <TextField size="small" label={t("page.menu.title.name")} />
            <TextField size="small" label={t("page.menu.title.permission")} />
            <TextField size="small" type="number" label={t("page.menu.title.sort")} />
            <TextField size="small" label={t("page.menu.title.path")} />
            <TextField size="small" label={t("page.menu.title.icon")} />
            <TextField size="small" label={t("page.menu.title.component")} />
            <TextField size="small" label={t("page.menu.title.component.name")} />
          </FormControl>
          <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
            <QuestionBadge title="这是一个提示信息">
              <Typography>{t("page.menu.title.status")}</Typography>
            </QuestionBadge>
            <Switch value={!!formValues.status} onChange={handleInputChange} />
            <Typography>On</Typography>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
            <QuestionBadge title={t("page.menu.tip.visible")}>
              <Typography>{t("page.menu.title.visible")}</Typography>
            </QuestionBadge>
            <Switch value={formValues.visible} onChange={handleInputChange} />
            <Typography>On</Typography>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
            <QuestionBadge title={t("page.menu.tip.always.show")}>
              <Typography>{t("page.menu.title.always.show")}</Typography>
            </QuestionBadge>
            <Switch value={formValues.always_show} onChange={handleInputChange} />
            <Typography>On</Typography>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
            <QuestionBadge title="这是一个提示信息">
              <Typography>{t("page.menu.title.keep.alive")}</Typography>
            </QuestionBadge>
            <Switch value={formValues.keep_alive} onChange={handleInputChange} />
            <Typography>On</Typography>
          </Stack>
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