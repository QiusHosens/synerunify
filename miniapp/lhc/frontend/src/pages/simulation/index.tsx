import { Component } from 'react'
import { View, Text, Input, Button, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { simulationService } from '@/services/simulation'
import './index.scss'

interface State {
  generator: string
  energy: string
  particleType: string
  isRunning: boolean
  progress: number
}

export default class Simulation extends Component<{}, State> {
  state: State = {
    generator: 'pythia',
    energy: '7000',
    particleType: 'proton',
    isRunning: false,
    progress: 0
  }

  generatorOptions = ['pythia', 'sherpa', 'madgraph']
  particleOptions = ['proton', 'electron', 'ion']

  handleGeneratorChange = (e: any) => {
    this.setState({ generator: this.generatorOptions[e.detail.value] })
  }

  handleEnergyChange = (e: any) => {
    this.setState({ energy: e.detail.value })
  }

  handleParticleChange = (e: any) => {
    this.setState({ particleType: this.particleOptions[e.detail.value] })
  }

  handleStartSimulation = async () => {
    const { generator, energy, particleType } = this.state
    
    this.setState({ isRunning: true, progress: 0 })

    try {
      const result = await simulationService.startSimulation({
        generator,
        energy: parseFloat(energy),
        particleType
      })

      Taro.showToast({
        title: '模拟启动成功',
        icon: 'success'
      })

      // 监听进度
      this.monitorProgress(result.simulationId)
    } catch (error) {
      Taro.showToast({
        title: '模拟启动失败',
        icon: 'error'
      })
      this.setState({ isRunning: false })
    }
  }

  monitorProgress = async (simulationId: string) => {
    const interval = setInterval(async () => {
      try {
        const status = await simulationService.getStatus(simulationId)
        this.setState({ progress: status.progress })

        if (status.status === 'completed') {
          clearInterval(interval)
          this.setState({ isRunning: false, progress: 100 })
          Taro.navigateTo({
            url: `/pages/results/index?id=${simulationId}`
          })
        } else if (status.status === 'failed') {
          clearInterval(interval)
          this.setState({ isRunning: false })
          Taro.showToast({
            title: '模拟失败',
            icon: 'error'
          })
        }
      } catch (error) {
        clearInterval(interval)
        this.setState({ isRunning: false })
      }
    }, 1000)
  }

  render () {
    const { generator, energy, particleType, isRunning, progress } = this.state

    return (
      <View className='simulation'>
        <View className='form'>
          <View className='form-item'>
            <Text className='label'>事件生成器</Text>
            <Picker
              mode='selector'
              range={this.generatorOptions}
              value={this.generatorOptions.indexOf(generator)}
              onChange={this.handleGeneratorChange}
            >
              <View className='picker'>
                {generator.toUpperCase()}
              </View>
            </Picker>
          </View>

          <View className='form-item'>
            <Text className='label'>碰撞能量 (GeV)</Text>
            <Input
              type='number'
              value={energy}
              onInput={this.handleEnergyChange}
              placeholder='输入能量值'
            />
          </View>

          <View className='form-item'>
            <Text className='label'>粒子类型</Text>
            <Picker
              mode='selector'
              range={this.particleOptions}
              value={this.particleOptions.indexOf(particleType)}
              onChange={this.handleParticleChange}
            >
              <View className='picker'>
                {particleType}
              </View>
            </Picker>
          </View>

          {isRunning && (
            <View className='progress-container'>
              <Text className='progress-text'>模拟进度: {progress}%</Text>
              <View className='progress-bar'>
                <View 
                  className='progress-fill' 
                  style={{ width: `${progress}%` }}
                />
              </View>
            </View>
          )}

          <Button
            className='start-button'
            onClick={this.handleStartSimulation}
            disabled={isRunning}
          >
            {isRunning ? '模拟运行中...' : '开始模拟'}
          </Button>
        </View>
      </View>
    )
  }
}
