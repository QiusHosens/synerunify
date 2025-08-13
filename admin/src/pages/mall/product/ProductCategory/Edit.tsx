import { Box, Button, FormControl, Grid, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { listMallProductCategory, MallProductCategoryRequest, MallProductCategoryResponse, updateMallProductCategory } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import SelectTree from '@/components/SelectTree';
import CustomizedFileUpload, { DownloadProps, UploadFile } from '@/components/CustomizedFileUpload';
import { downloadSystemFile, uploadSystemFile } from '@/api/system_file';

interface FormErrors {
  parent_id?: string; // 父分类编号
  name?: string; // 分类名称
  file_id?: string; // 移动端分类图
  status?: string; // 状态
}

interface TreeNode {
  id: string | number;
  parent_id: number;
  label: string;
  children: TreeNode[];
}

interface MallProductCategoryEditProps {
  onSubmit: () => void;
}

const MallProductCategoryEdit = forwardRef(({ onSubmit }: MallProductCategoryEditProps, ref) => {
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
  const [mallProductCategory, setMallProductCategory] = useState<MallProductCategoryRequest>({
    id: 0,
    parent_id: 0,
    name: '',
    file_id: 0,
    sort: 0,
    status: 0,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [fileWidth] = useState<number>(240);
  const [fileHeight] = useState<number>(160);
  const [downloadImage, setDownloadImage] = useState<DownloadProps>();

  useImperativeHandle(ref, () => ({
    show(mallProductCategory: MallProductCategoryResponse) {
      initCategorys(mallProductCategory);
      initForm(mallProductCategory);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const initCategorys = async (mallProductCategory: MallProductCategoryResponse) => {
    const result = await listMallProductCategory();

    setSelectedCategoryId(mallProductCategory.parent_id);

    // 添加根节点
    result.splice(0, 0, {
      id: 0,
      parent_id: -1,
      name: '根节点',
    } as MallProductCategoryResponse);

    const root = findRoot(result);
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

    if (!mallProductCategory.name.trim()) {
      newErrors.name = t('common.error.name');
    }

    if (!mallProductCategory.file_id && mallProductCategory.file_id != 0) {
      newErrors.file_id = t('global.error.select.please') + t('page.mall.product.category.title.file');
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

  const initForm = async (mallProductCategory: MallProductCategoryResponse) => {
    setMallProductCategory({
      ...mallProductCategory,
    })
    // 设置图片
    const result = await downloadSystemFile(mallProductCategory.file_id, (progress) => {
      setDownloadImage(prev => {
        return {
          status: 'downloading',
          progress
        };
      })
    })

    setDownloadImage(prev => {
      return {
        status: 'done',
        previewUrl: window.URL.createObjectURL(result),
      };
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateMallProductCategory(mallProductCategory);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setMallProductCategory(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setMallProductCategory(prev => ({
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

    setMallProductCategory(prev => ({
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
    setMallProductCategory(prev => ({
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
      setMallProductCategory((prev) => {
        return { ...prev, file };
      })
      setDownloadImage(prev => {
        return {
          status: 'downloading',
          previewUrl: file.previewUrl,
        };
      })

      // 上传文件
      try {
        const result = await uploadSystemFile(file.file, (progress) => {
          setMallProductCategory((prev) => {
            return { ...prev, file: { ...prev.file!, progress } };
          });
          setDownloadImage(prev => {
            return {
              ...prev,
              status: 'downloading',
              progress
            };
          })
        });

        // 上传完成
        setMallProductCategory((prev) => {
          return { ...prev, file_id: result, file: { ...prev.file!, status: 'done' as const } };
        });
        setDownloadImage(prev => {
          return {
            ...prev,
            status: 'done',
          };
        })
      } catch (error) {
        console.error('upload file error', error);
        // 上传失败
        setMallProductCategory((prev) => {
          return { ...prev, file: { ...prev.file!, status: 'error' as const } };
        });
      }
    } else if (action === 'remove') {
      // 删除文件并移除上传框
      setMallProductCategory((prev) => {
        return { ...prev, file: undefined };
      });
    }
  }, []);

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.edit') + t('global.page.mall.product.category')}
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
            value={mallProductCategory.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
        </FormControl>
        <Typography sx={{ mt: 2, mb: 1 }}>
          {t('page.mall.product.category.title.file')}
        </Typography>
        <CustomizedFileUpload
          canRemove={false}
          showFilename={false}
          id={'file-upload'}
          accept=".jpg,jpeg,.png"
          maxSize={100}
          onChange={(file, action) => handleFileChange(file, action)}
          file={mallProductCategory.file}
          width={fileWidth}
          height={fileHeight}
          download={downloadImage}
        >
        </CustomizedFileUpload>
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '240px' } }}>
          <TextField
            size="small"
            type="number"
            label={t("common.title.sort")}
            name='sort'
            value={mallProductCategory.sort}
            onChange={handleInputChange}
          />
        </FormControl>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 4 }}>{t("global.title.status")}</Typography>
          <Switch sx={{ mr: 2 }} name='status' checked={!mallProductCategory.status} onChange={handleStatusChange} />
          <Typography>{mallProductCategory.status == 0 ? t('global.switch.status.true') : t('global.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default MallProductCategoryEdit;