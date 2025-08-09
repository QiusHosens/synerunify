import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createMallProductComment, MallProductCommentRequest } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormValues {
  user_id: number; // 评价人的用户编号，关联 MemberUserDO 的 id 编号
  user_nickname: string; // 评价人名称
  user_avatar: string; // 评价人头像
  anonymous: boolean; // 是否匿名
  order_id: number; // 交易订单编号，关联 TradeOrderDO 的 id 编号
  order_item_id: number; // 交易订单项编号，关联 TradeOrderItemDO 的 id 编号
  spu_id: number; // 商品 SPU 编号，关联 ProductSpuDO 的 id
  spu_name: string; // 商品 SPU 名称
  sku_id: number; // 商品 SKU 编号，关联 ProductSkuDO 的 id 编号
  sku_pic_url: string; // 图片地址
  sku_properties: string; // 属性数组，JSON 格式 [{propertId: , valueId: }, {propertId: , valueId: }]
  visible: boolean; // 是否可见，true:显示false:隐藏
  scores: number; // 评分星级1-5分
  description_scores: number; // 描述星级 1-5 星
  benefit_scores: number; // 服务星级 1-5 星
  content: string; // 评论内容
  pic_urls: string; // 评论图片地址数组
  reply_status: boolean; // 商家是否回复
  reply_user_id: number; // 回复管理员编号，关联 AdminUserDO 的 id 编号
  reply_content: string; // 商家回复内容
  reply_time: string; // 商家回复时间
}

interface FormErrors {
  user_id?: string; // 评价人的用户编号，关联 MemberUserDO 的 id 编号
  anonymous?: string; // 是否匿名
  spu_id?: string; // 商品 SPU 编号，关联 ProductSpuDO 的 id
  sku_id?: string; // 商品 SKU 编号，关联 ProductSkuDO 的 id 编号
  sku_pic_url?: string; // 图片地址
  scores?: string; // 评分星级1-5分
  description_scores?: string; // 描述星级 1-5 星
  benefit_scores?: string; // 服务星级 1-5 星
  content?: string; // 评论内容
}

interface MallProductCommentAddProps {
  onSubmit: () => void;
}

const MallProductCommentAdd = forwardRef(({ onSubmit }: MallProductCommentAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [formValues, setFormValues] = useState<FormValues>({
    user_id: 0,
    user_nickname: '',
    user_avatar: '',
    anonymous: '',
    order_id: 0,
    order_item_id: 0,
    spu_id: 0,
    spu_name: '',
    sku_id: 0,
    sku_pic_url: '',
    sku_properties: '',
    visible: '',
    scores: 0,
    description_scores: 0,
    benefit_scores: 0,
    content: '',
    pic_urls: '',
    reply_status: '',
    reply_user_id: 0,
    reply_content: '',
    reply_time: '',
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

    if (!formValues.user_id && formValues.user_id != 0) {
      newErrors.user_id = t('page.mall.product.comment.error.user_id');
    }

    if (!formValues.anonymous.trim()) {
      newErrors.anonymous = t('page.mall.product.comment.error.anonymous');
    }

    if (!formValues.spu_id && formValues.spu_id != 0) {
      newErrors.spu_id = t('page.mall.product.comment.error.spu_id');
    }

    if (!formValues.sku_id && formValues.sku_id != 0) {
      newErrors.sku_id = t('page.mall.product.comment.error.sku_id');
    }

    if (!formValues.sku_pic_url.trim()) {
      newErrors.sku_pic_url = t('page.mall.product.comment.error.sku_pic_url');
    }

    if (!formValues.scores && formValues.scores != 0) {
      newErrors.scores = t('page.mall.product.comment.error.scores');
    }

    if (!formValues.description_scores && formValues.description_scores != 0) {
      newErrors.description_scores = t('page.mall.product.comment.error.description_scores');
    }

    if (!formValues.benefit_scores && formValues.benefit_scores != 0) {
      newErrors.benefit_scores = t('page.mall.product.comment.error.benefit_scores');
    }

    if (!formValues.content.trim()) {
      newErrors.content = t('page.mall.product.comment.error.content');
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
      user_id: 0,
      user_nickname: '',
      user_avatar: '',
      anonymous: '',
      order_id: 0,
      order_item_id: 0,
      spu_id: 0,
      spu_name: '',
      sku_id: 0,
      sku_pic_url: '',
      sku_properties: '',
      visible: '',
      scores: 0,
      description_scores: 0,
      benefit_scores: 0,
      content: '',
      pic_urls: '',
      reply_status: '',
      reply_user_id: 0,
      reply_content: '',
      reply_time: '',
    });
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await createMallProductComment(formValues as MallProductCommentRequest);
      handleClose();
      onSubmit();
    }
  };

  const handleSubmitAndContinue = async () => {
    if (validateForm()) {
      await createMallProductComment(formValues as MallProductCommentRequest);
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
      title={t('global.operate.add') + t('global.page.mall.product.comment')}
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
            label={t("page.mall.product.comment.title.user_id")}
            name='user_id'
            value={formValues.user_id}
            onChange={handleInputChange}
            error={!!errors.user_id}
            helperText={errors.user_id}
          />
          <TextField
            size="small"
            label={t("page.mall.product.comment.title.user_nickname")}
            name='user_nickname'
            value={formValues.user_nickname}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.mall.product.comment.title.user_avatar")}
            name='user_avatar'
            value={formValues.user_avatar}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            label={t("page.mall.product.comment.title.anonymous")}
            name='anonymous'
            value={formValues.anonymous}
            onChange={handleInputChange}
            error={!!errors.anonymous}
            helperText={errors.anonymous}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.product.comment.title.order_id")}
            name='order_id'
            value={formValues.order_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.product.comment.title.order_item_id")}
            name='order_item_id'
            value={formValues.order_item_id}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.product.comment.title.spu_id")}
            name='spu_id'
            value={formValues.spu_id}
            onChange={handleInputChange}
            error={!!errors.spu_id}
            helperText={errors.spu_id}
          />
          <TextField
            size="small"
            label={t("page.mall.product.comment.title.spu_name")}
            name='spu_name'
            value={formValues.spu_name}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.product.comment.title.sku_id")}
            name='sku_id'
            value={formValues.sku_id}
            onChange={handleInputChange}
            error={!!errors.sku_id}
            helperText={errors.sku_id}
          />
          <TextField
            required
            size="small"
            label={t("page.mall.product.comment.title.sku_pic_url")}
            name='sku_pic_url'
            value={formValues.sku_pic_url}
            onChange={handleInputChange}
            error={!!errors.sku_pic_url}
            helperText={errors.sku_pic_url}
          />
          <TextField
            size="small"
            label={t("page.mall.product.comment.title.sku_properties")}
            name='sku_properties'
            value={formValues.sku_properties}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.mall.product.comment.title.visible")}
            name='visible'
            value={formValues.visible}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.product.comment.title.scores")}
            name='scores'
            value={formValues.scores}
            onChange={handleInputChange}
            error={!!errors.scores}
            helperText={errors.scores}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.product.comment.title.description_scores")}
            name='description_scores'
            value={formValues.description_scores}
            onChange={handleInputChange}
            error={!!errors.description_scores}
            helperText={errors.description_scores}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.product.comment.title.benefit_scores")}
            name='benefit_scores'
            value={formValues.benefit_scores}
            onChange={handleInputChange}
            error={!!errors.benefit_scores}
            helperText={errors.benefit_scores}
          />
          <TextField
            required
            size="small"
            label={t("page.mall.product.comment.title.content")}
            name='content'
            value={formValues.content}
            onChange={handleInputChange}
            error={!!errors.content}
            helperText={errors.content}
          />
          <TextField
            size="small"
            label={t("page.mall.product.comment.title.pic_urls")}
            name='pic_urls'
            value={formValues.pic_urls}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.mall.product.comment.title.reply_status")}
            name='reply_status'
            value={formValues.reply_status}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.product.comment.title.reply_user_id")}
            name='reply_user_id'
            value={formValues.reply_user_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.mall.product.comment.title.reply_content")}
            name='reply_content'
            value={formValues.reply_content}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.mall.product.comment.title.reply_time")}
            name='reply_time'
            value={formValues.reply_time}
            onChange={handleInputChange}
          />
        </FormControl>
      </Box>
    </CustomizedDialog>
  )
});

export default MallProductCommentAdd;