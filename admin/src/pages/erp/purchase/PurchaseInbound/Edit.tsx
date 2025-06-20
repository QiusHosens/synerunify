import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpInboundOrderRequest, ErpInboundOrderResponse, updateErpInboundOrder } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors {
  order_number?: string; // 订单编号
  supplier_id?: string; // 供应商ID
  user_id?: string; // 用户ID
  inbound_date?: string; // 入库日期
  department_code?: string; // 部门编码
  department_id?: string; // 部门ID
}

interface ErpInboundOrderEditProps {
  onSubmit: () => void;
}

const ErpInboundOrderEdit = forwardRef(({ onSubmit }: ErpInboundOrderEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [erpInboundOrder, setErpInboundOrder] = useState<ErpInboundOrderRequest>({
    id: 0,
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
    show(erpInboundOrder: ErpInboundOrderResponse) {
      initForm(erpInboundOrder);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!erpInboundOrder.order_number && erpInboundOrder.order_number != 0) {
      newErrors.order_number = t('page.erp.purchase.inbound.error.order.number');
    }

    if (!erpInboundOrder.supplier_id && erpInboundOrder.supplier_id != 0) {
      newErrors.supplier_id = t('page.erp.purchase.inbound.error.supplier');
    }

    if (!erpInboundOrder.inbound_date.trim()) {
      newErrors.inbound_date = t('page.erp.purchase.inbound.error.inbound。date');
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

  const initForm = (erpInboundOrder: ErpInboundOrderResponse) => {
    setErpInboundOrder({
      ...erpInboundOrder,
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateErpInboundOrder(erpInboundOrder);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setErpInboundOrder(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setErpInboundOrder(prev => ({
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
      title={t('global.operate.edit') + t('global.page.erp.purchase.inbound')}
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
            type="number"
            label={t("page.erp.purchase.inbound.title.order.number")}
            name='order_number'
            value={erpInboundOrder.order_number}
            onChange={handleInputChange}
            error={!!errors.order_number}
            helperText={errors.order_number}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.purchase.inbound.title.purchase")}
            name='purchase_id'
            value={erpInboundOrder.purchase_id}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.erp.purchase.inbound.title.supplier")}
            name='supplier_id'
            value={erpInboundOrder.supplier_id}
            onChange={handleInputChange}
            error={!!errors.supplier_id}
            helperText={errors.supplier_id}
          />
          <TextField
            required
            size="small"
            label={t("page.erp.purchase.inbound.title.inbound.date")}
            name='inbound_date'
            value={erpInboundOrder.inbound_date}
            onChange={handleInputChange}
            error={!!errors.inbound_date}
            helperText={errors.inbound_date}
          />
          <TextField
            size="small"
            label={t("page.erp.purchase.inbound.title.remarks")}
            name='remarks'
            value={erpInboundOrder.remarks}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.purchase.inbound.title.discount.rate")}
            name='discount_rate'
            value={erpInboundOrder.discount_rate}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.purchase.inbound.title.other.cost")}
            name='other_cost'
            value={erpInboundOrder.other_cost}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.purchase.inbound.title.settlement.account")}
            name='settlement_account_id'
            value={erpInboundOrder.settlement_account_id}
            onChange={handleInputChange}
          />
        </FormControl>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpInboundOrderEdit;