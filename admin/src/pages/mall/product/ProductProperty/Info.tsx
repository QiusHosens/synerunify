import { Box, Button, FormControl, Stack, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { getBaseMallProductProperty, MallProductPropertyBaseResponse, MallProductPropertyRequest, MallProductPropertyResponse, updateMallProductProperty } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import CustomizedTagsInput, { Tag } from '@/components/CustomizedTagsInput';
import CustomizedTag from '@/components/CustomizedTag';

const MallProductPropertyInfo = forwardRef(({ }, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [tags, setTags] = useState<Tag[]>([]);
  const [mallProductProperty, setMallProductProperty] = useState<MallProductPropertyBaseResponse>();

  useImperativeHandle(ref, () => ({
    show(mallProductProperty: MallProductPropertyResponse) {
      initForm(mallProductProperty);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

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
  }

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.view') + t('global.page.mall.product.property')}
      maxWidth={maxWidth}
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
          <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
            <Box>{t('common.title.name')}</Box>
            <Box>{mallProductProperty && <CustomizedTag label={mallProductProperty.name} />}</Box>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mt: 2, display: "flex", alignItems: "center" }}>
            <Box>{t('common.title.remark')}</Box>
            <Box>{mallProductProperty && <CustomizedTag label={mallProductProperty.remark} />}</Box>
          </Stack>
        </FormControl>
        <CustomizedTagsInput
          canEdit={false}
          size="small"
          name='values'
          tags={tags}
          tagName={t("page.mall.product.property.value")}
          placeholder={t("page.mall.product.property.placeholder.value")}
          sx={{ mt: 2, width: '240px' }}
        />
      </Box>
    </CustomizedDialog>
  )
});

export default MallProductPropertyInfo;