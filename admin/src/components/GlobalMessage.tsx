import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

// 事件总线类
class MessageEventBus {
  private listeners: ((message: string, severity: AlertColor, autoHideDuration?: number) => void)[] = [];

  // 订阅事件
  subscribe(listener: (message: string, severity: AlertColor, autoHideDuration?: number) => void) {
    this.listeners.push(listener);
  }

  // 发布事件
  publish(message: string, severity: AlertColor, autoHideDuration?: number) {
    this.listeners.forEach((listener) => listener(message, severity, autoHideDuration));
  }
}

// 全局事件总线实例
export const messageEventBus = new MessageEventBus();

// 定义消息配置的类型
interface MessageConfig {
  open: boolean;
  message: string;
  severity: AlertColor;
  autoHideDuration?: number;
}

// 消息上下文类型
interface MessageContextType {
  showMessage: (message: string, severity?: AlertColor, autoHideDuration?: number) => void;
  hideMessage: () => void;
}

// 创建上下文
const MessageContext = createContext<MessageContextType | undefined>(undefined);

// 消息 Provider 组件
export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messageConfig, setMessageConfig] = useState<MessageConfig>({
    open: false,
    message: '',
    severity: 'info',
    autoHideDuration: 6000,
  });

  const showMessage = (
    message: string,
    severity: AlertColor = 'info',
    autoHideDuration: number = 6000,
  ) => {
    setMessageConfig({
      open: true,
      message,
      severity,
      autoHideDuration,
    });
  };

  const hideMessage = () => {
    setMessageConfig((prev) => ({ ...prev, open: false }));
  };

  // 监听事件总线
  useEffect(() => {
    messageEventBus.subscribe((message, severity, autoHideDuration) => {
      showMessage(message, severity, autoHideDuration);
    });
  }, []);

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    hideMessage();
  };

  return (
    <MessageContext.Provider value={{ showMessage, hideMessage }}>
      {children}
      <Snackbar
        open={messageConfig.open}
        autoHideDuration={messageConfig.autoHideDuration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity={messageConfig.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {messageConfig.message}
        </Alert>
      </Snackbar>
    </MessageContext.Provider>
  );
};

// 自定义 hook 用于访问消息上下文
export const useMessage = (): MessageContextType => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};