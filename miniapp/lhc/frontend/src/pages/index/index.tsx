import { Component } from 'react'
import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () {
    console.log('Index page mounted')
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleStartSimulation = () => {
    Taro.navigateTo({
      url: '/pages/simulation/index'
    })
  }

  render () {
    console.log('Index render called')
    return (
      <View className='index'>
        <View className='header'>
          <Text className='title'>LHC 粒子对撞机模拟器</Text>
          <Text className='subtitle'>基于ATLAS框架的物理模拟系统</Text>
        </View>
        
        <View className='features'>
          <View className='feature-item'>
            <Text className='feature-title'>事件生成</Text>
            <Text className='feature-desc'>Pythia/Sherpa/MadGraph</Text>
          </View>
          <View className='feature-item'>
            <Text className='feature-title'>物理模拟</Text>
            <Text className='feature-desc'>Geant4引擎</Text>
          </View>
          <View className='feature-item'>
            <Text className='feature-title'>数据分析</Text>
            <Text className='feature-desc'>Athena框架</Text>
          </View>
        </View>

        <View className='actions'>
          <Button 
            className='primary-button' 
            onClick={this.handleStartSimulation}
          >
            开始模拟
          </Button>
          <Button 
            className='secondary-button'
            onClick={() => Taro.navigateTo({ url: '/pages/results/index' })}
          >
            查看结果
          </Button>
        </View>
      </View>
    )
  }
}
