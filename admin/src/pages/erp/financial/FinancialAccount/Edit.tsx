import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpSettlementAccountRequest, ErpSettlementAccountResponse, updateErpSettlementAccount } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors {
  name?: string; // 账户名称
  status?: string; // 状态
  sort?: string; // 排序
}

interface ErpSettlementAccountEditProps {
  onSubmit: () => void;
}

const ErpSettlementAccountEdit = forwardRef(({ onSubmit }: ErpSettlementAccountEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [erpSettlementAccount, setErpSettlementAccount] = useState<ErpSettlementAccountRequest>({
    id: 0,
    name: '',
    bank_name: '',
    bank_account: '',
    status: 0,
    sort: 0,
    remarks: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(erpSettlementAccount: ErpSettlementAccountResponse) {
      initForm(erpSettlementAccount);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!erpSettlementAccount.name.trim()) {
      newErrors.name = t('page.erp.financial.account.error.name');
    }

    if (!erpSettlementAccount.sort && erpSettlementAccount.sort != 0) {
      newErrors.sort = t('page.erp.financial.account.error.sort');
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

  const initForm = (erpSettlementAccount: ErpSettlementAccountResponse) => {
    setErpSettlementAccount({
      ...erpSettlementAccount,
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateErpSettlementAccount(erpSettlementAccount);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setErpSettlementAccount(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setErpSettlementAccount(prev => ({
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

    setErpSettlementAccount(prev => ({
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

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.edit') + t('global.page.erp.financial.account')}
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
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '200px' } }}>
          <TextField
            required
            size="small"
            label={t("page.erp.financial.account.title.name")}
            name='name'
            value={erpSettlementAccount.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            size="small"
            label={t("page.erp.financial.account.title.bank.name")}
            name='bank_name'
            value={erpSettlementAccount.bank_name}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.erp.financial.account.title.bank.account")}
            name='bank_account'
            value={erpSettlementAccount.bank_account}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.erp.financial.account.title.sort")}
            name='sort'
            value={erpSettlementAccount.sort}
            onChange={handleInputChange}
            error={!!errors.sort}
            helperText={errors.sort}
          />
          <TextField
            size="small"
            label={t("page.erp.financial.account.title.remarks")}
            name='remarks'
            value={erpSettlementAccount.remarks}
            onChange={handleInputChange}
          />
        </FormControl>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 4 }}>{t("global.title.status")}</Typography>
          <Switch sx={{ mr: 2 }} name='status' checked={!erpSettlementAccount.status} onChange={handleStatusChange} />
          <Typography>{erpSettlementAccount.status == 0 ? t('global.switch.status.true') : t('global.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpSettlementAccountEdit;