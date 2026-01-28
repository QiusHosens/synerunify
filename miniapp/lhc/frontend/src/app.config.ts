export default {
  pages: [
    'pages/index/index',
    'pages/simulation/index',
    'pages/visualization/index',
    'pages/results/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'LHC模拟器',
    navigationBarTextStyle: 'black',
    enablePullDownRefresh: false
  },
  tabBar: {
    color: '#666',
    selectedColor: '#1890ff',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页'
      },
      {
        pagePath: 'pages/simulation/index',
        text: '模拟'
      },
      {
        pagePath: 'pages/visualization/index',
        text: '可视化'
      },
      {
        pagePath: 'pages/results/index',
        text: '结果'
      }
    ]
  }
}
