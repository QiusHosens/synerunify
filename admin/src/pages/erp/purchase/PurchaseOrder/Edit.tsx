import { Box, Button, FormControl, Stack, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { ErpPurchaseOrderRequest, ErpPurchaseOrderResponse, updateErpPurchaseOrder } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import CustomizedTag from '@/components/CustomizedTag';

interface FormErrors {
  purchase_date?: string; // 采购日期
  total_amount?: string; // 总金额
  order_status?: string; // 订单状态 (0=pending, 1=completed, 2=cancelled)
}

interface ErpPurchaseOrderEditProps {
  onSubmit: () => void;
}

const ErpPurchaseOrderEdit = forwardRef(({ onSubmit }: ErpPurchaseOrderEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [erpPurchaseOrderRequest, setErpPurchaseOrderRequest] = useState<ErpPurchaseOrderRequest>({
    id: 0,
    supplier_id: 0,
    purchase_date: '',
    total_amount: 0,
    order_status: 0,
    discount_rate: 0,
    settlement_account_id: 0,
    deposit: 0,
    remarks: '',
  });
  const [erpPurchaseOrder, setErpPurchaseOrder] = useState<ErpPurchaseOrderResponse>();
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(erpPurchaseOrderRequest: ErpPurchaseOrderResponse) {
      initForm(erpPurchaseOrderRequest);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!erpPurchaseOrderRequest.purchase_date.trim()) {
      newErrors.purchase_date = t('page.erp.purchase.order.error.purchase_date');
    }

    if (!erpPurchaseOrderRequest.total_amount && erpPurchaseOrderRequest.total_amount != 0) {
      newErrors.total_amount = t('page.erp.purchase.order.error.total_amount');
    }

    if (!erpPurchaseOrderRequest.order_status && erpPurchaseOrderRequest.order_status != 0) {
      newErrors.order_status = t('page.erp.purchase.order.error.order_status');
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

  const initForm = (erpPurchaseOrder: ErpPurchaseOrderResponse) => {
    setErpPurchaseOrderRequest({
      ...erpPurchaseOrder,
    })
    setErpPurchaseOrder(erpPurchaseOrder)
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateErpPurchaseOrder(erpPurchaseOrderRequest);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setErpPurchaseOrderRequest(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setErpPurchaseOrderRequest(prev => ({
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

    setErpPurchaseOrderRequest(prev => ({
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
      title={t('global.operate.edit') + t('global.page.erp.purchase.order')}
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
        <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiStack-root': { mt: 2, width: '200px' } }}>
          <Stack direction="row" spacing={2}>
            <Box>{t('page.erp.purchase.order.title.order_number')}</Box>
            <Box>{erpPurchaseOrder && <CustomizedTag label={erpPurchaseOrder.order_number} />}</Box>
          </Stack>
        </FormControl>
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '200px' } }}>
          <TextField
            size="small"
            type="number"
            label={t("page.erp.purchase.order.title.supplier_id")}
            name='supplier_id'
            value={erpPurchaseOrderRequest.supplier_id}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.erp.purchase.order.title.purchase_date")}
            name='purchase_date'
            value={erpPurchaseOrderRequest.purchase_date}
            onChange={handleInputChange}
            error={!!errors.purchase_date}
            helperText={errors.purchase_date}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.erp.purchase.order.title.total_amount")}
            name='total_amount'
            value={erpPurchaseOrderRequest.total_amount}
            onChange={handleInputChange}
            error={!!errors.total_amount}
            helperText={errors.total_amount}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.erp.purchase.order.title.order_status")}
            name='order_status'
            value={erpPurchaseOrderRequest.order_status}
            onChange={handleInputChange}
            error={!!errors.order_status}
            helperText={errors.order_status}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.purchase.order.title.discount_rate")}
            name='discount_rate'
            value={erpPurchaseOrderRequest.discount_rate}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.purchase.order.title.settlement_account_id")}
            name='settlement_account_id'
            value={erpPurchaseOrderRequest.settlement_account_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.erp.purchase.order.title.deposit")}
            name='deposit'
            value={erpPurchaseOrderRequest.deposit}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.erp.purchase.order.title.remarks")}
            name='remarks'
            value={erpPurchaseOrderRequest.remarks}
            onChange={handleInputChange}
          />
        </FormControl>
      </Box>
    </CustomizedDialog>
  )
});

export default ErpPurchaseOrderEdit;