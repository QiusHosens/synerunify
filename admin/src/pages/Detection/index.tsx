import { detect, DetectRequest } from '@/api/detection';
import { previewSystemFile, uploadSystemFileOss } from '@/api/system_file';
import CustomizedFileUpload, { UploadFile } from '@/components/CustomizedFileUpload';
import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

const parseDetectionVisualization = (width: number, height: number, json: string): DetectionVisualization | null => {
  try {
    const parsed = JSON.parse(json);
    const res = parsed?.res ?? parsed;
    const boxes: Array<[number, number, number, number]> = Array.isArray(res?.rec_boxes)
      ? res.rec_boxes
      : [];
    const texts: string[] = Array.isArray(res?.rec_texts) ? res.rec_texts : [];
    const scores: number[] = Array.isArray(res?.rec_scores) ? res.rec_scores : [];
    const polygons: number[][][] = Array.isArray(res?.rec_polys) ? res.rec_polys : [];

    // const width =
    //   boxes.reduce((max, box) => {
    //     if (!Array.isArray(box)) return max;
    //     return Math.max(max, box[0] ?? 0, box[2] ?? 0);
    //   }, 0) || 1;
    // const height =
    //   boxes.reduce((max, box) => {
    //     if (!Array.isArray(box)) return max;
    //     return Math.max(max, box[1] ?? 0, box[3] ?? 0);
    //   }, 0) || 1;

    const detectionBoxes: DetectionBox[] = texts.map((text, index) => ({
      text,
      score: typeof scores[index] === 'number' ? scores[index] : undefined,
      box: Array.isArray(boxes[index]) ? boxes[index] : [0, 0, 0, 0],
      polygon: Array.isArray(polygons[index]) ? polygons[index] : undefined,
    }));

    const filteredDetectionBoxes = detectionBoxes.filter(item => (item.score && item.score >= 0.8 && item.text.trim() !== ''));

    return {
      width,
      height,
      boxes: filteredDetectionBoxes,
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

// 测量文字宽度
const measureTextWidth = (text: string, fontSize: number, fontFamily = 'sans-serif'): number => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return text.length * fontSize * 0.6; // 备用估算值
  
  context.font = `${fontSize}px ${fontFamily}`;
  return context.measureText(text).width;
};

// 根据区域高度计算合适的字体大小
const calculateFontSizeByHeight = (
  boxHeightPx: number,
  paddingY: number = 4, // px 总的上下 padding（上下各 paddingY/2）
  minFontSize: number = 8,
  maxFontSize: number = 40
): number => {
  const availableHeight = boxHeightPx - paddingY;
  if (availableHeight <= 0) return minFontSize;
  // 根据高度估算字体大小（通常行高为字体大小的1.2倍）
  const fontSize = Math.min(maxFontSize, Math.max(minFontSize, availableHeight / 1.2));
  return fontSize * 0.95; // 留 5% 余量
};

// 根据区域宽度计算合适的字体大小（估算，通过文字长度）
const calculateFontSizeByWidth = (
  text: string,
  boxWidthPx: number,
  paddingX: number = 8, // px 总的左右 padding（左右各 paddingX/2）
  minFontSize: number = 8,
  maxFontSize: number = 40
): number => {
  const availableWidth = boxWidthPx - paddingX;
  if (availableWidth <= 0) return minFontSize;
  
  // 使用二分查找找到合适的字体大小
  let min = minFontSize;
  let max = maxFontSize;
  let fontSize = min;
  
  // 最多迭代 20 次
  for (let i = 0; i < 20; i++) {
    fontSize = (min + max) / 2;
    const textWidth = measureTextWidth(text, fontSize);
    
    if (textWidth <= availableWidth) {
      min = fontSize;
      if (max - min < 0.1) break; // 精度足够
    } else {
      max = fontSize;
    }
  }
  
  return Math.max(minFontSize, Math.min(maxFontSize, fontSize * 0.95)); // 留 5% 余量
};

// 计算文字宽度，并返回所需的宽度比例（如果宽度不够）
const calculateWidthScale = (
  text: string,
  fontSize: number,
  boxWidthPx: number,
  paddingX: number = 8 // px 左右的 padding（0.5 * 2 * 8px = 8px，因为 MUI 的 spacing 单位通常是 8px）
): number => {
  const availableWidth = boxWidthPx - paddingX;
  const textWidth = measureTextWidth(text, fontSize);
  
  // 如果文字宽度超过可用宽度，计算需要的扩大比例
  if (textWidth > availableWidth) {
    // 确保有足够的空间显示文字，加上 padding
    return (textWidth + paddingX) / boxWidthPx;
  }
  
  return 1; // 不需要扩大
};

export default function Detection() {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<FormValues>({
    path: '',
  });

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [detectionData, setDetectionData] = useState<DetectionVisualization | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(960); // 默认值，会在 useEffect 中更新
  const visualizationContainerRef = useRef<HTMLDivElement>(null);

  const handleBackToLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const uploadFile = useCallback(async (file: UploadFile | null) => {
    try {
      // const response = (await uploadSystemFileOss(file.file, (progress) => {
      //   setFormValues((prev) => {
      //     if (!prev.file) return prev;
      //     return { ...prev, file: { ...prev.file, progress } };
      //   });
      // })) as string;
      const response = 'synerunify/2025/11/14/115096784300150784_invoice.jpg';

      const path = response;
      const path_array = path.split('/').slice(0, -1);
      path_array.splice(1, 0, 'detection');
      const outputDir = path_array.join('/');
      const detectionRequest: DetectRequest = {
        source_file: response,
        output_dir: outputDir,
      };
      // const detectionResponse = await detect(detectionRequest);
      const detectionResponse = {
        height: 1180,
        json: "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",
        path: "synerunify/detection/2025/11/14/115086440643170304_invoice_17631286138342.png",
        width: 1831
      };
      const decompressedJson = await decompressDetectionJson(detectionResponse.json);
      const parsedDetection = parseDetectionVisualization(detectionResponse.width, detectionResponse.height, decompressedJson);

      const detection_path = detectionResponse.path.split('/').slice(1).join('/');
      setFormValues((prev) => ({
        ...prev,
        path,
        detection_path: detection_path,
        detection_json: decompressedJson,
        file: prev.file ? { ...prev.file, status: 'done' } : prev.file,
      }));
      setDetectionData(parsedDetection ?? null);
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
          detection_path: undefined,
          detection_json: undefined,
        }));
        setDetectionData(null);

        await uploadFile(file);
      } else if (action === 'remove') {
        setFormValues(() => ({
          path: '',
          file: undefined,
          detection_path: undefined,
          detection_json: undefined,
        }));
        setDetectionData(null);
      }
    },
    [uploadFile]
  );

  const detectionEntries = useMemo(() => {
    if (!detectionData) return [];
    // return detectionData.boxes.slice(0, 6).map((item, index) => ({
    //   key: `文本 ${index + 1}`,
    //   value: `${item.text || '-'}  (score ${(item.score ?? 0).toFixed(3)})`,
    // }));
    return detectionData.boxes.filter(item => (item.score && item.score >= 0.8 && (item.text.includes(':') || item.text.includes('：')))).map((item) => {
      const text = item.text.replace('：', ':')
      const strs = text.split(':');
      return {
        key: strs[0].replace(/\s/g, ''),
        value: strs[1].replace(/\s/g, '')
      }
    });
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
    previewSystemFile(formValues.detection_path || formValues.path || formValues.file?.previewUrl || '');

  const aspectRatio = detectionData ? detectionData.height / detectionData.width : 0.65;

  // 监听容器宽度变化
  useEffect(() => {
    const container = visualizationContainerRef.current;
    if (!container) return;

    const updateWidth = () => {
      setContainerWidth(container.offsetWidth);
    };

    // 初始设置
    updateWidth();

    // 使用 ResizeObserver 监听容器大小变化
    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [detectionData]);

  // 使用 useMemo 缓存字体大小计算，避免重复计算导致闪烁
  const boxFontSizes = useMemo(() => {
    if (!detectionData || containerWidth === 0) return new Map();

    const fontSizeMap = new Map<string, number>();

    detectionData.boxes
      .filter((item) => item.box[2] > item.box[0] + 2 && item.box[3] > item.box[1] + 2 && item.text)
      .forEach((item) => {
        const [x1, y1, x2, y2] = item.box;
        const widthPercent = ((x2 - x1) / detectionData.width) * 100;
        const heightPercent = ((y2 - y1) / detectionData.height) * 100;
        
        // 计算 box 的实际像素尺寸（基于容器宽度，不使用缩放）
        const boxWidthPx = (containerWidth * widthPercent) / 100;
        const boxHeightPx = (containerWidth * aspectRatio * heightPercent) / 100;
        
        // 计算实际的 padding
        const paddingXTotal = 8; // 左右总 padding
        const paddingYTotal = 4; // 上下总 padding
        
        // 计算可用空间
        const availableWidth = boxWidthPx - paddingXTotal;
        const availableHeight = boxHeightPx - paddingYTotal;
        
        // 根据宽度计算字体大小
        const fontSizeByWidth = calculateFontSizeByWidth(item.text, boxWidthPx, paddingXTotal);
        
        // 根据高度计算字体大小
        const fontSizeByHeight = calculateFontSizeByHeight(boxHeightPx, paddingYTotal);
        
        // 取两者较小值
        let fontSize = Math.min(fontSizeByWidth, fontSizeByHeight);
        
        // 最后验证：确保文字完全在框内
        const finalTextWidth = measureTextWidth(item.text, fontSize);
        const finalTextHeight = fontSize * 1.2;
        
        if (finalTextWidth > availableWidth) {
          fontSize = Math.max(8, (availableWidth / finalTextWidth) * fontSize * 0.95);
        }
        if (finalTextHeight > availableHeight) {
          fontSize = Math.max(8, (availableHeight / finalTextHeight) * fontSize * 0.95);
        }
        
        fontSizeMap.set(`${item.text}-${x1}-${y1}`, fontSize);
      });

    return fontSizeMap;
  }, [detectionData, containerWidth, aspectRatio]);

  useEffect(() => {
    uploadFile(null);
  }, [uploadFile]);

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
              图片识别
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              上传任意图片，系统会自动识别并返回识别结果
            </Typography>
          </Box>
          <Button variant="outlined" onClick={handleBackToLogin}>
            返回登录
          </Button>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Box flex={1}>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              上传识别图片
            </Typography>
            {/* <Typography variant="body2" color="text.secondary" mb={2}>
              支持 PNG / JPG / JPEG，单个文件不超过 100 MB。上传后可点击图片进行放大查看。
            </Typography> */}
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
              识别结果
            </Typography>
            {/* <Typography variant="body2" color="text.secondary" mb={2}>
              上传成功后将在此处展示解析后的关键指标
            </Typography> */}

            {detectionData ? (
              <>
                {/* <Stack spacing={1.5} mb={2}>
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
                <Divider sx={{ my: 2 }} /> */}
                {/* <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  识别文本预览
                </Typography> */}
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
                {/* {formValues.detection_json && (
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
                )} */}
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
              ref={visualizationContainerRef}
              sx={{
                position: 'relative',
                width: '100%',
                borderRadius: 3,
                overflow: 'visible',
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: '#0f172a',
                boxShadow: (theme) => theme.shadows[3],
                margin: '0 auto',
              }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: `${Math.max(aspectRatio, 0.4) * 100}%`,
                  // backgroundImage: detectionImageUrl ? `url(${detectionImageUrl})` : 'none',
                  // backgroundSize: 'contain',
                  // backgroundRepeat: 'no-repeat',
                  // backgroundPosition: 'center',
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
                    const widthPercent = ((x2 - x1) / detectionData.width) * 100;
                    const heightPercent = ((y2 - y1) / detectionData.height) * 100;
                    
                    // 判断是否为竖长区域
                    const boxWidth = x2 - x1;
                    const boxHeight = y2 - y1;
                    const isVerticalBox = boxHeight > boxWidth;
                    const isHorizontalBox = boxWidth > boxHeight;
                    
                    // 从缓存的 Map 中获取字体大小
                    const fontSize = boxFontSizes.get(`${item.text}-${x1}-${y1}`) || 12;
                    
                    // 根据宽高比设置对齐方式
                    // width > height: 上下居中对齐，向左对齐
                    // 否则: 左右居中对齐，向上对齐
                    const alignItems = isHorizontalBox ? 'center' : 'flex-start';
                    const justifyContent = isHorizontalBox ? 'flex-start' : 'center';
                    const textAlign = isHorizontalBox ? 'left' : 'center';
                    
                    return (
                      <Box
                        key={`${item.text}-${index}`}
                        sx={{
                          position: 'absolute',
                          left: `${left}%`,
                          top: `${top}%`,
                          width: `${widthPercent}%`,
                          height: `${heightPercent}%`,
                          border: '1.5px solid rgba(59,130,246,0.95)',
                          borderRadius: 1,
                          backgroundColor: 'rgba(15,23,42,0.35)',
                          color: '#e2e8f0',
                          fontSize: `${fontSize}px`,
                          display: 'flex',
                          alignItems,
                          justifyContent,
                          textAlign,
                          lineHeight: 1.2,
                          whiteSpace: isVerticalBox ? 'normal' : 'nowrap',
                          overflow: 'visible',
                          wordBreak: isVerticalBox ? 'break-word' : 'normal',
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

