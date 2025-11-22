import { previewSystemFile, uploadSystemFileOss } from '@/api/system_file';
import CustomizedFileUpload, { UploadFile } from '@/components/CustomizedFileUpload';
import { Box, Button, Paper, Stack, Typography, Alert, Chip } from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FormValues {
  path: string;
  file?: UploadFile | null;
}

const FILE_WIDTH = 420;
const FILE_HEIGHT = 260;

interface DetectionObject {
  label: string;
  confidence: number;
  box: [number, number, number, number]; // [x1, y1, x2, y2]
}

export default function ObjectDetection() {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<FormValues>({
    path: '',
  });

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [detectionResults, setDetectionResults] = useState<DetectionObject[]>([]);
  const [detectedImageUrl, setDetectedImageUrl] = useState<string | null>(null);

  const handleBackToLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const uploadFile = useCallback(async (file: UploadFile) => {
    try {
      const response = (await uploadSystemFileOss(file.file, (progress) => {
        setFormValues((prev) => {
          if (!prev.file) return prev;
          return { ...prev, file: { ...prev.file, progress } };
        });
      })) as string;

      setFormValues((prev) => ({
        ...prev,
        path: response,
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
  }, []);

  const handleFileChange = useCallback(
    async (file: UploadFile | null, action: 'upload' | 'remove') => {
      if (action === 'upload' && file) {
        setUploadError(null);
        setFormValues((prev) => ({
          ...prev,
          file,
          path: '',
        }));
        setDetectionResults([]);
        setDetectedImageUrl(null);
        await uploadFile(file);
      } else if (action === 'remove') {
        setFormValues(() => ({
          path: '',
          file: undefined,
        }));
        setDetectionResults([]);
        setDetectedImageUrl(null);
      }
    },
    [uploadFile]
  );

  const handleDetect = useCallback(async () => {
    if (!formValues.file || !formValues.path) {
      setUploadError('请先上传图片');
      return;
    }

    setDetecting(true);
    setUploadError(null);

    try {
      // TODO: 调用目标检测 API
      // 这里暂时模拟检测过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟检测结果
      const mockResults: DetectionObject[] = [
        { label: 'person', confidence: 0.95, box: [100, 100, 300, 400] },
        { label: 'car', confidence: 0.87, box: [400, 200, 600, 350] },
        { label: 'dog', confidence: 0.82, box: [150, 450, 280, 550] },
      ];
      
      setDetectionResults(mockResults);
      
      // 使用原始图片作为检测结果图片（实际应该使用API返回的标注图片）
      const detectedUrl = previewSystemFile(formValues.path);
      setDetectedImageUrl(detectedUrl);
    } catch (error) {
      console.error('detect objects error', error);
      setUploadError('目标检测失败，请稍后重试');
    } finally {
      setDetecting(false);
    }
  }, [formValues.file, formValues.path]);

  const originalImageUrl = formValues.path
    ? previewSystemFile(formValues.path)
    : formValues.file?.previewUrl || '';

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
              目标检测
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              上传图片，系统将自动检测图片中的目标对象并标注位置
            </Typography>
          </Box>
          <Button variant="outlined" onClick={handleBackToLogin}>
            返回登录
          </Button>
        </Stack>

        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              上传图片
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

          <Button
            variant="contained"
            size="large"
            onClick={handleDetect}
            disabled={!formValues.file || detecting}
            sx={{ py: 1.5 }}>
            {detecting ? '检测中...' : '开始检测'}
          </Button>

          {uploadError && (
            <Alert severity="error">{uploadError}</Alert>
          )}

          {detectionResults.length > 0 && (
            <Box
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                p: 2,
                backgroundColor: 'background.paper',
              }}>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                检测结果
              </Typography>
              <Stack spacing={1.5}>
                {detectionResults.map((result, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      backgroundColor: 'action.hover',
                    }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" fontWeight={600}>
                        对象 {index + 1}:
                      </Typography>
                      <Chip label={result.label} size="small" color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        置信度: {(result.confidence * 100).toFixed(1)}%
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      位置: [{result.box.join(', ')}]
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          )}

          {(originalImageUrl || detectedImageUrl) && (
            <Box>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                {detectedImageUrl ? '检测结果图片' : '原始图片'}
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
                  src={detectedImageUrl || originalImageUrl}
                  alt="detected"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 600,
                    height: 'auto',
                    borderRadius: 8,
                  }}
                />
              </Box>
            </Box>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
