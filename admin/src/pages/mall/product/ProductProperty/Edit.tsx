import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { getBaseMallProductProperty, MallProductPropertyRequest, MallProductPropertyResponse, updateMallProductProperty } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import CustomizedTagsInput, { Tag } from '@/components/CustomizedTagsInput';

interface FormErrors {
  status?: string; // 状态
}

interface MallProductPropertyEditProps {
  onSubmit: () => void;
}

const MallProductPropertyEdit = forwardRef(({ onSubmit }: MallProductPropertyEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [tags, setTags] = useState<Tag[]>([]);
  const [mallProductProperty, setMallProductProperty] = useState<MallProductPropertyRequest>({
    id: 0,
    name: '',
    status: 0,
    remark: '',
    values: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    show(mallProductProperty: MallProductPropertyResponse) {
      initForm(mallProductProperty);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!mallProductProperty.status && mallProductProperty.status != 0) {
      newErrors.status = t('common.error.status');
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

  const initForm = async (mallProductProperty: MallProductPropertyResponse) => {
    const result = await getBaseMallProductProperty(mallProductProperty.id);
    setMallProductProperty({
      ...result,
    })
    setTags(result.values.map(value => {
      return {
        id: value.id,
        key: String(value.id),
        label: value.name,
      } as Tag;
    }))
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      await updateMallProductProperty(mallProductProperty);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setMallProductProperty((prev) => ({
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

  const handleTagsChange = (name: string, newTags: Tag[]) => {
    setTags(newTags);
    const values = newTags.map(tag => {
      return { id: tag.id, name: tag.label }
    });
    setMallProductProperty(prev => ({
      ...prev,
      [name]: values
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const { name } = e.target;

    setMallProductProperty(prev => ({
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
      title={t('global.operate.edit') + t('global.page.mall.product.property')}
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
            size="small"
            label={t("common.title.name")}
            name='name'
            value={mallProductProperty.name}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("common.title.remark")}
            name='remark'
            value={mallProductProperty.remark}
            onChange={handleInputChange}
          />
        </FormControl>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 4 }}>{t("global.title.status")}</Typography>
          <Switch sx={{ mr: 2 }} name='status' checked={!mallProductProperty.status} onChange={handleStatusChange} />
          <Typography>{mallProductProperty.status == 0 ? t('global.switch.status.true') : t('global.switch.status.false')}</Typography>
        </Box>
        <CustomizedTagsInput
          size="small"
          name='values'
          tags={tags}
          onTagsChange={handleTagsChange}
          tagName={t("page.mall.product.property.value")}
          placeholder={t("page.mall.product.property.placeholder.value")}
          sx={{ mt: 2, width: '240px' }}
        />
      </Box>
    </CustomizedDialog>
  )
});

export default MallProductPropertyEdit;