// API配置
export const apiBaseUrl = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8080'  // 开发环境
  : 'https://api.lhc-simulator.com'  // 生产环境

// WebSocket配置
export const wsBaseUrl = process.env.NODE_ENV === 'development'
  ? 'ws://localhost:8080'
  : 'wss://api.lhc-simulator.com'
