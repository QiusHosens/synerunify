import { detect, DetectRequest, DetectResponse } from '@/api/detection';
import { uploadSystemFileOss } from '@/api/system_file';
import CustomizedFileUpload, { UploadFile } from '@/components/CustomizedFileUpload';
import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FormValues {
  path: string;
  file?: UploadFile | null;
  detection_path?: string;
  detection_json?: string;
}

const FILE_WIDTH = 420;
const FILE_HEIGHT = 260;

const formatValue = (value: unknown) => {
  if (value === null || value === undefined) {
    return '-';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
};

export default function Detection() {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<FormValues>({
    path: '',
  });

  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleBackToLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const handleFileChange = useCallback(
    async (file: UploadFile | null, action: 'upload' | 'remove') => {
      if (action === 'upload' && file) {
        setUploadError(null);
        setFormValues((prev) => ({ ...prev, file, detectionResult: null, rawResult: undefined }));

        try {
          const response = (await uploadSystemFileOss(file.file, (progress) => {
            setFormValues((prev) => {
              if (!prev.file) return prev;
              return { ...prev, file: { ...prev.file, progress } };
            });
          })) as string;

          const path = response;
          const path_array = path.split('/').slice(0, -1);
          path_array.splice(1, 0, 'detection')
          const outputDir = path_array.join('/');
          const detectionRequest: DetectRequest = {
            source_file: response,
            output_dir: outputDir,
          };
          const detectionResponse = await detect(detectionRequest);

          setFormValues((prev) => ({
            ...prev,
            path,
            detection_path: detectionResponse.path,
            detection_json: detectionResponse.json,
            file: prev.file ? { ...prev.file, status: 'done' } : prev.file,
          }));
        } catch (error) {
          console.error('upload file error', error);
          setUploadError('文件上传失败，请稍后重试');
          setFormValues((prev) => ({
            ...prev,
            file: prev.file ? { ...prev.file, status: 'error' } : prev.file,
          }));
        }
      } else if (action === 'remove') {
        setFormValues((prev) => ({
          path: '',
          file: undefined,
          detectionResult: null,
          rawResult: undefined,
        }));
      }
    },
    []
  );

  const detectionEntries = useMemo(() => {
    if (!formValues.detectionResult) return [];
    return Object.entries(formValues.detectionResult)
      .slice(0, 8)
      .map(([key, value]) => ({ key, value }));
  }, [formValues.detectionResult]);

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
              系统检测中心
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              上传任意检测图片，系统会自动解析并返回检测结果数据
            </Typography>
          </Box>
          <Button variant="outlined" onClick={handleBackToLogin}>
            返回登录
          </Button>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Box flex={1}>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              上传检测图片
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              支持 PNG / JPG / JPEG，单个文件不超过 100 MB。上传后可点击图片进行放大查看。
            </Typography>
            <CustomizedFileUpload
              canRemove
              id="detection-file-upload"
              accept=".jpg,.jpeg,.png"
              maxSize={100}
              onChange={handleFileChange}
              file={formValues.file ?? null}
              width={FILE_WIDTH}
              height={FILE_HEIGHT}
              helperText={uploadError ?? ' '}
              error={Boolean(uploadError)}
            />
          </Box>

          <Box
            flex={1}
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              p: 3,
              backgroundColor: 'background.paper',
              boxShadow: (theme) => theme.shadows[1],
              minHeight: 320,
            }}>
            <Typography variant="subtitle1" fontWeight={600}>
              检测结果
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              上传成功后将在此处展示解析后的关键指标
            </Typography>

            {formValues.detectionResult ? (
              <>
                <Stack spacing={1.5}>
                  {detectionEntries.map(({ key, value }) => (
                    <Stack
                      key={key}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      spacing={2}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 96 }}>
                        {key}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ wordBreak: 'break-all', flex: 1, whiteSpace: 'pre-wrap' }}>
                        {formatValue(value)}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
                {formValues.rawResult && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      原始返回数据
                    </Typography>
                    <Box
                      component="pre"
                      sx={{
                        maxHeight: 200,
                        overflow: 'auto',
                        backgroundColor: '#0f172a',
                        color: '#e2e8f0',
                        borderRadius: 2,
                        p: 2,
                        fontSize: 12,
                      }}>
                      {formValues.rawResult}
                    </Box>
                  </>
                )}
              </>
            ) : (
              <Stack
                height="100%"
                alignItems="center"
                justifyContent="center"
                spacing={1}
                color="text.secondary">
                <Typography variant="body1">请先上传图片以查看检测结果</Typography>
                <Typography variant="body2">系统将实时返回 JSON 数据并格式化展示</Typography>
              </Stack>
            )}
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}

