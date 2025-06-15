import React, { useState, useCallback, useEffect } from 'react';
import { Box, Typography, Paper, LinearProgress, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

// 定义文件类型
export interface UploadFile {
  uid: string;
  name: string;
  status: 'uploading' | 'done' | 'error' | 'removed';
  file: File;
  previewUrl?: string; // 用于图片预览
  progress?: number; // 上传进度
}

// 样式定义
const UploadArea = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'width' && prop !== 'height',
})<{ width?: string | number; height?: string | number }>(({ theme, width, height }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  border: '2px dashed #d9d9d9',
  borderRadius: '4px',
  backgroundColor: '#fafafa',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: '#f5f5f5',
  },
  cursor: 'pointer',
  transition: 'all 0.3s',
  width: width || '100%',
  height: height || 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
}));

const PreviewImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  position: 'absolute',
  top: 0,
  left: 0,
});

const DeleteButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
}));

// Upload 组件属性
interface UploadProps {
  accept?: string;
  multiple?: boolean;
  maxCount?: number;
  maxSize?: number; // 文件大小限制，单位 MB
  onChange?: (files: UploadFile[], action: 'upload' | 'remove') => void;
  onProgress?: (uid: string, progress: number) => void; // 新增进度回调
  width?: string | number; // 宽度
  height?: string | number; // 高度
  fileList?: UploadFile[]; // 由父组件控制文件列表
}

const CustomizedFileUpload: React.FC<UploadProps> = ({
  accept = '*',
  multiple = false,
  maxCount = 10,
  maxSize = 10,
  onChange,
  onProgress,
  width,
  height,
  fileList: externalFileList = [],
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>(externalFileList);

  // 同步外部 fileList
  useEffect(() => {
    setFileList(externalFileList);
  }, [externalFileList]);

  // 处理文件选择
  const handleFileChange = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const newFiles: UploadFile[] = Array.from(files).map((file) => ({
        uid: Math.random().toString(36).substring(2),
        name: file.name,
        status: 'uploading' as const,
        file,
        progress: 0,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      }));

      // 验证文件大小和数量
      const validFiles = newFiles.filter((file) => {
        const fileSizeMB = file.file.size / 1024 / 1024;
        if (fileSizeMB > maxSize) {
          alert(`文件 ${file.name} 超过大小限制 (${maxSize}MB)`);
          return false;
        }
        return true;
      });

      // 替换当前文件列表
      const updatedFileList = validFiles.slice(0, maxCount);
      setFileList(updatedFileList);
      onChange?.(updatedFileList, 'upload');

      // 释放旧的预览 URL
      fileList.forEach((file) => {
        if (file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });
    },
    [fileList, maxCount, maxSize, onChange]
  );

  // 处理拖拽上传
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      handleFileChange(e.dataTransfer.files);
    },
    [handleFileChange]
  );

  // 处理文件删除
  const handleRemove = useCallback(() => {
    const updatedFileList = fileList.map((file) => ({ ...file, status: 'removed' as const }));
    const filteredFileList = updatedFileList.filter((file) => file.status !== 'removed');
    setFileList(filteredFileList);
    onChange?.(filteredFileList, 'remove');

    // 释放图片预览 URL
    fileList.forEach((file) => {
      if (file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
    });
  }, [fileList, onChange]);

  // 清理预览 URL
  useEffect(() => {
    return () => {
      fileList.forEach((file) => {
        if (file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });
    };
  }, [fileList]);

  // 检查是否有图片文件用于预览
  const hasImagePreview = fileList.some(
    (file) => file.status === 'done' && file.file.type.startsWith('image/')
  );
  const previewFile = fileList.find(
    (file) => file.status === 'done' && file.file.type.startsWith('image/')
  );

  return (
    <Box>
      <UploadArea
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        elevation={0}
        width={width}
        height={height}
        onClick={() => {
          if (!fileList.some((file) => file.status === 'uploading')) {
            document.getElementById('file-upload')?.click();
          }
        }}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          style={{ display: 'none' }}
          id="file-upload"
          onChange={(e) => handleFileChange(e.target.files)}
        />
        {fileList.some((file) => file.status === 'uploading') ? (
          <Box sx={{ width: '100%', position: 'absolute', top: 0, left: 0 }}>
            <LinearProgress variant="determinate" value={fileList[0]?.progress || 0} />
          </Box>
        ) : hasImagePreview && previewFile?.previewUrl ? (
          <>
            <PreviewImage src={previewFile.previewUrl} alt="Preview" />
            <DeleteButton onClick={(e) => { e.stopPropagation(); handleRemove(); }}>
              <DeleteIcon fontSize="small" />
            </DeleteButton>
          </>
        ) : (
          <>
            <CloudUploadIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
              点击或拖拽文件到此区域上传
            </Typography>
            <Typography variant="caption" color="textSecondary">
              支持 {accept === '*' ? '所有文件类型' : accept}，最大 {maxSize}MB
            </Typography>
          </>
        )}
      </UploadArea>
      {hasImagePreview && previewFile && (
        <Typography
          variant="caption"
          color="textPrimary"
          sx={{
            mt: 1,
            textAlign: 'center',
            display: 'block',
            maxWidth: width || '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {previewFile.name}
        </Typography>
      )}
    </Box>
  );
};

export default CustomizedFileUpload;