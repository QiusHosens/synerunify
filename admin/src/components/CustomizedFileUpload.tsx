import React, { useEffect, useCallback, useRef } from 'react';
import { Box, Typography, Paper, LinearProgress, IconButton, Button } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@/assets/image/svg/delete.svg';

// 定义文件类型
export interface UploadFile {
    uid: string;
    name: string;
    filename: string; // 去掉扩展名的文件名字
    status: 'uploading' | 'done' | 'error' | 'removed';
    file: File;
    previewUrl?: string; // 用于本地图片预览
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
        '& .file-upload-delete': {
            display: 'inline-flex'
        }
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
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    color: theme.palette.error.main,
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.4),
    },
}));

// Upload 组件属性
interface UploadProps {
    id?: string;
    accept?: string;
    maxSize?: number; // 文件大小限制，单位 MB
    onChange?: (file: UploadFile | null, action: 'upload' | 'remove') => void;
    file?: UploadFile | null; // 外部控制的单个文件
    width?: string | number; // 宽度
    height?: string | number; // 高度
    children?: React.ReactNode; // 上传完成后的内容（例如远程图片）
}

const CustomizedFileUpload: React.FC<UploadProps> = ({
    id = 'file-upload',
    accept = '*',
    maxSize = 10,
    onChange,
    file = null,
    width,
    height,
    children,
}) => {
    // 使用 useRef 跟踪当前 blob URL
    const blobUrlRef = useRef<string | null>(null);

    // 处理文件选择
    const handleFileChange = useCallback(
        (files: FileList | null) => {
            if (!files || files.length === 0) return;

            const selectedFile = files[0];
            const fileSizeMB = selectedFile.size / 1024 / 1024;
            if (fileSizeMB > maxSize) {
                alert(`文件 ${selectedFile.name} 超过大小限制 (${maxSize}MB)`);
                return;
            }

            // 释放旧的 blob URL
            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current);
                blobUrlRef.current = null;
            }

            const filename = selectedFile.name.indexOf('.') > 0 ? selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) : selectedFile.name;

            const newFile: UploadFile = {
                uid: Math.random().toString(36).substring(2),
                name: selectedFile.name,
                filename,
                status: 'uploading',
                file: selectedFile,
                progress: 0,
                previewUrl: selectedFile.type.startsWith('image/') ? URL.createObjectURL(selectedFile) : undefined,
            };

            // 保存新的 blob URL
            if (newFile.previewUrl) {
                blobUrlRef.current = newFile.previewUrl;
            }

            onChange?.(newFile, 'upload');
        },
        [maxSize, onChange]
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
        if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current);
            blobUrlRef.current = null;
        }
        onChange?.(null, 'remove');
    }, [onChange]);

    // 清理 blob URL
    useEffect(() => {
        return () => {
            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current);
                blobUrlRef.current = null;
            }
        };
    }, []);

    return (
        <Box>
            <UploadArea
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                elevation={0}
                width={width}
                height={height}
                onClick={() => {
                    if (file?.status !== 'uploading') {
                        document.getElementById(id)?.click();
                    }
                }}
            >
                <input
                    type="file"
                    accept={accept}
                    multiple={false}
                    style={{ display: 'none' }}
                    id={id}
                    onChange={(e) => handleFileChange(e.target.files)}
                />
                {file?.status === 'uploading' && file?.previewUrl ? (
                    <>
                        <PreviewImage src={file.previewUrl} />
                        <Box sx={{ width: '100%', position: 'absolute', top: 0, left: 0 }}>
                            <LinearProgress variant="determinate" value={file.progress || 0} />
                        </Box>
                        <Typography
                            variant="caption"
                            color="textPrimary"
                            sx={{ position: 'absolute', bottom: 8, maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                            {file.filename}
                        </Typography>
                    </>
                ) : file?.status === 'done' ? (
                    <>
                        {/* {children} */}
                        <PreviewImage src={file.previewUrl} />
                        <DeleteButton className='file-upload-delete' sx={{ display: 'none' }} onClick={(e) => { e.stopPropagation(); handleRemove(); }}>
                            <DeleteIcon fontSize="small" />
                        </DeleteButton>

                        <Typography
                            variant="caption"
                            color="textPrimary"
                            sx={{ position: 'absolute', bottom: 8, maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                            {file.filename}
                        </Typography>
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
            {/* {file?.status === 'done' && (
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
                    {file.name}
                </Typography>
            )} */}
        </Box>
    );
};

export default CustomizedFileUpload;