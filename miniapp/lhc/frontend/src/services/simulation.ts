import Taro from '@tarojs/taro'
import { apiBaseUrl } from '@/utils/config'

export interface SimulationParams {
  generator: 'pythia' | 'sherpa' | 'madgraph'
  energy: number
  particleType: string
}

export interface SimulationResult {
  simulationId: string
  status: string
}

export interface SimulationStatus {
  status: 'running' | 'completed' | 'failed'
  progress: number
  message?: string
}

class SimulationService {
  async startSimulation(params: SimulationParams): Promise<SimulationResult> {
    const response = await Taro.request({
      url: `${apiBaseUrl}/api/simulation/start`,
      method: 'POST',
      data: params,
      header: {
        'Content-Type': 'application/json'
      }
    })

    if (response.statusCode === 200) {
      return response.data as SimulationResult
    }
    throw new Error('启动模拟失败')
  }

  async getStatus(simulationId: string): Promise<SimulationStatus> {
    const response = await Taro.request({
      url: `${apiBaseUrl}/api/simulation/status/${simulationId}`,
      method: 'GET'
    })

    if (response.statusCode === 200) {
      return response.data as SimulationStatus
    }
    throw new Error('获取状态失败')
  }

  async stopSimulation(simulationId: string): Promise<void> {
    await Taro.request({
      url: `${apiBaseUrl}/api/simulation/stop/${simulationId}`,
      method: 'POST'
    })
  }
}

export const simulationService = new SimulationService()
