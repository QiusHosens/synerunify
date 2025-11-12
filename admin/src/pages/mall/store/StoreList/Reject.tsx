import { Box, Button, FormControl, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { MallStoreRejectRequest, MallStoreResponse, rejectMallStore } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import CustomizedTag from '@/components/CustomizedTag';

interface FormErrors {
  audit_remark?: string; // 审核备注
}

interface MallStoreRejectProps {
  onSubmit: () => void;
}

const MallStoreReject = forwardRef(({ onSubmit }: MallStoreRejectProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [mallStore, setMallStore] = useState<MallStoreResponse>();
  const [mallStoreRequest, setMallStoreRequest] = useState<MallStoreRejectRequest>({
    id: 0,
    audit_remark: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(mallStore: MallStoreResponse) {
      setMallStore(mallStore);
      setMallStoreRequest({
        id: mallStore.id,
        audit_remark: '',
      });
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!mallStoreRequest.audit_remark.trim()) {
      newErrors.audit_remark = t('global.error.input.please') + t('page.mall.store.title.audit.remark');
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

  const handleSubmit = async () => {
    if (validateForm()) {
      await rejectMallStore(mallStoreRequest);
    }
    handleClose();
    onSubmit();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setMallStoreRequest(prev => ({
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

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.review') + t('global.page.mall.store')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('page.mall.store.operate.reject')}</Button>
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
        <FormControl sx={{ minWidth: 120, '& .MuiStack-root': { mt: 2 } }}>
          <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
            <Box>{t('page.mall.store.title.name')}</Box>
            <Box>{mallStore && <CustomizedTag label={mallStore.name} />}</Box>
          </Stack>
        </FormControl>
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '240px' } }}>
          <TextField
            required
            size="small"
            label={t("page.mall.store.title.audit.remark")}
            name='audit_remark'
            value={mallStoreRequest.audit_remark}
            onChange={handleInputChange}
            error={!!errors.audit_remark}
            helperText={errors.audit_remark}
          />
        </FormControl>
      </Box>
    </CustomizedDialog>
  )
});

export default MallStoreReject;