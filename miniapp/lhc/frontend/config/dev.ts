export default {
  logger: {
    quiet: false,
    stats: true
  },
  mini: {},
  h5: {
    devServer: {
      port: 10086,
      host: 'localhost',
      open: true,
      historyApiFallback: {
        index: '/index.html',
        disableDotRule: true
      },
      static: {
        directory: false // 禁用静态文件服务，使用webpack的内存文件系统
      }
    }
  }
}
