import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { createMallStore, MallStoreRequest } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import CustomizedFileUpload, { UploadFile } from '@/components/CustomizedFileUpload';
import { uploadSystemFile } from '@/api/system_file';
import CustomizedNumberInput from '@/components/CustomizedNumberInput';
import CustomizedTagsInput, { Tag } from '@/components/CustomizedTagsInput';
import { Editor } from '@tinymce/tinymce-react';

interface AttachmentValues {
  file_id?: number; // 文件ID

  file?: UploadFile | null;
}

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

  file?: UploadFile | null; // 店铺封面文件
}

interface FormErrors {
  name?: string; // 店铺名称
  file_id?: string; // 店铺封面ID
}

interface MallStoreAddProps {
  onSubmit: () => void;
}

const MallStoreAdd = forwardRef(({ onSubmit }: MallStoreAddProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('xl');
  const [sliderFiles, setSliderFiles] = useState<AttachmentValues[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
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
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const [fileWidth] = useState<number>(240);
  const [fileHeight] = useState<number>(160);

  const editorRef = useRef<any>(null);

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

    if (!formValues.name.trim()) {
      newErrors.name = t('global.error.input.please') + t('page.mall.product.title.name');
    }

    if (!formValues.file_id && formValues.file_id != 0) {
      newErrors.file_id = t('global.error.select.please') + t('page.mall.store.title.file');
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
    });
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      const request: MallStoreRequest = {
        name: formValues.name,
        short_name: formValues.short_name,
        file_id: formValues.file_id,
        slider_file_ids: sliderFiles.map(item => item.file_id).join(','),
        sort: formValues.sort,
        slogan: formValues.slogan,
        description: editorRef.current.getContent(),
        tags: formValues.tags,
      }
      await createMallStore(request);
      handleClose();
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

  const handleFileChange = useCallback(async (file: UploadFile | null, action: 'upload' | 'remove') => {
    if (action === 'upload' && file) {
      // 更新文件列表,增加一个附件,等待上传完成后在写入信息
      setFormValues((prev) => {
        return { ...prev, file };
      })

      // 上传文件
      try {
        const result = await uploadSystemFile(file.file, (progress) => {
          setFormValues((prev) => {
            return { ...prev, file: { ...prev.file!, progress } };
          });
        });

        // 上传完成
        setFormValues((prev) => {
          return { ...prev, file_id: result, file: { ...prev.file!, status: 'done' as const } };
        });
      } catch (error) {
        console.error('upload file error', error);
        // 上传失败
        setFormValues((prev) => {
          return { ...prev, file: { ...prev.file!, status: 'error' as const } };
        });
      }
    } else if (action === 'remove') {
      // 删除文件并移除上传框
      setFormValues((prev) => {
        return { ...prev, file: undefined };
      });
    }
  }, []);

  const handleSliderFileChange = useCallback(async (file: UploadFile | null, action: 'upload' | 'remove', index: number) => {
    if (action === 'upload' && file) {
      // 更新文件列表,增加一个附件,等待上传完成后在写入信息
      setSliderFiles((prev) => {
        return [...prev, { file }];
      })

      // 上传文件
      try {
        const result = await uploadSystemFile(file.file, (progress) => {
          setSliderFiles((prev) =>
            prev.map((item, idx) => {
              if (idx !== index) return item;
              return { ...item, file: { ...item.file!, progress } };
            })
          );
        });

        // 上传完成
        setSliderFiles((prev) =>
          prev.map((item, idx) => {
            if (idx !== index) return item;
            return { ...item, file_id: result, file: { ...item.file!, status: 'done' as const } };
          })
        );
      } catch (error) {
        console.error('upload file error', error);
        // 上传失败
        setSliderFiles((prev) =>
          prev.map((item, idx) => {
            if (idx !== index) return item;
            return { ...item, file: { ...item.file!, status: 'error' as const } };
          })
        );
      }
    } else if (action === 'remove') {
      // 删除文件并移除上传框
      setSliderFiles((prev) =>
        prev.filter((_, idx) => idx !== index)
      );
    }
  }, []);

  const handleTagsChange = (name: string, newTags: Tag[]) => {
    setTags(newTags);
    const values = newTags.map(tag => {
      return { name: tag.label }
    });
    setFormValues(prev => ({
      ...prev,
      [name]: values
    }));
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.add') + t('global.page.mall.store')}
      maxWidth={maxWidth}
      actions={
        <>
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
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '240px' } }}>
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
            label={t("page.mall.store.title.short.name")}
            name='short_name'
            value={formValues.short_name}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.mall.store.title.slogan")}
            name='slogan'
            value={formValues.slogan}
            onChange={handleInputChange}
          />
        </FormControl>
        <Typography sx={{ mt: 2, mb: 1 }}>
          {t('page.mall.product.title.file')}
        </Typography>
        <CustomizedFileUpload
          canRemove={false}
          showFilename={false}
          id={'file-upload'}
          accept=".jpg,jpeg,.png"
          maxSize={100}
          onChange={(file, action) => handleFileChange(file, action)}
          file={formValues.file}
          width={fileWidth}
          height={fileHeight}
          error={!!(errors.file_id)}
          helperText={errors.file_id}
        />
        <Typography sx={{ mt: 2, mb: 1 }}>
          {t('page.mall.product.title.slider.files')}
        </Typography>
        <Box
          gap={2}
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {sliderFiles.map((item, index) => (
            <Box key={index}>
              <CustomizedFileUpload
                showFilename={false}
                id={'file-upload-slider-' + index}
                accept=".jpg,jpeg,.png"
                maxSize={100}
                onChange={(files, action) => handleSliderFileChange(files, action, index)}
                file={item.file}
                width={fileWidth}
                height={fileHeight}
              />
            </Box>
          ))}
          <Box>
            <CustomizedFileUpload
              showFilename={false}
              id={'file-upload-slider-' + sliderFiles.length}
              accept=".jpg,jpeg,.png"
              maxSize={100}
              onChange={(file, action) => handleSliderFileChange(file, action, sliderFiles.length)}
              width={fileWidth}
              height={fileHeight}
            />
          </Box>
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
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '240px' } }}>
          <CustomizedNumberInput
            required
            size="small"
            step={1}
            min={0}
            label={t("page.mall.store.title.sort")}
            name='sort'
            value={formValues.sort}
            onChange={handleInputChange}
          />
        </FormControl>
        <Box id="product" sx={{ mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            {t('page.mall.store.title.description')}
          </Typography>
          <Box sx={{
            // width: 760,
            '& .tox-promotion-button': { display: 'none !important' },
            '& .tox-statusbar__branding': { display: 'none' }
          }}>
            <Editor
              apiKey='f88rshir3x1vuar3lr0tj1vaq6muvonldxm25o6wxr23vy96'
              onInit={(_evt, editor) => (editorRef.current = editor)}
              initialValue={"<p>" + t("page.mall.store.placeholder.description") + "</p>"}
              init={{
                height: 600,
                language: "zh_CN",
                language_url: "/tinymce/langs/zh_CN.js",
                plugins: [
                  'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                ],
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          </Box>
        </Box>
      </Box >
    </CustomizedDialog >
  )
});

export default MallStoreAdd;