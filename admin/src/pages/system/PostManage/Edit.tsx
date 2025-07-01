import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { SystemPostRequest, SystemPostResponse, updateSystemPost } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';

interface FormErrors {
  name?: string; // 职位名称
  sort?: string; // 显示顺序
}

interface PostEditProps {
  onSubmit: () => void;
}

const PostEdit = forwardRef(({ onSubmit }: PostEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [post, setPost] = useState<SystemPostRequest>({
    id: 0,
    name: '',
    code: '',
    sort: 0,
    status: 0,
    remark: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(post: SystemPostResponse) {
      initForm(post);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!post.name.trim()) {
      newErrors.name = t('global.error.input.please') + t('common.title.name');
    }

    if (!post.sort && post.sort != 0) {
      newErrors.sort = t('global.error.input.please') + t('common.title.sort');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    setOpen(false);
    // reset();
  };

  const handleClose = () => {
    setOpen(false);
    // reset();
  };

  const initForm = (post: SystemPostResponse) => {
    setPost({
      ...post,
    })
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateSystemPost(post);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('target', e.target);
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);
      setPost(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setPost(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // console.log('formValues', formValues);

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    // console.log('target', e.target, checked);
    const { name } = e.target;

    setPost(prev => ({
      ...prev,
      [name]: checked ? 0 : 1
    }));

    // Clear error when user starts typing
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
      title={t('global.operate.edit') + t('global.page.post')}
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
            label={t("common.title.name")}
            name='name'
            value={post.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            size="small"
            label={t("common.title.code")}
            name='code'
            value={post.code}
            onChange={handleInputChange}
          />
          <TextField
            required
            size="small"
            type="number"
            label={t("common.title.sort")}
            name="sort"
            value={post.sort}
            onChange={handleInputChange}
            error={!!errors.sort}
            helperText={errors.sort}
          />
          <TextField
            size="small"
            label={t("common.title.remark")}
            name="remark"
            value={post.remark}
            onChange={handleInputChange}
          />
        </FormControl>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 4 }}>{t("common.title.status")}</Typography>
          <Switch sx={{ mr: 2 }} name='status' checked={!post.status} onChange={handleStatusChange} />
          <Typography>{post.status == 0 ? t('common.switch.status.true') : t('common.switch.status.false')}</Typography>
        </Box>
      </Box>
    </CustomizedDialog>
  )
});

export default PostEdit;