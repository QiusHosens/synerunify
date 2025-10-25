import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { MallTradeDeliveryExpressRequest, MallTradeDeliveryExpressResponse, updateMallTradeDeliveryExpress } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import CustomizedFileUpload, { DownloadProps, UploadFile } from '@/components/CustomizedFileUpload';
import { downloadSystemFile, uploadSystemFile } from '@/api/system_file';

interface FormErrors {
  code?: string; // 快递公司编码
  name?: string; // 快递公司名称
  sort?: string; // 排序
  status?: string; // 状态
}

interface MallTradeDeliveryExpressEditProps {
  onSubmit: () => void;
}

const MallTradeDeliveryExpressEdit = forwardRef(({ onSubmit }: MallTradeDeliveryExpressEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [mallTradeDeliveryExpress, setMallTradeDeliveryExpress] = useState<MallTradeDeliveryExpressRequest>({
    id: 0,
    code: '',
    name: '',
    sort: 0,
    status: 0,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [fileWidth] = useState<number>(240);
  const [fileHeight] = useState<number>(160);
  const [downloadImage, setDownloadImage] = useState<DownloadProps>();

  useImperativeHandle(ref, () => ({
    show(mallTradeDeliveryExpress: MallTradeDeliveryExpressResponse) {
      initForm(mallTradeDeliveryExpress);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!mallTradeDeliveryExpress.code.trim()) {
      newErrors.code = t('global.error.input.please') + t('common.title.code');
    }

    if (!mallTradeDeliveryExpress.name.trim()) {
      newErrors.name = t('global.error.input.please') + t('common.title.name');
    }

    if (!mallTradeDeliveryExpress.sort && mallTradeDeliveryExpress.sort != 0) {
      newErrors.sort = t('global.error.input.please') + t('common.title.sort');
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

  const initForm = async (mallTradeDeliveryExpress: MallTradeDeliveryExpressResponse) => {
    setMallTradeDeliveryExpress({
      ...mallTradeDeliveryExpress,
    })
    // 设置图片
    downloadSystemFile(mallTradeDeliveryExpress.file_id, (progress) => {
      setDownloadImage(() => {
        return {
          status: 'downloading',
          progress
        };
      })
    }).catch(() => {
      setDownloadImage(() => {
        return {
          status: 'error',
        };
      })
    }).then((blob) => {
      if (blob) {
        setDownloadImage(() => {
          return {
            status: 'done',
            previewUrl: window.URL.createObjectURL(blob),
          };
        })
      }
    });
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateMallTradeDeliveryExpress(mallTradeDeliveryExpress);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setMallTradeDeliveryExpress(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const { name } = e.target;

    setMallTradeDeliveryExpress(prev => ({
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
      setMallTradeDeliveryExpress((prev) => {
        return { ...prev, file };
      })

      // 上传文件
      try {
        const result = await uploadSystemFile(file.file, (progress) => {
          setMallTradeDeliveryExpress((prev) => {
            return { ...prev, file: { ...prev.file!, progress } };
          });
        });

        // 上传完成
        setMallTradeDeliveryExpress((prev) => {
          return { ...prev, file_id: result, file: { ...prev.file!, status: 'done' as const } };
        });
      } catch (error) {
        console.error('upload file error', error);
        // 上传失败
        setMallTradeDeliveryExpress((prev) => {
          return { ...prev, file: { ...prev.file!, status: 'error' as const } };
        });
      }
    } else if (action === 'remove') {
      // 删除文件并移除上传框
      setMallTradeDeliveryExpress((prev) => {
        return { ...prev, file: undefined };
      });
    }
  }, []);

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.edit') + t('global.page.mall.trade.delivery.express')}
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
            label={t("page.mall.trade.delivery.express.title.code")}
            name='code'
            value={mallTradeDeliveryExpress.code}
            onChange={handleInputChange}
            error={!!errors.code}
            helperText={errors.code}
          />
          <TextField
            required
            size="small"
            label={t("page.mall.trade.delivery.express.title.name")}
            name='name'
            value={mallTradeDeliveryExpress.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
        </FormControl>
        <Typography sx={{ mt: 2, mb: 1 }}>
          {t('page.mall.trade.delivery.express.title.file')}
        </Typography>
        <CustomizedFileUpload
          canRemove={false}
          showFilename={false}
          id={'file-upload'}
          accept=".jpg,jpeg,.png"
          maxSize={100}
          onChange={(file, action) => handleFileChange(file, action)}
          file={mallTradeDeliveryExpress.file}
          download={downloadImage}
          width={fileWidth}
          height={fileHeight}
        ></CustomizedFileUpload>
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '240px' } }}>
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.trade.delivery.express.title.sort")}
            name='sort'
            value={mallTradeDeliveryExpress.sort}
            onChange={handleInputChange}
            error={!!errors.sort}
            helperText={errors.sort}
          />
        </FormControl>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 4 }}>{t("global.title.status")}</Typography>
          <Switch sx={{ mr: 2 }} name='status' checked={!mallTradeDeliveryExpress.status} onChange={handleStatusChange} />
          <Typography>{mallTradeDeliveryExpress.status == 0 ? t('global.switch.status.true') : t('global.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default MallTradeDeliveryExpressEdit;