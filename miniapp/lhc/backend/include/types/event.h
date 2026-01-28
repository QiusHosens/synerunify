#ifndef EVENT_H
#define EVENT_H

#include "particle.h"
#include <chrono>

namespace lhc {

/**
 * 模拟结果
 */
struct SimulationResult {
    std::string simulationId;
    std::string status;  // "running", "completed", "failed"
    int progress;        // 进度百分比 0-100
    std::vector<Event> events;
    std::string message;
    std::chrono::system_clock::time_point startTime;
    std::chrono::system_clock::time_point endTime;
    
    SimulationResult() : progress(0) {}
};

/**
 * 模拟配置
 */
struct SimulationConfig {
    std::string generator;      // "pythia", "sherpa", "madgraph"
    double energy;               // 碰撞能量 (GeV)
    std::string particleType;   // "proton", "electron", "ion"
    int numberOfEvents;         // 事件数量
    
    SimulationConfig() 
        : generator("pythia"), energy(7000.0), 
          particleType("proton"), numberOfEvents(1000) {}
};

} // namespace lhc

#endif // EVENT_H
