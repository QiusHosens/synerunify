// 临时测试文件 - 用于验证页面是否能正常渲染
import { Component } from 'react'
import { View, Text } from '@tarojs/components'

export default class TestIndex extends Component {
  render() {
    return (
      <View style={{ padding: '20px', background: '#fff' }}>
        <Text style={{ fontSize: '24px', color: '#333' }}>
          测试页面 - 如果你看到这个，说明页面可以正常渲染
        </Text>
      </View>
    )
  }
}
