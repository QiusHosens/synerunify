// 通用类型定义

export interface Particle {
  id: number
  type: string
  px: number
  py: number
  pz: number
  energy: number
  mass: number
}

export interface Event {
  id: number
  particles: Particle[]
  timestamp: number
}

export interface SimulationConfig {
  generator: 'pythia' | 'sherpa' | 'madgraph'
  energy: number
  particleType: string
  numberOfEvents: number
}
