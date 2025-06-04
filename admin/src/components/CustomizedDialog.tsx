import React, { useState, useRef, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, DialogProps } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import CloseIcon from '@mui/icons-material/Close';

// 定义Props接口
interface CustomizedDialogProps extends Omit<DialogProps, 'title'> {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

const CustomizedDialog: React.FC<CustomizedDialogProps> = ({ open, onClose, title, children, actions, maxWidth = 'sm' }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const dialogRef = useRef<HTMLDivElement>(null);

  // 切换全屏状态
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    // 重置位置以避免全屏切换后位置偏移
    if (isFullScreen) {
      setPosition({ x: 0, y: 0 });
    }
  };

  // 开始拖拽
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isFullScreen) return; // 全屏时禁用拖拽
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  }, [isFullScreen, position]);

  // 拖拽中
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    });
  }, [isDragging, startPos]);

  // 结束拖拽
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 添加和移除全局鼠标事件
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          transform: !isFullScreen ? `translate(${position.x}px, ${position.y}px)` : undefined,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        },
      }}
      aria-labelledby="draggable-dialog-title"
      maxWidth={isFullScreen ? false : maxWidth}
      fullScreen={isFullScreen}
      sx={{
        '& .MuiDialog-paper': {
          ...(isFullScreen
            ? { width: '100%', height: '100%', m: 0 }
            : { minWidth: '300px' }),
        },
      }}
      ref={dialogRef}
    >
      <DialogTitle
        sx={{ cursor: isFullScreen ? 'default' : 'move', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        id="draggable-dialog-title"
        onMouseDown={handleMouseDown}
      >
        <span>{title}</span>
        <div>
          <IconButton onClick={toggleFullScreen} aria-label="toggle fullscreen">
            {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};

export default CustomizedDialog;