import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpProductCategoryRequest, ErpProductCategoryResponse, listErpProductCategory, updateErpProductCategory } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import SelectTree from '@/components/SelectTree';

interface FormErrors {
  name?: string; // 分类名称
  status?: string; // 状态
  sort?: string; // 排序
}

interface TreeNode {
  id: string | number;
  parent_id: number;
  label: string;
  children: TreeNode[];
}

interface ErpProductCategoryEditProps {
  onSubmit: () => void;
}

const ErpProductCategoryEdit = forwardRef(({ onSubmit }: ErpProductCategoryEditProps, ref) => {
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
  const [erpProductCategory, setErpProductCategory] = useState<ErpProductCategoryRequest>({
    id: 0,
    code: '',
    name: '',
    parent_id: 0,
    status: 0,
    sort: 0,
    remarks: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(erpProductCategory: ErpProductCategoryResponse) {
      initForm(erpProductCategory);
      initCategorys(erpProductCategory);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const initCategorys = async (erpProductCategory: ErpProductCategoryResponse) => {
    const result = await listErpProductCategory();

    setSelectedCategoryId(erpProductCategory.parent_id);

    // 添加根节点
    result.splice(0, 0, {
      id: 0,
      parent_id: -1,
      name: '根节点',
    } as ErpProductCategoryResponse);

    const root = findRoot(result);
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

    if (!erpProductCategory.name.trim()) {
      newErrors.name = t('page.erp.product.category.error.name');
    }

    if (!erpProductCategory.sort && erpProductCategory.sort != 0) {
      newErrors.sort = t('page.erp.product.category.error.sort');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const initForm = (erpProductCategory: ErpProductCategoryResponse) => {
    setErpProductCategory({
      ...erpProductCategory,
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateErpProductCategory(erpProductCategory);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setErpProductCategory(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setErpProductCategory(prev => ({
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

    setErpProductCategory(prev => ({
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
    setErpProductCategory(prev => ({
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
      title={t('global.operate.edit') + t('global.page.erp.product.category')}
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
            value={erpProductCategory.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            size="small"
            label={t("page.erp.product.category.title.code")}
            name='code'
            value={erpProductCategory.code}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.product.category.title.status")}
            name='status'
            value={erpProductCategory.status}
            onChange={handleInputChange}
            error={!!errors.status}
            helperText={errors.status}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.erp.product.category.title.sort")}
            name='sort'
            value={erpProductCategory.sort}
            onChange={handleInputChange}
            error={!!errors.sort}
            helperText={errors.sort}
          />
          <TextField
            size="small"
            label={t("page.erp.product.category.title.remarks")}
            name='remarks'
            value={erpProductCategory.remarks}
            onChange={handleInputChange}
          />
        </FormControl>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 4 }}>{t("global.title.status")}</Typography>
          <Switch sx={{ mr: 2 }} name='status' checked={!erpProductCategory.status} onChange={handleStatusChange} />
          <Typography>{erpProductCategory.status == 0 ? t('global.switch.status.true') : t('global.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpProductCategoryEdit;