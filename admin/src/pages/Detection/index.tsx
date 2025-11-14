import { detect, DetectRequest } from '@/api/detection';
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

interface DetectionBox {
  text: string;
  score?: number;
  box: [number, number, number, number];
  polygon?: number[][];
}

interface DetectionVisualization {
  width: number;
  height: number;
  boxes: DetectionBox[];
}

const parseDetectionVisualization = (json: string): DetectionVisualization | null => {
  try {
    const parsed = JSON.parse(json);
    const res = parsed?.res ?? parsed;
    const boxes: Array<[number, number, number, number]> = Array.isArray(res?.rec_boxes)
      ? res.rec_boxes
      : [];
    const texts: string[] = Array.isArray(res?.rec_texts) ? res.rec_texts : [];
    const scores: number[] = Array.isArray(res?.rec_scores) ? res.rec_scores : [];
    const polygons: number[][][] = Array.isArray(res?.rec_polys) ? res.rec_polys : [];

    const width =
      boxes.reduce((max, box) => {
        if (!Array.isArray(box)) return max;
        return Math.max(max, box[0] ?? 0, box[2] ?? 0);
      }, 0) || 1;
    const height =
      boxes.reduce((max, box) => {
        if (!Array.isArray(box)) return max;
        return Math.max(max, box[1] ?? 0, box[3] ?? 0);
      }, 0) || 1;

    const detectionBoxes: DetectionBox[] = texts.map((text, index) => ({
      text,
      score: typeof scores[index] === 'number' ? scores[index] : undefined,
      box: Array.isArray(boxes[index]) ? boxes[index] : [0, 0, 0, 0],
      polygon: Array.isArray(polygons[index]) ? polygons[index] : undefined,
    }));

    return {
      width,
      height,
      boxes: detectionBoxes,
    };
  } catch (error) {
    console.error('parse detection json error', error);
    return null;
  }
};

const decompressDetectionJson = async (gzipBase64: string): Promise<string> => {
  if (!gzipBase64) {
    return '';
  }
  try {
    if (typeof DecompressionStream === 'undefined') {
      console.warn('DecompressionStream is not supported in this environment');
      return gzipBase64;
    }

    const binaryString = atob(gzipBase64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i += 1) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const decompressionStream = new DecompressionStream('gzip');
    const stream = new Blob([bytes]).stream().pipeThrough(decompressionStream);
    const arrayBuffer = await new Response(stream).arrayBuffer();
    return new TextDecoder().decode(arrayBuffer);
  } catch (error) {
    console.error('decompress detection json error', error);
    return gzipBase64;
  }
};

export default function Detection() {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<FormValues>({
    path: '',
  });

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [detectionData, setDetectionData] = useState<DetectionVisualization | null>(null);

  const handleBackToLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const handleFileChange = useCallback(
    async (file: UploadFile | null, action: 'upload' | 'remove') => {
      if (action === 'upload' && file) {
        setUploadError(null);
        setFormValues((prev) => ({
          ...prev,
          file,
          detection_path: undefined,
          detection_json: undefined,
        }));
        setDetectionData(null);

        try {
          const response = (await uploadSystemFileOss(file.file, (progress) => {
            setFormValues((prev) => {
              if (!prev.file) return prev;
              return { ...prev, file: { ...prev.file, progress } };
            });
          })) as string;

          const path = response;
          const path_array = path.split('/').slice(0, -1);
          path_array.splice(1, 0, 'detection');
          const outputDir = path_array.join('/');
          const detectionRequest: DetectRequest = {
            source_file: response,
            output_dir: outputDir,
          };
          const detectionResponse = await detect(detectionRequest);
          const decompressedJson = await decompressDetectionJson(detectionResponse.json);
          const parsedDetection = parseDetectionVisualization(decompressedJson);

          setFormValues((prev) => ({
            ...prev,
            path,
            detection_path: detectionResponse.path,
            detection_json: decompressedJson,
            file: prev.file ? { ...prev.file, status: 'done' } : prev.file,
          }));
          setDetectionData(parsedDetection);
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
          detection_path: undefined,
          detection_json: undefined,
        }));
        setDetectionData(null);
      }
    },
    []
  );

  const detectionEntries = useMemo(() => {
    if (!detectionData) return [];
    return detectionData.boxes.slice(0, 6).map((item, index) => ({
      key: `文本 ${index + 1}`,
      value: `${item.text || '-'}  (score ${(item.score ?? 0).toFixed(3)})`,
    }));
  }, [detectionData]);

  const detectionStats = useMemo(() => {
    if (!detectionData) return [];
    const scores = detectionData.boxes.map((item) => item.score ?? 0);
    const maxScore = scores.length ? Math.max(...scores) : undefined;
    const avgScore =
      scores.length > 0 ? scores.reduce((acc, cur) => acc + cur, 0) / scores.length : undefined;
    return [
      { label: '识别文本数', value: detectionData.boxes.length },
      { label: '最高置信度', value: maxScore !== undefined ? maxScore.toFixed(3) : '-' },
      { label: '平均置信度', value: avgScore !== undefined ? avgScore.toFixed(3) : '-' },
    ];
  }, [detectionData]);

  const detectionImageUrl =
    formValues.detection_path || formValues.path || formValues.file?.previewUrl || '';

  const aspectRatio = detectionData ? detectionData.height / detectionData.width : 0.65;

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

            {detectionData ? (
              <>
                <Stack spacing={1.5} mb={2}>
                  {detectionStats.map((item) => (
                    <Stack
                      key={item.label}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        {item.label}
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {item.value}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  识别文本预览
                </Typography>
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
                        {value}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
                {formValues.detection_json && (
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
                      {formValues.detection_json}
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

        {detectionData && (
          <Box mt={4}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              文字定位可视化
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              根据检测返回的坐标信息，将文字块精准映射到图片上，方便快速核对识别位置。
            </Typography>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: '#0f172a',
                boxShadow: (theme) => theme.shadows[3],
              }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: `${Math.max(aspectRatio, 0.4) * 100}%`,
                  backgroundImage: detectionImageUrl ? `url(${detectionImageUrl})` : 'none',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}>
                {detectionData.boxes
                  .filter(
                    (item) =>
                      item.box[2] > item.box[0] + 2 && item.box[3] > item.box[1] + 2 && item.text
                  )
                  .map((item, index) => {
                    const [x1, y1, x2, y2] = item.box;
                    const left = (x1 / detectionData.width) * 100;
                    const top = (y1 / detectionData.height) * 100;
                    const width = ((x2 - x1) / detectionData.width) * 100;
                    const height = ((y2 - y1) / detectionData.height) * 100;
                    return (
                      <Box
                        key={`${item.text}-${index}`}
                        sx={{
                          position: 'absolute',
                          left: `${left}%`,
                          top: `${top}%`,
                          width: `${width}%`,
                          height: `${height}%`,
                          border: '1.5px solid rgba(59,130,246,0.95)',
                          borderRadius: 1,
                          backgroundColor: 'rgba(15,23,42,0.35)',
                          color: '#e2e8f0',
                          fontSize: { xs: 10, md: 11 },
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          px: 0.5,
                          py: 0.2,
                          lineHeight: 1.2,
                        }}>
                        {item.text}
                      </Box>
                    );
                  })}
              </Box>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

