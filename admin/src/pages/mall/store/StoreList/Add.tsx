import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createMallStore, MallStoreRequest } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormValues {
  number: string; // 店铺编号（业务唯一，例：S202410080001）
  name: string; // 店铺名称
  short_name: string; // 店铺简称
  file_id: number; // 店铺封面ID
  slider_file_ids: string; // 店铺轮播图id数组，以逗号分隔最多上传15张
  sort: number; // 店铺排序
  slogan: string; // 店铺广告语
  description: string; // 店铺描述
  tags: string; // 店铺标签，逗号分隔，如：正品保障,7天无理由
  status: number; // 状态:0-待审核,1-营业中,2-暂停营业,3-审核驳回,4-永久关闭
  audit_remark: string; // 审核备注
  audit_time: string; // 审核通过时间
  score_desc: number; // 描述相符评分
  score_service: number; // 服务态度评分
  score_delivery: number; // 发货速度评分
  total_sales_amount: number; // 累计销售额
  total_order_count: number; // 累计订单数
  total_goods_count: number; // 商品总数
  total_fans_count: number; // 粉丝数
  is_recommend: number; // 是否平台推荐：0-否,1-是
  }

interface FormErrors { 
  number?: string; // 店铺编号（业务唯一，例：S202410080001）
  name?: string; // 店铺名称
  file_id?: string; // 店铺封面ID
  status?: string; // 状态:0-待审核,1-营业中,2-暂停营业,3-审核驳回,4-永久关闭
}

interface MallStoreAddProps {
  onSubmit: () => void;
}

const MallStoreAdd = forwardRef(({ onSubmit }: MallStoreAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [formValues, setFormValues] = useState<FormValues>({
    number: '',
    name: '',
    short_name: '',
    file_id: 0,
    slider_file_ids: '',
    sort: 0,
    slogan: '',
    description: '',
    tags: '',
    status: 0,
    audit_remark: '',
    audit_time: '',
    score_desc: 0,
    score_service: 0,
    score_delivery: 0,
    total_sales_amount: 0,
    total_order_count: 0,
    total_goods_count: 0,
    total_fans_count: 0,
    is_recommend: 0,
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
    
    if (!formValues.number.trim()) {
      newErrors.number = t('page.mall.store.error.number');
    }
    
    if (!formValues.name.trim()) {
      newErrors.name = t('page.mall.store.error.name');
    }
    
    if (!formValues.file_id && formValues.file_id != 0) {
      newErrors.file_id = t('page.mall.store.error.file');
    }
    
    if (!formValues.status && formValues.status != 0) {
      newErrors.status = t('page.mall.store.error.status');
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
      number: '',
      name: '',
      short_name: '',
      file_id: 0,
      slider_file_ids: '',
      sort: 0,
      slogan: '',
      description: '',
      tags: '',
      status: 0,
      audit_remark: '',
      audit_time: '',
      score_desc: 0,
      score_service: 0,
      score_delivery: 0,
      total_sales_amount: 0,
      total_order_count: 0,
      total_goods_count: 0,
      total_fans_count: 0,
      is_recommend: 0,
      });
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await createMallStore(formValues as MallStoreRequest);
      handleClose();
      onSubmit();
    }
  };

  const handleSubmitAndContinue = async () => {
    if (validateForm()) {
      await createMallStore(formValues as MallStoreRequest);
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormValues((prev) => ({
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
      title={t('global.operate.add') + t('global.page.mall.store')}
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
        sx={ {display: 'flex',
          flexDirection: 'column',
          m: 'auto',
          width: 'fit-content',} }
      >
        <FormControl sx={ {minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '200px' }} }>
          <TextField
            required
            size="small"
            label={t("page.mall.store.title.number")}
            name='number'
            value={formValues.number}
            onChange={handleInputChange}
            error={!!errors.number}
            helperText={errors.number}
          />
          <TextField
            required
            size="small"
            label={t("page.mall.store.title.name")}
            name='name'
            value={formValues.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            size="small"
            label={t("page.mall.store.title.short_name")}
            name='short_name'
            value={formValues.short_name}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.store.title.file_id")}
            name='file_id'
            value={formValues.file_id}
            onChange={handleInputChange}
            error={!!errors.file_id}
            helperText={errors.file_id}
          />
          <TextField
            size="small"
            label={t("page.mall.store.title.slider_file_ids")}
            name='slider_file_ids'
            value={formValues.slider_file_ids}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.store.title.sort")}
            name='sort'
            value={formValues.sort}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.mall.store.title.slogan")}
            name='slogan'
            value={formValues.slogan}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.mall.store.title.description")}
            name='description'
            value={formValues.description}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.mall.store.title.tags")}
            name='tags'
            value={formValues.tags}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.store.title.status")}
            name='status'
            value={formValues.status}
            onChange={handleInputChange}
            error={!!errors.status}
            helperText={errors.status}
          />
          <TextField
            size="small"
            label={t("page.mall.store.title.audit_remark")}
            name='audit_remark'
            value={formValues.audit_remark}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.mall.store.title.audit_time")}
            name='audit_time'
            value={formValues.audit_time}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.store.title.score_desc")}
            name='score_desc'
            value={formValues.score_desc}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.store.title.score_service")}
            name='score_service'
            value={formValues.score_service}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.store.title.score_delivery")}
            name='score_delivery'
            value={formValues.score_delivery}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.store.title.total_sales_amount")}
            name='total_sales_amount'
            value={formValues.total_sales_amount}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.store.title.total_order_count")}
            name='total_order_count'
            value={formValues.total_order_count}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.store.title.total_goods_count")}
            name='total_goods_count'
            value={formValues.total_goods_count}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.store.title.total_fans_count")}
            name='total_fans_count'
            value={formValues.total_fans_count}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.store.title.is_recommend")}
            name='is_recommend'
            value={formValues.is_recommend}
            onChange={handleInputChange}
          />
          </FormControl>
        <Box sx={ {mt: 2, display: 'flex', alignItems: 'center'} }>
          <Typography sx={ {mr: 4} }>{t("global.title.status")}</Typography>
          <Switch sx={ {mr: 2} } name='status' checked={!formValues.status} onChange={handleStatusChange} />
          <Typography>{formValues.status == 0 ? t('global.switch.status.true') : t('global.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default MallStoreAdd;