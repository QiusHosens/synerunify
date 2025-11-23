import { convert, ConvertRequest } from '@/api/process';
import CustomizedFileUpload, { UploadFile } from '@/components/CustomizedFileUpload';
import { Box, Button, Paper, Stack, Typography, MenuItem, Select, FormControl, InputLabel, Alert } from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FormValues {
  path: string;
  file?: UploadFile | null;
  format: string;
}

const FILE_WIDTH = 420;
const FILE_HEIGHT = 260;

export default function ImageConvert() {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<FormValues>({
    path: '',
    format: 'png',
  });

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [convertedSvgContent, setConvertedSvgContent] = useState<string | null>(null);

  const handleBackToLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  // const uploadFile = useCallback(async (file: UploadFile) => {
  //   try {
  //     const response = (await uploadSystemFileOss(file.file, (progress) => {
  //       setFormValues((prev) => {
  //         if (!prev.file) return prev;
  //         return { ...prev, file: { ...prev.file, progress } };
  //       });
  //     })) as string;

  //     setFormValues((prev) => ({
  //       ...prev,
  //       path: response,
  //       file: prev.file ? { ...prev.file, status: 'done' } : prev.file,
  //     }));
  //   } catch (error) {
  //     console.error('upload file error', error);
  //     setUploadError('文件上传失败，请稍后重试');
  //     setFormValues((prev) => ({
  //       ...prev,
  //       file: prev.file ? { ...prev.file, status: 'error' } : prev.file,
  //     }));
  //   }
  // }, []);

  const handleFileChange = useCallback(
    async (file: UploadFile | null, action: 'upload' | 'remove') => {
      if (action === 'upload' && file) {
        setUploadError(null);
        setFormValues((prev) => ({
          ...prev,
          file,
          path: '',
        }));
        setConvertedSvgContent(null);

        // await uploadFile(file);
      } else if (action === 'remove') {
        setFormValues(() => ({
          path: '',
          file: undefined,
          format: 'png',
        }));
        setConvertedSvgContent(null);
      }
    },
    []
  );

  const handleConvert = useCallback(async () => {
    if (!formValues.file) {
      setUploadError('请先上传图片');
      return;
    }

    setConverting(true);
    setUploadError(null);

    try {
      const convertRequest: ConvertRequest = {
        image: formValues.file?.file as File,
        white_threshold: 240,
        min_area: 0,
        stroke_width: 2,
        sharpen_factor: 2,
        enable_upscale: false,
        enable_sharpen: false,
      };
      const convertResponse = await convert(convertRequest);
      console.log('convertResponse', convertResponse);
      setConvertedSvgContent(convertResponse.content);
    } catch (error) {
      console.error('convert image error', error);
      setUploadError('图片转换失败，请稍后重试');
    } finally {
      setConverting(false);
    }
  }, [formValues.file]);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background:
          'radial-gradient(circle at top, rgba(63, 81, 181, 0.15), rgba(13, 71, 161, 0.05))',
        py: 6,
        px: 2,
      }}>
      <Paper
        elevation={8}
        sx={{
          width: '100%',
          maxWidth: 960,
          borderRadius: 4,
          p: 4,
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255,255,255,0.9)',
        }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h4" fontWeight={600} color="primary">
              图片转换
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              上传图片并选择目标格式，系统将自动转换图片格式
            </Typography>
          </Box>
          <Button variant="outlined" onClick={handleBackToLogin}>
            返回登录
          </Button>
        </Stack>

        <Stack spacing={3}>
          <Box>
            {/* <Typography variant="subtitle1" fontWeight={600} mb={1}>
              上传图片
            </Typography> */}
            <Stack direction="row" spacing={3}>
              <CustomizedFileUpload
                canRemove
                id="convert-file-upload"
                accept=".jpg,.jpeg,.png,.gif,.webp,.bmp"
                maxSize={100}
                onChange={handleFileChange}
                file={formValues.file ?? null}
                width={FILE_WIDTH}
                height={FILE_HEIGHT}
                helperText={uploadError ?? ' '}
                error={Boolean(uploadError)}
              />

              {convertedSvgContent && (
                <Box
                  sx={{
                    width: FILE_WIDTH,
                    height: FILE_HEIGHT,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    p: 2,
                    backgroundColor: 'background.paper',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                  }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      '& svg': {
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto',
                      },
                    }}
                    dangerouslySetInnerHTML={{ __html: convertedSvgContent }}
                  />
                </Box>
              )}
            </Stack>
          </Box>

          <Box>
            <FormControl fullWidth>
              <InputLabel id="format-select-label">目标格式</InputLabel>
              <Select
                labelId="format-select-label"
                id="format-select"
                value={formValues.format}
                label="目标格式"
                onChange={(e) => setFormValues((prev) => ({ ...prev, format: e.target.value }))}>
                <MenuItem value="png">PNG</MenuItem>
                <MenuItem value="jpg">JPG</MenuItem>
                <MenuItem value="jpeg">JPEG</MenuItem>
                <MenuItem value="webp">WEBP</MenuItem>
                <MenuItem value="gif">GIF</MenuItem>
                <MenuItem value="bmp">BMP</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={handleConvert}
            disabled={!formValues.file || converting}
            sx={{ py: 1.5 }}>
            {converting ? '转换中...' : '开始转换'}
          </Button>

          {uploadError && (
            <Alert severity="error">{uploadError}</Alert>
          )}

          {/* {(originalImageUrl || convertedImageUrl) && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} mt={2}>
              {originalImageUrl && (
                <Box flex={1}>
                  <Typography variant="subtitle1" fontWeight={600} mb={1}>
                    原始图片
                  </Typography>
                  <Box
                    sx={{
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      p: 2,
                      backgroundColor: 'background.paper',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <img
                      src={originalImageUrl}
                      alt="original"
                      style={{
                        maxWidth: '100%',
                        maxHeight: 400,
                        height: 'auto',
                        borderRadius: 8,
                      }}
                    />
                  </Box>
                </Box>
              )}

              {convertedImageUrl && (
                <Box flex={1}>
                  <Typography variant="subtitle1" fontWeight={600} mb={1}>
                    转换后图片 ({formValues.format.toUpperCase()})
                  </Typography>
                  <Box
                    sx={{
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      p: 2,
                      backgroundColor: 'background.paper',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <img
                      src={convertedImageUrl}
                      alt="converted"
                      style={{
                        maxWidth: '100%',
                        maxHeight: 400,
                        height: 'auto',
                        borderRadius: 8,
                      }}
                    />
                  </Box>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = convertedImageUrl;
                      link.download = `converted.${formValues.format}`;
                      link.click();
                    }}>
                    下载转换后的图片
                  </Button>
                </Box>
              )}
            </Stack>
          )} */}
        </Stack>
      </Paper>
    </Box >
  );
}
