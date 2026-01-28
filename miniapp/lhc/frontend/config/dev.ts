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
      open: true
    },
    webpackChain(chain) {
      // 禁用目录列表
      chain.devServer.set('static', {
        directory: false,
        serveIndex: false
      })
    }
  }
}
