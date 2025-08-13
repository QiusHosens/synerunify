import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Box, Typography, Paper, LinearProgress, IconButton, Modal, Backdrop, Fade } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { useTranslation } from 'react-i18next';
import { useMessage } from './GlobalMessage';

// 定义文件类型
export interface UploadFile {
    uid: string;
    name: string;
    filename: string;
    status: 'uploading' | 'done' | 'error' | 'removed';
    file: File;
    previewUrl?: string;
    progress?: number;
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

const EnlargedImage = styled('img')({
    maxWidth: 'none',
    maxHeight: 'none',
    objectFit: 'contain',
    userSelect: 'none',
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

// Download属性
export interface DownloadProps {
    filename?: string;
    previewUrl?: string;
    status: 'downloading' | 'done' | 'error';
    progress?: number;
}

// Upload 组件属性
interface UploadProps {
    canUpload?: boolean;
    canRemove?: boolean;
    showFilename?: boolean;
    id?: string;
    accept?: string;
    maxSize?: number;
    onChange?: (file: UploadFile | null, action: 'upload' | 'remove') => void;
    file?: UploadFile | null;
    width?: string | number;
    height?: string | number;
    download?: DownloadProps;
}

const CustomizedFileUpload: React.FC<UploadProps> = ({
    canUpload = true,
    canRemove = true,
    showFilename = true,
    id = 'file-upload',
    accept = '*',
    maxSize = 10,
    onChange,
    file = null,
    width,
    height,
    download,
}) => {
    const { t } = useTranslation();
    const { showMessage } = useMessage();
    const blobUrlRef = useRef<string | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const imageRef = useRef<HTMLImageElement | null>(null);

    // 处理文件选择
    const handleFileChange = useCallback(
        (files: FileList | null) => {
            if (!files || files.length === 0) return;

            const selectedFile = files[0];
            const fileSizeMB = selectedFile.size / 1024 / 1024;
            if (fileSizeMB > maxSize) {
                showMessage(t('global.helper.file.limit', { name: selectedFile.name, size: maxSize }));
                return;
            }

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

            if (newFile.previewUrl) {
                blobUrlRef.current = newFile.previewUrl;
            }

            onChange?.(newFile, 'upload');
        },
        [maxSize, onChange, showMessage, t]
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

    // 处理双击放大图片
    const handleDoubleClick = useCallback(() => {
        if ((file?.status === 'done' && file?.previewUrl) || (download?.status === 'done' && download?.previewUrl)) {
            setOpenModal(true);
            setZoom(1); // 重置缩放
            setPosition({ x: 0, y: 0 }); // 重置位置
        }
    }, [file, download]);

    // 关闭模态框
    const handleCloseModal = useCallback(() => {
        setOpenModal(false);
        setZoom(1); // 重置缩放
        setPosition({ x: 0, y: 0 }); // 重置位置
    }, []);

    // 处理鼠标滚轮缩放
    const handleWheel = useCallback((e: React.WheelEvent) => {
        // e.preventDefault();
        const zoomStep = 0.1;
        const minZoom = 0.5;
        const maxZoom = 3;
        setZoom((prevZoom) => {
            const newZoom = prevZoom - (e.deltaY > 0 ? zoomStep : -zoomStep);
            return Math.min(Math.max(newZoom, minZoom), maxZoom);
        });
    }, []);

    // 开始拖动
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (zoom > 1) { // 只有在放大时允许拖动
            setIsDragging(true);
            dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
        }
    }, [zoom, position]);

    // 拖动中
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        console.log("is dragging", isDragging);
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStartRef.current.x,
                y: e.clientY - dragStartRef.current.y,
            });
        }
    }, [isDragging]);

    // 结束拖动
    const handleMouseUp = useCallback(() => {
        console.log("mouse up");
        setIsDragging(false);
    }, []);

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
                    if (canUpload && (!file || file?.status !== 'uploading')) {
                        document.getElementById(id)?.click();
                    }
                }}
                onDoubleClick={handleDoubleClick}
            >
                <input
                    type="file"
                    accept={accept}
                    multiple={false}
                    style={{ display: 'none' }}
                    id={id}
                    onChange={(e) => handleFileChange(e.target.files)}
                />
                {(download && download?.status === 'downloading') ? (
                    <>
                        <Box sx={{ width: '100%', position: 'absolute', top: 0, left: 0 }}>
                            <LinearProgress variant="determinate" value={download.progress || 0} />
                        </Box>
                        {showFilename && <Typography
                            variant="caption"
                            color="textPrimary"
                            sx={{ position: 'absolute', bottom: 8, maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                            {download.filename}
                        </Typography>}
                    </>
                ) : (download && download?.status === 'done') ? (
                    <>
                        <PreviewImage src={download.previewUrl} />
                        {canRemove && <DeleteButton className='file-upload-delete' sx={{ display: 'none' }} onClick={(e) => { e.stopPropagation(); handleRemove(); }}>
                            <DeleteIcon fontSize="small" />
                        </DeleteButton>}
                        {showFilename && <Typography
                            variant="caption"
                            color="textPrimary"
                            sx={{ position: 'absolute', bottom: 8, maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                            {download.filename}
                        </Typography>}
                    </>
                ) : file?.status === 'uploading' && file?.previewUrl ? (
                    <>
                        <PreviewImage src={file.previewUrl} />
                        <Box sx={{ width: '100%', position: 'absolute', top: 0, left: 0 }}>
                            <LinearProgress variant="determinate" value={file.progress || 0} />
                        </Box>
                        {showFilename && <Typography
                            variant="caption"
                            color="textPrimary"
                            sx={{ position: 'absolute', bottom: 8, maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                            {file.filename}
                        </Typography>}
                    </>
                ) : file?.status === 'done' ? (
                    <>
                        <PreviewImage src={file.previewUrl} />
                        {canRemove && <DeleteButton className='file-upload-delete' sx={{ display: 'none' }} onClick={(e) => { e.stopPropagation(); handleRemove(); }}>
                            <DeleteIcon fontSize="small" />
                        </DeleteButton>}
                        {showFilename && <Typography
                            variant="caption"
                            color="textPrimary"
                            sx={{ position: 'absolute', bottom: 8, maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                            {file.filename}
                        </Typography>}
                    </>
                ) : (
                    <>
                        <CloudUploadIcon color="primary" sx={{ fontSize: 40 }} />
                        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                            {t('global.helper.file.upload.type')}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            {t('global.helper.file.upload.support', { type: accept === "*" ? t('global.helper.file.upload.support.all') : accept, size: maxSize })}
                        </Typography>
                    </>
                )}
            </UploadArea>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={openModal}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            maxWidth: '90vw',
                            maxHeight: '90vh',
                            overflow: 'hidden',
                            cursor: isDragging ? 'grabbing' : zoom > 1 ? 'grab' : 'default',
                        }}
                        onWheel={handleWheel}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        <EnlargedImage
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            ref={imageRef}
                            src={file?.previewUrl || download?.previewUrl}
                            sx={{
                                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                                transition: isDragging ? 'none' : 'transform 0.2s',
                            }}
                        />
                    </Box>
                </Fade>
            </Modal>
        </Box >
    );
};

export default CustomizedFileUpload;