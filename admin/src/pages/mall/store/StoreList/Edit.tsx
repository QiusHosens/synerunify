import { Box, Button, FormControl, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { getMallStore, MallStoreRequest, MallStoreResponse, updateMallStore } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import CustomizedFileUpload, { DownloadProps, UploadFile } from '@/components/CustomizedFileUpload';
import { downloadSystemFile, uploadSystemFile } from '@/api/system_file';
import CustomizedTagsInput, { Tag } from '@/components/CustomizedTagsInput';
import { Editor } from '@tinymce/tinymce-react';
import CustomizedNumberInput from '@/components/CustomizedNumberInput';

interface AttachmentValues {
  file_id?: number; // 文件ID

  file?: UploadFile | null;
}

interface FormErrors {
  number?: string; // 店铺编号（业务唯一，例：S202410080001）
  name?: string; // 店铺名称
  file_id?: string; // 店铺封面ID
  status?: string; // 状态:0-待审核,1-营业中,2-暂停营业,3-审核驳回,4-永久关闭
}

interface MallStoreEditProps {
  onSubmit: () => void;
}

const MallStoreEdit = forwardRef(({ onSubmit }: MallStoreEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('xl');
  const [mallStore, setMallStore] = useState<MallStoreResponse>();
  const [mallStoreRequest, setMallStoreRequest] = useState<MallStoreRequest>({
    id: 0,
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
  const [downloadImages, setDownloadImages] = useState<Map<number, DownloadProps>>(new Map<number, DownloadProps>());
  const [sliderFiles, setSliderFiles] = useState<AttachmentValues[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const editorRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    show(mallStore: MallStoreResponse) {
      initForm(mallStore);
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!mallStoreRequest.name.trim()) {
      newErrors.name = t('global.error.input.please') + t('page.mall.product.title.name');
    }

    if (!mallStoreRequest.file_id && mallStoreRequest.file_id != 0) {
      newErrors.file_id = t('global.error.select.please') + t('page.mall.store.title.file');
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

  const initForm = async (mallStore: MallStoreResponse) => {
    const result = await getMallStore(mallStore.id);
    setMallStore(result);
    setMallStoreRequest({
      ...result,
    });
    // 设置标签
    const arrayTags = result.tags.split(',');
    const newTags: Tag[] = [];
    for (let index = 0, len = arrayTags.length; index < len; index++) {
      const tag = arrayTags[index];
      if (tag) {
        newTags.push({
          id: index,
          key: String(index),
          label: tag,
        } as Tag);
      }
    }
    setTags(newTags);
    // 设置封面图片
    downloadSystemFile(result.file_id, (progress) => {
      setDownloadImages(prev => {
        const data: DownloadProps = {
          status: 'downloading',
          progress
        };
        const newMap = new Map(prev);
        newMap.set(result.file_id, data);
        return newMap;
      })
    }).catch(() => {
      setDownloadImages(prev => {
        const data: DownloadProps = {
          status: 'error',
        };
        const newMap = new Map(prev);
        newMap.set(result.file_id, data);
        return newMap;
      })
    }).then((blob) => {
      if (blob) {
        setDownloadImages(prev => {
          const data: DownloadProps = {
            status: 'done',
            previewUrl: window.URL.createObjectURL(blob),
          };
          const newMap = new Map(prev);
          newMap.set(result.file_id, data);
          return newMap;
        })
      }
    });
    // 设置轮播图片
    const slider_file_ids = result.slider_file_ids.split(',');
    setSliderFiles(slider_file_ids.map(item => ({ file_id: Number(item) })));
    for (const slider_file_id of slider_file_ids) {
      const file_id = Number(slider_file_id);
      downloadSystemFile(file_id, (progress) => {
        setDownloadImages(prev => {
          const data: DownloadProps = {
            status: 'downloading',
            progress
          };
          const newMap = new Map(prev);
          newMap.set(file_id, data);
          return newMap;
        })
      }).catch(() => {
        setDownloadImages(prev => {
          const data: DownloadProps = {
            status: 'error',
          };
          const newMap = new Map(prev);
          newMap.set(file_id, data);
          return newMap;
        })
      }).then((blob) => {
        if (blob) {
          setDownloadImages(prev => {
            const data: DownloadProps = {
              status: 'done',
              previewUrl: window.URL.createObjectURL(blob),
            };
            const newMap = new Map(prev);
            newMap.set(file_id, data);
            return newMap;
          })
        }
      });
    }
    setErrors({});
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      const request: MallStoreRequest = {
        id: mallStoreRequest.id,
        name: mallStoreRequest.name,
        short_name: mallStoreRequest.short_name,
        file_id: mallStoreRequest.file_id,
        slider_file_ids: sliderFiles.map(item => item.file_id).join(','),
        sort: mallStoreRequest.sort,
        slogan: mallStoreRequest.slogan,
        description: editorRef.current.getContent(),
        tags: mallStoreRequest.tags,
      }
      await updateMallStore(request);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setMallStoreRequest(prev => ({
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
      setMallStoreRequest((prev) => {
        return { ...prev, file };
      })

      // 上传文件
      try {
        const result = await uploadSystemFile(file.file, (progress) => {
          setMallStoreRequest((prev) => {
            return { ...prev, file: { ...prev.file!, progress } };
          });
        });

        // 上传完成
        setMallStoreRequest((prev) => {
          return { ...prev, file_id: result, file: { ...prev.file!, status: 'done' as const } };
        });
      } catch (error) {
        console.error('upload file error', error);
        // 上传失败
        setMallStoreRequest((prev) => {
          return { ...prev, file: { ...prev.file!, status: 'error' as const } };
        });
      }
    } else if (action === 'remove') {
      // 删除文件并移除上传框
      setMallStoreRequest((prev) => {
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
      return tag.label;
    }).join(',');
    setMallStoreRequest(prev => ({
      ...prev,
      [name]: values
    }));
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.edit') + t('global.page.mall.store')}
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
        <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '240px' } }}>
          <TextField
            required
            size="small"
            label={t("page.mall.store.title.name")}
            name='name'
            value={mallStoreRequest.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            size="small"
            label={t("page.mall.store.title.short.name")}
            name='short_name'
            value={mallStoreRequest.short_name}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label={t("page.mall.store.title.slogan")}
            name='slogan'
            value={mallStoreRequest.slogan}
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
          file={mallStoreRequest.file}
          width={fileWidth}
          height={fileHeight}
          download={downloadImages?.get(mallStoreRequest.file_id)}
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
                download={downloadImages?.get(item.file_id!)}
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
          name='tags'
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
            value={mallStoreRequest.sort}
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
              initialValue={mallStoreRequest.description}
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
      </Box>
    </CustomizedDialog>
  )
});

export default MallStoreEdit;