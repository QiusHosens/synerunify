import Taro from '@tarojs/taro'
import { apiBaseUrl } from '@/utils/config'

export interface ResultItem {
  id: string
  generator: string
  energy: number
  particleType: string
  eventCount: number
  timestamp: string
}

class ResultsService {
  async getResults(): Promise<ResultItem[]> {
    const response = await Taro.request({
      url: `${apiBaseUrl}/api/results`,
      method: 'GET'
    })

    if (response.statusCode === 200) {
      return response.data as ResultItem[]
    }
    throw new Error('获取结果失败')
  }

  async getResultDetail(resultId: string): Promise<any> {
    const response = await Taro.request({
      url: `${apiBaseUrl}/api/results/${resultId}`,
      method: 'GET'
    })

    if (response.statusCode === 200) {
      return response.data
    }
    throw new Error('获取详情失败')
  }
}

export const resultsService = new ResultsService()
