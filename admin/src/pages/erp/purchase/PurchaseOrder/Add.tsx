import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createErpPurchaseOrder, ErpPurchaseOrderRequest } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormValues {
  supplier_id: number; // 供应商ID
  purchase_date: string; // 采购日期
  total_amount: number; // 总金额
  order_status: number; // 订单状态 (0=pending, 1=completed, 2=cancelled)
  discount_rate: number; // 优惠率（百分比，1000表示10.00%）
  settlement_account_id: number; // 结算账户ID
  deposit: number; // 定金
  remarks: string; // 备注
}

interface FormErrors {
  purchase_date?: string; // 采购日期
  total_amount?: string; // 总金额
  order_status?: string; // 订单状态 (0=pending, 1=completed, 2=cancelled)
}

interface ErpPurchaseOrderAddProps {
  onSubmit: () => void;
}

const ErpPurchaseOrderAdd = forwardRef(({ onSubmit }: ErpPurchaseOrderAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [formValues, setFormValues] = useState<FormValues>({
    supplier_id: 0,
    purchase_date: '',
    total_amount: 0,
    order_status: 0,
    discount_rate: 0,
    settlement_account_id: 0,
    deposit: 0,
    remarks: '',
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

    if (!formValues.purchase_date.trim()) {
      newErrors.purchase_date = t('page.erp.purchase.order.error.purchase_date');
    }

    if (!formValues.total_amount && formValues.total_amount != 0) {
      newErrors.total_amount = t('page.erp.purchase.order.error.total_amount');
    }

    if (!formValues.order_status && formValues.order_status != 0) {
      newErrors.order_status = t('page.erp.purchase.order.error.order_status');
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
      supplier_id: 0,
      purchase_date: '',
      total_amount: 0,
      order_status: 0,
      discount_rate: 0,
      settlement_account_id: 0,
      deposit: 0,
      remarks: '',
    });
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await createErpPurchaseOrder(formValues as ErpPurchaseOrderRequest);
      handleClose();
      onSubmit();
    }
  };

  const handleSubmitAndContinue = async () => {
    if (validateForm()) {
      await createErpPurchaseOrder(formValues as ErpPurchaseOrderRequest);
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

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.add') + t('global.page.erp.purchase.order')}
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
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '200px' } }}>
          <TextField
            size="small"
            label={t("page.erp.purchase.order.placeholder.order.number")}
            disabled
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.purchase.order.title.supplier")}
            name='supplier_id'
            value={formValues.supplier_id}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.erp.purchase.order.title.purchase.date")}
            name='purchase_date'
            value={formValues.purchase_date}
            onChange={handleInputChange}
            error={!!errors.purchase_date}
            helperText={errors.purchase_date}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.erp.purchase.order.title.total.amount")}
            name='total_amount'
            value={formValues.total_amount}
            onChange={handleInputChange}
            error={!!errors.total_amount}
            helperText={errors.total_amount}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.erp.purchase.order.title.order.status")}
            name='order_status'
            value={formValues.order_status}
            onChange={handleInputChange}
            error={!!errors.order_status}
            helperText={errors.order_status}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.purchase.order.title.discount.rate")}
            name='discount_rate'
            value={formValues.discount_rate}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.purchase.order.title.settlement.account")}
            name='settlement_account_id'
            value={formValues.settlement_account_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.purchase.order.title.deposit")}
            name='deposit'
            value={formValues.deposit}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.erp.purchase.order.title.remarks")}
            name='remarks'
            value={formValues.remarks}
            onChange={handleInputChange}
          />
        </FormControl>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpPurchaseOrderAdd;