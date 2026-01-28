#ifndef EVENT_PROCESSOR_H
#define EVENT_PROCESSOR_H

#include "../types/event.h"
#include "../generator/generator.h"
#include "../simulation/simulator.h"
#include "analyzer.h"
#include <memory>
#include <string>

namespace lhc {

/**
 * 事件处理器
 * 协调生成器、模拟器和分析器的工作流程
 */
class EventProcessor {
public:
    EventProcessor();
    ~EventProcessor();
    
    /**
     * 设置生成器
     */
    void setGenerator(std::unique_ptr<Generator> generator);
    
    /**
     * 设置模拟器
     */
    void setSimulator(std::unique_ptr<Simulator> simulator);
    
    /**
     * 设置分析器
     */
    void setAnalyzer(std::unique_ptr<Analyzer> analyzer);
    
    /**
     * 处理完整流程：生成 -> 模拟 -> 分析
     */
    SimulationResult processSimulation(const SimulationConfig& config);
    
    /**
     * 设置进度回调
     */
    void setProgressCallback(std::function<void(int)> callback);
    
private:
    std::unique_ptr<Generator> generator_;
    std::unique_ptr<Simulator> simulator_;
    std::unique_ptr<Analyzer> analyzer_;
    std::function<void(int)> progressCallback_;
    
    std::string generateSimulationId();
};

} // namespace lhc

#endif // EVENT_PROCESSOR_H
