import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createErpProductCategory, ErpProductCategoryRequest, ErpProductCategoryResponse, listErpProductCategory } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import SelectTree from '@/components/SelectTree';

interface FormValues {
  code: string; // 分类编码
  name: string; // 分类名称
  parent_id: number; // 父分类ID
  status: number; // 状态
  sort: number; // 排序
  remarks: string; // 备注
}

interface FormErrors {
  name?: string; // 分类名称
  status?: string; // 状态
  sort?: string; // 排序
}

interface TreeNode {
  id: string | number;
  parent_id: number; // 父菜单ID
  label: string;
  children: TreeNode[];
}

interface ErpProductCategoryAddProps {
  onSubmit: () => void;
}

const ErpProductCategoryAdd = forwardRef(({ onSubmit }: ErpProductCategoryAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [treeData, setTreeData] = useState<TreeNode[]>([
    {
      id: 0,
      parent_id: -1,
      label: '根节点',
      children: [],
    }
  ]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | number>(0);
  const [formValues, setFormValues] = useState<FormValues>({
    code: '',
    name: '',
    parent_id: 0,
    status: 0,
    sort: 0,
    remarks: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show() {
      refreshCategorys(true);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const refreshCategorys = async (isInit: boolean) => {
    const result = await listErpProductCategory();

    // 添加根节点
    result.splice(0, 0, {
      id: 0,
      parent_id: -1,
      name: '根节点',
    } as ErpProductCategoryResponse);

    const root = findRoot(result);
    if (root && isInit) {
      setSelectedCategoryId(root.id);
      setFormValues(prev => ({
        ...prev,
        parent_id: root.id
      }))
    }
    const tree = buildTree(result, root?.parent_id);
    setTreeData(tree);
  }

  const findRoot = (list: ErpProductCategoryResponse[]): ErpProductCategoryResponse | undefined => {
    const ids = list.map(item => item.id);
    const parentIds = list.map(item => item.parent_id);
    const rootIds = parentIds.filter(id => ids.indexOf(id) < 0);
    if (rootIds.length > 0) {
      const rootId = rootIds[0];
      return list.filter(item => rootId === item.parent_id)[0];
    }
    return undefined;
  }

  const buildTree = (list: ErpProductCategoryResponse[], rootParentId: number | undefined): TreeNode[] => {
    const map: { [key: string]: TreeNode } = {};
    const tree: TreeNode[] = [];

    for (const item of list) {
      map[item.id] = {
        id: item.id,
        parent_id: item.parent_id,
        label: item.name,
        children: [],
      };
    }

    for (const item of list) {
      if (item.parent_id === rootParentId) {
        tree.push(map[item.id]);
      } else if (map[item.parent_id]) {
        map[item.parent_id].children.push(map[item.id]);
      }
    }

    return tree;
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formValues.name.trim()) {
      newErrors.name = t('page.erp.product.category.error.name');
    }

    if (!formValues.status && formValues.status != 0) {
      newErrors.status = t('page.erp.product.category.error.status');
    }

    if (!formValues.sort && formValues.sort != 0) {
      newErrors.sort = t('page.erp.product.category.error.sort');
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
      code: '',
      name: '',
      parent_id: 0,
      status: 0,
      sort: 0,
      remarks: '',
    });
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await createErpProductCategory(formValues as ErpProductCategoryRequest);
      handleClose();
      onSubmit();
    }
  };

  const handleSubmitAndContinue = async () => {
    if (validateForm()) {
      await createErpProductCategory(formValues as ErpProductCategoryRequest);
      onSubmit();
      refreshCategorys(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const { name } = e.target;

    setFormValues(prev => ({
      ...prev,
      [name]: checked ? 0 : 1
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleChange = (name: string, node: TreeNode) => {
    setSelectedCategoryId(node.id);
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
      title={t('global.operate.add') + t('global.page.erp.product.category')}
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
            label={t('page.erp.product.category.title.parent')}
            treeData={treeData}
            value={selectedCategoryId}
            onChange={(name, node) => handleChange(name, node as TreeNode)}
          />
        </FormControl>
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '200px' } }}>
          <TextField
            required
            size="small"
            label={t("page.erp.product.category.title.name")}
            name='name'
            value={formValues.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            size="small"
            label={t("page.erp.product.category.title.code")}
            name='code'
            value={formValues.code}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.erp.product.category.title.sort")}
            name='sort'
            value={formValues.sort}
            onChange={handleInputChange}
            error={!!errors.sort}
            helperText={errors.sort}
          />
          <TextField
            size="small"
            label={t("page.erp.product.category.title.remarks")}
            name='remarks'
            value={formValues.remarks}
            onChange={handleInputChange}
          />
        </FormControl>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 4 }}>{t("global.title.status")}</Typography>
          <Switch sx={{ mr: 2 }} name='status' checked={!formValues.status} onChange={handleStatusChange} />
          <Typography>{formValues.status == 0 ? t('global.switch.status.true') : t('global.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpProductCategoryAdd;