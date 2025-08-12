import { Box, Button, FormControl, Grid, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createMallProductCategory, listMallProductCategory, MallProductCategoryRequest, MallProductCategoryResponse } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import SelectTree from '@/components/SelectTree';
import CustomizedFileUpload, { UploadFile } from '@/components/CustomizedFileUpload';
import { uploadSystemFile } from '@/api/system_file';

interface FormValues {
  parent_id: number; // 父分类编号
  name: string; // 分类名称
  file_id?: number; // 分类图片
  sort: number; // 分类排序
  status: number; // 状态

  file?: UploadFile | null;
}

interface FormErrors {
  parent_id?: string; // 父分类编号
  name?: string; // 分类名称
  file_id?: string; // 分类图片
}

interface TreeNode {
  id: string | number;
  parent_id: number;
  label: string;
  children: TreeNode[];
}

interface MallProductCategoryAddProps {
  onSubmit: () => void;
}

const MallProductCategoryAdd = forwardRef(({ onSubmit }: MallProductCategoryAddProps, ref) => {
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
    parent_id: 0,
    name: '',
    sort: 0,
    status: 0,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [fileWidth] = useState<number>(240);
  const [fileHeight] = useState<number>(160);

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
    const result = await listMallProductCategory();

    // 添加根节点
    result.splice(0, 0, {
      id: 0,
      parent_id: -1,
      name: '根节点',
    } as MallProductCategoryResponse);

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

  const findRoot = (list: MallProductCategoryResponse[]): MallProductCategoryResponse | undefined => {
    const ids = list.map(item => item.id);
    const parentIds = list.map(item => item.parent_id);
    const rootIds = parentIds.filter(id => ids.indexOf(id) < 0);
    if (rootIds.length > 0) {
      const rootId = rootIds[0];
      return list.filter(item => rootId === item.parent_id)[0];
    }
    return undefined;
  }

  const buildTree = (list: MallProductCategoryResponse[], rootParentId: number | undefined): TreeNode[] => {
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
      newErrors.name = t('global.error.input.please') + t('common.title.name');
    }

    if (!formValues.file_id && formValues.file_id != 0) {
      newErrors.file_id = t('global.error.select.please') + t('page.mall.product.category.title.file');
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
      parent_id: 0,
      name: '',
      sort: 0,
      status: 0,
    });
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await createMallProductCategory(formValues as MallProductCategoryRequest);
      handleClose();
      onSubmit();
    }
  };

  const handleSubmitAndContinue = async () => {
    if (validateForm()) {
      await createMallProductCategory(formValues as MallProductCategoryRequest);
      onSubmit();
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

  const handleFileChange = useCallback(async (file: UploadFile | null, action: 'upload' | 'remove') => {
    if (action === 'upload' && file) {
      // 更新文件列表,增加一个附件,等待上传完成后在写入信息
      setFormValues((prev) => {
        return { ...prev, file };
      })

      // 上传文件
      try {
        const result = await uploadSystemFile(file.file, (progress) => {
          setFormValues((prev) => {
            return { ...prev, file: { ...prev.file!, progress } };
          });
        });

        // 上传完成
        setFormValues((prev) => {
          return { ...prev, file_id: result, file: { ...prev.file!, status: 'done' as const } };
        });
      } catch (error) {
        console.error('upload file error', error);
        // 上传失败
        setFormValues((prev) => {
          return { ...prev, file: { ...prev.file!, status: 'error' as const } };
        });
      }
    } else if (action === 'remove') {
      // 删除文件并移除上传框
      setFormValues((prev) => {
        return { ...prev, file: undefined };
      });
    }
  }, []);

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.add') + t('global.page.mall.product.category')}
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
        <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiSelect-root': { width: '240px' } }}>
          <SelectTree
            expandToSelected
            name='parent_id'
            size="small"
            label={t('common.title.parent')}
            treeData={treeData}
            value={selectedCategoryId}
            onChange={(name, node) => handleChange(name, node as TreeNode)}
          />
        </FormControl>
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '240px' } }}>
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
        </FormControl>
        <Typography sx={{ mt: 2, mb: 1 }}>
          {t('page.mall.product.category.title.file')}
        </Typography>
        <Grid size={{ xs: 12, md: 4 }}>
          <CustomizedFileUpload
            id={'file-upload'}
            accept=".jpg,jpeg,.png"
            maxSize={100}
            onChange={(file, action) => handleFileChange(file, action)}
            file={formValues.file}
            width={fileWidth}
            height={fileHeight}
          >
          </CustomizedFileUpload>
        </Grid>
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '240px' } }}>
          <TextField
            size="small"
            type="number"
            label={t("common.title.sort")}
            name='sort'
            value={formValues.sort}
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

export default MallProductCategoryAdd;