import { Box, Button, FormControl, FormControlLabel, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { MallProductCommentRequest, MallProductCommentResponse, updateMallProductComment } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors {
  user_id?: string; // 评价人的用户编号，关联 MemberUserDO 的 id 编号
  spu_id?: string; // 商品 SPU 编号，关联 ProductSpuDO 的 id
  sku_id?: string; // 商品 SKU 编号，关联 ProductSkuDO 的 id 编号
  sku_pic_url?: string; // 图片地址
  scores?: string; // 评分星级1-5分
  description_scores?: string; // 描述星级 1-5 星
  benefit_scores?: string; // 服务星级 1-5 星
  content?: string; // 评论内容
}

interface MallProductCommentEditProps {
  onSubmit: () => void;
}

type MallProductCommentForm = MallProductCommentRequest & {
  sku_pic_url?: string;
  pic_urls?: string;
};

const MallProductCommentEdit = forwardRef(({ onSubmit }: MallProductCommentEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [mallProductComment, setMallProductComment] = useState<MallProductCommentForm>({
    id: 0,
    user_id: 0,
    user_nickname: '',
    user_avatar: '',
    anonymous: false,
    order_id: 0,
    order_item_id: 0,
    spu_id: 0,
    spu_name: '',
    sku_id: 0,
    file_id: 0,
    sku_pic_url: '',
    sku_properties: '',
    visible: true,
    scores: 0,
    description_scores: 0,
    benefit_scores: 0,
    content: '',
    pic_urls: '',
    file_ids: '',
    reply_status: false,
    reply_user_id: 0,
    reply_content: '',
    reply_time: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(mallProductComment: MallProductCommentResponse) {
      initForm(mallProductComment);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!mallProductComment.user_id && mallProductComment.user_id != 0) {
      newErrors.user_id = t('page.mall.product.comment.error.user_id');
    }

    if (!mallProductComment.spu_id && mallProductComment.spu_id != 0) {
      newErrors.spu_id = t('page.mall.product.comment.error.spu_id');
    }

    if (!mallProductComment.sku_id && mallProductComment.sku_id != 0) {
      newErrors.sku_id = t('page.mall.product.comment.error.sku_id');
    }

    // if (!mallProductComment.sku_pic_url.trim()) {
    //   newErrors.sku_pic_url = t('page.mall.product.comment.error.sku_pic_url');
    // }

    if (!mallProductComment.scores && mallProductComment.scores != 0) {
      newErrors.scores = t('page.mall.product.comment.error.scores');
    }

    if (!mallProductComment.description_scores && mallProductComment.description_scores != 0) {
      newErrors.description_scores = t('page.mall.product.comment.error.description_scores');
    }

    if (!mallProductComment.benefit_scores && mallProductComment.benefit_scores != 0) {
      newErrors.benefit_scores = t('page.mall.product.comment.error.benefit_scores');
    }

    if (!mallProductComment.content.trim()) {
      newErrors.content = t('page.mall.product.comment.error.content');
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

  const initForm = (mallProductComment: MallProductCommentResponse) => {
    setMallProductComment({
      ...mallProductComment,
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateMallProductComment(mallProductComment);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setMallProductComment(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setMallProductComment(prev => ({
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

    setMallProductComment(prev => ({
      ...prev,
      [name]: checked
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
      title={t('global.operate.edit') + t('global.page.mall.product.comment')}
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
            label={t("page.mall.product.comment.title.user_id")}
            name='user_id'
            value={mallProductComment.user_id}
            onChange={handleInputChange}
            error={!!errors.user_id}
            helperText={errors.user_id}
          />
          <TextField
            size="small"
            label={t("page.mall.product.comment.title.user_nickname")}
            name='user_nickname'
            value={mallProductComment.user_nickname}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.mall.product.comment.title.user_avatar")}
            name='user_avatar'
            value={mallProductComment.user_avatar}
            onChange={handleInputChange}
          />
          <FormControlLabel
            sx={{ mt: 2 }}
            control={
              <Switch
                name='anonymous'
                checked={mallProductComment.anonymous}
                onChange={handleStatusChange}
              />
            }
            label={t("page.mall.product.comment.title.anonymous")}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.product.comment.title.order_id")}
            name='order_id'
            value={mallProductComment.order_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.product.comment.title.order_item_id")}
            name='order_item_id'
            value={mallProductComment.order_item_id}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.product.comment.title.spu_id")}
            name='spu_id'
            value={mallProductComment.spu_id}
            onChange={handleInputChange}
            error={!!errors.spu_id}
            helperText={errors.spu_id}
          />
          <TextField
            size="small"
            label={t("page.mall.product.comment.title.spu_name")}
            name='spu_name'
            value={mallProductComment.spu_name}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.product.comment.title.sku_id")}
            name='sku_id'
            value={mallProductComment.sku_id}
            onChange={handleInputChange}
            error={!!errors.sku_id}
            helperText={errors.sku_id}
          />
          <TextField
            required
            size="small"
            label={t("page.mall.product.comment.title.sku_pic_url")}
            name='sku_pic_url'
            value={mallProductComment.sku_pic_url}
            onChange={handleInputChange}
            error={!!errors.sku_pic_url}
            helperText={errors.sku_pic_url}
          />
          <TextField
            size="small"
            label={t("page.mall.product.comment.title.sku_properties")}
            name='sku_properties'
            value={mallProductComment.sku_properties}
            onChange={handleInputChange}
          />
          <FormControlLabel
            sx={{ mt: 2 }}
            control={
              <Switch
                name='visible'
                checked={mallProductComment.visible}
                onChange={handleStatusChange}
              />
            }
            label={t("page.mall.product.comment.title.visible")}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("page.mall.product.comment.title.scores")}
            name='scores'
            value={mallProductComment.scores}
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
            value={mallProductComment.description_scores}
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
            value={mallProductComment.benefit_scores}
            onChange={handleInputChange}
            error={!!errors.benefit_scores}
            helperText={errors.benefit_scores}
          />
          <TextField
            required
            size="small"
            label={t("page.mall.product.comment.title.content")}
            name='content'
            value={mallProductComment.content}
            onChange={handleInputChange}
            error={!!errors.content}
            helperText={errors.content}
          />
          <TextField
            size="small"
            label={t("page.mall.product.comment.title.pic_urls")}
            name='pic_urls'
            value={mallProductComment.pic_urls}
            onChange={handleInputChange}
          />
          <FormControlLabel
            sx={{ mt: 2 }}
            control={
              <Switch
                name='reply_status'
                checked={mallProductComment.reply_status}
                onChange={handleStatusChange}
              />
            }
            label={t("page.mall.product.comment.title.reply_status")}
          />
          <TextField
            size="small"
            type="number"
            label={t("page.mall.product.comment.title.reply_user_id")}
            name='reply_user_id'
            value={mallProductComment.reply_user_id}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.mall.product.comment.title.reply_content")}
            name='reply_content'
            value={mallProductComment.reply_content}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.mall.product.comment.title.reply_time")}
            name='reply_time'
            value={mallProductComment.reply_time}
            onChange={handleInputChange}
          />
        </FormControl>
      </Box>
    </CustomizedDialog>
  )
});

export default MallProductCommentEdit;