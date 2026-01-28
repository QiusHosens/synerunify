import { Component } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { resultsService } from '@/services/results'
import './index.scss'

interface State {
  results: any[]
  loading: boolean
}

export default class Results extends Component<{}, State> {
  state: State = {
    results: [],
    loading: true
  }

  componentDidMount() {
    this.loadResults()
  }

  loadResults = async () => {
    try {
      const results = await resultsService.getResults()
      this.setState({ results, loading: false })
    } catch (error) {
      Taro.showToast({
        title: '加载失败',
        icon: 'error'
      })
      this.setState({ loading: false })
    }
  }

  render() {
    const { results, loading } = this.state

    return (
      <View className='results'>
        <View className='header'>
          <Text className='title'>模拟结果</Text>
        </View>

        {loading ? (
          <View className='loading'>
            <Text>加载中...</Text>
          </View>
        ) : (
          <ScrollView className='results-list' scrollY>
            {results.length === 0 ? (
              <View className='empty'>
                <Text>暂无结果</Text>
              </View>
            ) : (
              results.map((result, index) => (
                <View key={index} className='result-item'>
                  <View className='result-header'>
                    <Text className='result-title'>模拟 #{result.id}</Text>
                    <Text className='result-time'>{result.timestamp}</Text>
                  </View>
                  <View className='result-content'>
                    <View className='result-stat'>
                      <Text className='stat-label'>生成器:</Text>
                      <Text className='stat-value'>{result.generator}</Text>
                    </View>
                    <View className='result-stat'>
                      <Text className='stat-label'>能量:</Text>
                      <Text className='stat-value'>{result.energy} GeV</Text>
                    </View>
                    <View className='result-stat'>
                      <Text className='stat-label'>事件数:</Text>
                      <Text className='stat-value'>{result.eventCount}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </View>
    )
  }
}
