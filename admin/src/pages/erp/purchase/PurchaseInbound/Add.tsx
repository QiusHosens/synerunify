import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createErpInboundOrder, ErpInboundOrderRequest } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormValues {
  order_number: number; // 订单编号
  purchase_id: number; // 采购订单ID
  supplier_id: number; // 供应商ID
  user_id: number; // 用户ID
  inbound_date: string; // 入库日期
  remarks: string; // 备注
  discount_rate: number; // 优惠率（百分比，1000表示10.00%）
  other_cost: number; // 其他费用
  settlement_account_id: number; // 结算账户ID
  department_code: string; // 部门编码
  department_id: number; // 部门ID
}

interface FormErrors {
  order_number?: string; // 订单编号
  supplier_id?: string; // 供应商ID
  user_id?: string; // 用户ID
  inbound_date?: string; // 入库日期
  department_code?: string; // 部门编码
  department_id?: string; // 部门ID
}

interface ErpInboundOrderAddProps {
  onSubmit: () => void;
}

const ErpInboundOrderAdd = forwardRef(({ onSubmit }: ErpInboundOrderAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [formValues, setFormValues] = useState<FormValues>({
    order_number: 0,
    purchase_id: 0,
    supplier_id: 0,
    user_id: 0,
    inbound_date: '',
    remarks: '',
    discount_rate: 0,
    other_cost: 0,
    settlement_account_id: 0,
    department_code: '',
    department_id: 0,
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

    if (!formValues.supplier_id && formValues.supplier_id != 0) {
      newErrors.supplier_id = t('page.erp.purchase.inbound.error.supplier');
    }

    if (!formValues.user_id && formValues.user_id != 0) {
      newErrors.user_id = t('page.erp.purchase.inbound.error.user');
    }

    if (!formValues.inbound_date.trim()) {
      newErrors.inbound_date = t('page.erp.purchase.inbound.error.inbound.date');
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
      order_number: 0,
      purchase_id: 0,
      supplier_id: 0,
      user_id: 0,
      inbound_date: '',
      remarks: '',
      discount_rate: 0,
      other_cost: 0,
      settlement_account_id: 0,
      department_code: '',
      department_id: 0,
    });
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await createErpInboundOrder(formValues as ErpInboundOrderRequest);
      handleClose();
      onSubmit();
    }
  };

  const handleSubmitAndContinue = async () => {
    if (validateForm()) {
      await createErpInboundOrder(formValues as ErpInboundOrderRequest);
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

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.add') + t('global.page.erp.purchase.inbound')}
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
            required
            size="small"
            type="number"
            label={t("page.erp.purchase.inbound.title.order.number")}
            name='order_number'
            value={formValues.order_number}
            onChange={handleInputChange}
            error={!!errors.order_number}
            helperText={errors.order_number}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.purchase.inbound.title.purchase")}
            name='purchase_id'
            value={formValues.purchase_id}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.erp.purchase.inbound.title.supplier")}
            name='supplier_id'
            value={formValues.supplier_id}
            onChange={handleInputChange}
            error={!!errors.supplier_id}
            helperText={errors.supplier_id}
          />
          <TextField
            required
            size="small"
            label={t("page.erp.purchase.inbound.title.inbound.date")}
            name='inbound_date'
            value={formValues.inbound_date}
            onChange={handleInputChange}
            error={!!errors.inbound_date}
            helperText={errors.inbound_date}
          />
          <TextField
            size="small"
            label={t("page.erp.purchase.inbound.title.remarks")}
            name='remarks'
            value={formValues.remarks}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.purchase.inbound.title.discount.rate")}
            name='discount_rate'
            value={formValues.discount_rate}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.purchase.inbound.title.other.cost")}
            name='other_cost'
            value={formValues.other_cost}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.purchase.inbound.title.settlement.account")}
            name='settlement_account_id'
            value={formValues.settlement_account_id}
            onChange={handleInputChange}
          />
        </FormControl>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpInboundOrderAdd;