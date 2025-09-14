import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { MallTradeDeliveryPickUpStoreRequest, MallTradeDeliveryPickUpStoreResponse, updateMallTradeDeliveryPickUpStore } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import CustomizedFileUpload, { DownloadProps, UploadFile } from '@/components/CustomizedFileUpload';
import { downloadSystemFile, uploadSystemFile } from '@/api/system_file';
import dayjs, { Dayjs } from 'dayjs';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AreaCascader from '@/components/AreaCascader';

interface FormErrors {
  name?: string; // 门店名称
  phone?: string; // 门店手机
  area_id?: string; // 区域编号
  detail_address?: string; // 门店详细地址
  file_id?: string; // 门店 file_id
  opening_time?: string; // 营业开始时间
  closing_time?: string; // 营业结束时间
  latitude?: string; // 纬度
  longitude?: string; // 经度
  status?: string; // 门店状态
}

interface MallTradeDeliveryPickUpStoreEditProps {
  onSubmit: () => void;
}

const MallTradeDeliveryPickUpStoreEdit = forwardRef(({ onSubmit }: MallTradeDeliveryPickUpStoreEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [openingTime, setOpeningTime] = useState<Dayjs | null>(dayjs('2022-04-17T9:00'));
  const [closingTime, setClosingTime] = useState<Dayjs | null>(dayjs('2022-04-17T22:00'));
  const [mallTradeDeliveryPickUpStore, setMallTradeDeliveryPickUpStore] = useState<MallTradeDeliveryPickUpStoreRequest>({
    id: 0,
    name: '',
    introduction: '',
    phone: '',
    area_id: 0,
    detail_address: '',
    file_id: 0,
    opening_time: '',
    closing_time: '',
    latitude: 0,
    longitude: 0,
    verify_user_ids: '',
    status: 0,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [fileWidth] = useState<number>(240);
  const [fileHeight] = useState<number>(160);
  const [downloadImage, setDownloadImage] = useState<DownloadProps>();

  useImperativeHandle(ref, () => ({
    show(mallTradeDeliveryPickUpStore: MallTradeDeliveryPickUpStoreResponse) {
      initForm(mallTradeDeliveryPickUpStore);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!mallTradeDeliveryPickUpStore.name.trim()) {
      newErrors.name = t('global.error.input.please') + t('page.mall.trade.delivery.store.title.name');
    }

    if (!mallTradeDeliveryPickUpStore.phone.trim()) {
      newErrors.phone = t('global.error.input.please') + t('page.mall.trade.delivery.store.title.phone');
    }

    if (!mallTradeDeliveryPickUpStore.area_id && mallTradeDeliveryPickUpStore.area_id != 0) {
      newErrors.area_id = t('global.error.select.please') + t('page.mall.trade.delivery.store.title.area');
    }

    if (!mallTradeDeliveryPickUpStore.detail_address.trim()) {
      newErrors.detail_address = t('global.error.input.please') + t('page.mall.trade.delivery.store.title.detail.address');
    }

    if (!mallTradeDeliveryPickUpStore.file_id && mallTradeDeliveryPickUpStore.file_id != 0) {
      newErrors.file_id = t('global.error.select.please') + t('page.mall.trade.delivery.store.title.file');
    }

    if (!mallTradeDeliveryPickUpStore.opening_time.trim()) {
      newErrors.opening_time = t('global.error.select.please') + t('page.mall.trade.delivery.store.title.opening.time');
    }

    if (!mallTradeDeliveryPickUpStore.closing_time.trim()) {
      newErrors.closing_time = t('global.error.select.please') + t('page.mall.trade.delivery.store.title.closing.time');
    }

    if (!mallTradeDeliveryPickUpStore.latitude && mallTradeDeliveryPickUpStore.latitude != 0) {
      newErrors.latitude = t('global.error.input.please') + t('page.mall.trade.delivery.store.title.latitude');
    }

    if (!mallTradeDeliveryPickUpStore.longitude && mallTradeDeliveryPickUpStore.longitude != 0) {
      newErrors.longitude = t('global.error.input.please') + t('page.mall.trade.delivery.store.title.longitude');
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

  const initForm = async (mallTradeDeliveryPickUpStore: MallTradeDeliveryPickUpStoreResponse) => {
    setMallTradeDeliveryPickUpStore({
      ...mallTradeDeliveryPickUpStore,
    })
    // 设置图片
    const result = await downloadSystemFile(mallTradeDeliveryPickUpStore.file_id, (progress) => {
      setDownloadImage(() => {
        return {
          status: 'downloading',
          progress
        };
      })
    })

    setDownloadImage(() => {
      return {
        status: 'done',
        previewUrl: window.URL.createObjectURL(result),
      };
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateMallTradeDeliveryPickUpStore(mallTradeDeliveryPickUpStore);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setMallTradeDeliveryPickUpStore(prev => ({
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

    setMallTradeDeliveryPickUpStore(prev => ({
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
      setMallTradeDeliveryPickUpStore((prev) => {
        return { ...prev, file };
      })

      // 上传文件
      try {
        const result = await uploadSystemFile(file.file, (progress) => {
          setMallTradeDeliveryPickUpStore((prev) => {
            return { ...prev, file: { ...prev.file!, progress } };
          });
        });

        // 上传完成
        setMallTradeDeliveryPickUpStore((prev) => {
          return { ...prev, file_id: result, file: { ...prev.file!, status: 'done' as const } };
        });
      } catch (error) {
        console.error('upload file error', error);
        // 上传失败
        setMallTradeDeliveryPickUpStore((prev) => {
          return { ...prev, file: { ...prev.file!, status: 'error' as const } };
        });
      }
    } else if (action === 'remove') {
      // 删除文件并移除上传框
      setMallTradeDeliveryPickUpStore((prev) => {
        return { ...prev, file: undefined };
      });
    }
  }, []);

  const handleAreaChange = (name: string, value: string[]) => {
    setMallTradeDeliveryPickUpStore(prev => ({
      ...prev,
      [name]: Number(value[value.length - 1])
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleOpeningTimeChange = (value: PickerValue) => {
    setOpeningTime(value);
    if (!value) {
      return;
    }
    const name = 'opening_time';
    const time = value.format('HH:mm');
    setMallTradeDeliveryPickUpStore(prev => ({
      ...prev,
      [name]: time
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleClosingTimeChange = (value: PickerValue) => {
    setClosingTime(value);
    if (!value) {
      return;
    }
    const name = 'closing_time';
    const time = value.format('HH:mm');
    setMallTradeDeliveryPickUpStore(prev => ({
      ...prev,
      [name]: time
    }));

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
      title={t('global.operate.edit') + t('global.page.mall.trade.delivery.store')}
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
            label={t("page.mall.trade.delivery.store.title.name")}
            name='name'
            value={mallTradeDeliveryPickUpStore.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
        </FormControl>
        <Typography sx={{ mt: 2, mb: 1 }}>
          {t('page.mall.trade.delivery.store.title.file')}
        </Typography>
        <CustomizedFileUpload
          canRemove={false}
          showFilename={false}
          id={'file-upload'}
          accept=".jpg,jpeg,.png"
          maxSize={100}
          onChange={(file, action) => handleFileChange(file, action)}
          file={mallTradeDeliveryPickUpStore.file}
          download={downloadImage}
          width={fileWidth}
          height={fileHeight}
        >
        </CustomizedFileUpload>
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '240px' } }}>
          <TextField
            multiline
            minRows={2}
            size="small"
            label={t("page.mall.trade.delivery.store.title.introduction")}
            name='introduction'
            value={mallTradeDeliveryPickUpStore.introduction}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.mall.trade.delivery.store.title.phone")}
            name='phone'
            value={mallTradeDeliveryPickUpStore.phone}
            onChange={handleInputChange}
            error={!!errors.phone}
            helperText={errors.phone}
          />
          <AreaCascader
            name='area_id'
            value={mallTradeDeliveryPickUpStore.area_id}
            onChange={(name, value) => handleAreaChange(name, value)}
            error={!!errors.area_id}
            helperText={errors.area_id}
          />
          <TextField
            required
            size="small"
            label={t("page.mall.trade.delivery.store.title.detail.address")}
            name='detail_address'
            value={mallTradeDeliveryPickUpStore.detail_address}
            onChange={handleInputChange}
            error={!!errors.detail_address}
            helperText={errors.detail_address}
          />
        </FormControl>
        <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiPickersTextField-root': { mt: 2, width: '240px' } }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label={t("page.mall.trade.delivery.store.title.opening.time")}
              name='opening_time'
              value={openingTime}
              onChange={(value) => handleOpeningTimeChange(value)}
              slotProps={{
                textField: {
                  size: 'small',
                  required: true,
                  error: !!errors.opening_time,
                  helperText: errors.opening_time,
                },
                openPickerButton: {
                  sx: {
                    mr: -1,
                    '& .MuiSvgIcon-root': {
                      fontSize: '1rem',
                    }
                  }
                },
              }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label={t("page.mall.trade.delivery.store.title.closing.time")}
              name='closing_time'
              value={closingTime}
              onChange={(value) => handleClosingTimeChange(value)}
              slotProps={{
                textField: {
                  size: 'small',
                  required: true,
                  error: !!errors.closing_time,
                  helperText: errors.closing_time,
                },
                openPickerButton: {
                  sx: {
                    mr: -1,
                    '& .MuiSvgIcon-root': {
                      fontSize: '1rem',
                    }
                  }
                },
              }}
            />
          </LocalizationProvider>
        </FormControl>
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '240px' } }}>
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.trade.delivery.store.title.latitude")}
            name='latitude'
            value={mallTradeDeliveryPickUpStore.latitude}
            onChange={handleInputChange}
            error={!!errors.latitude}
            helperText={errors.latitude}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.trade.delivery.store.title.longitude")}
            name='longitude'
            value={mallTradeDeliveryPickUpStore.longitude}
            onChange={handleInputChange}
            error={!!errors.longitude}
            helperText={errors.longitude}
          />
        </FormControl>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 4 }}>{t("global.title.status")}</Typography>
          <Switch sx={{ mr: 2 }} name='status' checked={!mallTradeDeliveryPickUpStore.status} onChange={handleStatusChange} />
          <Typography>{mallTradeDeliveryPickUpStore.status == 0 ? t('global.switch.status.true') : t('global.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default MallTradeDeliveryPickUpStoreEdit;