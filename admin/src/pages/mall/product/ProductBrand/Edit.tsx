import { Box, Button, FormControl, Grid, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { MallProductBrandRequest, MallProductBrandResponse, updateMallProductBrand } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import CustomizedFileUpload, { DownloadProps, UploadFile } from '@/components/CustomizedFileUpload';
import { downloadSystemFile, uploadSystemFile } from '@/api/system_file';

interface FormErrors {
  name?: string; // 品牌名称
  file_id?: string; // 品牌图片
  status?: string; // 状态
}

interface TreeNode {
  id: string | number;
  parent_id: number;
  label: string;
  children: TreeNode[];
}

interface MallProductBrandEditProps {
  onSubmit: () => void;
}

const MallProductBrandEdit = forwardRef(({ onSubmit }: MallProductBrandEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [mallProductBrand, setMallProductBrand] = useState<MallProductBrandRequest>({
    id: 0,
    name: '',
    file_id: 0,
    sort: 0,
    description: '',
    status: 0,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [fileWidth] = useState<number>(240);
  const [fileHeight] = useState<number>(160);
  const [downloadImage, setDownloadImage] = useState<DownloadProps>();

  useImperativeHandle(ref, () => ({
    show(mallProductBrand: MallProductBrandResponse) {
      initForm(mallProductBrand);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!mallProductBrand.name.trim()) {
      newErrors.name = t('global.error.input.please') + t('common.title.name');
    }

    if (!mallProductBrand.file_id && mallProductBrand.file_id != 0) {
      newErrors.file_id = t('global.error.select.please') + t('page.mall.product.brand.title.file');
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

  const initForm = async (mallProductBrand: MallProductBrandResponse) => {
    setMallProductBrand({
      ...mallProductBrand,
    })
    // 设置图片
    const result = await downloadSystemFile(mallProductBrand.file_id, (progress) => {
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
      await updateMallProductBrand(mallProductBrand);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setMallProductBrand(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setMallProductBrand(prev => ({
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

    setMallProductBrand(prev => ({
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

  const handleFileChange = useCallback(async (file: UploadFile | null, action: 'upload' | 'remove') => {
    if (action === 'upload' && file) {
      // 更新文件列表,增加一个附件,等待上传完成后在写入信息
      setMallProductBrand((prev) => {
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
          setMallProductBrand((prev) => {
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
        setMallProductBrand((prev) => {
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
        setMallProductBrand((prev) => {
          return { ...prev, file: { ...prev.file!, status: 'error' as const } };
        });
      }
    } else if (action === 'remove') {
      // 删除文件并移除上传框
      setMallProductBrand((prev) => {
        return { ...prev, file: undefined };
      });
    }
  }, []);

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.edit') + t('global.page.mall.product.brand')}
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
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '240px' } }}>
          <TextField
            required
            size="small"
            label={t("common.title.name")}
            name='name'
            value={mallProductBrand.name}
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
            canRemove={false}
            showFilename={false}
            id={'file-upload'}
            accept=".jpg,jpeg,.png"
            maxSize={100}
            onChange={(file, action) => handleFileChange(file, action)}
            file={mallProductBrand.file}
            width={fileWidth}
            height={fileHeight}
            download={downloadImage}
          >
          </CustomizedFileUpload>
        </Grid>
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '240px' } }}>
          <TextField
            size="small"
            type="number"
            label={t("common.title.sort")}
            name='sort'
            value={mallProductBrand.sort}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("common.title.description")}
            name='description'
            value={mallProductBrand.description}
            onChange={handleInputChange}
          />
        </FormControl>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 4 }}>{t("global.title.status")}</Typography>
          <Switch sx={{ mr: 2 }} name='status' checked={!mallProductBrand.status} onChange={handleStatusChange} />
          <Typography>{mallProductBrand.status == 0 ? t('global.switch.status.true') : t('global.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default MallProductBrandEdit;