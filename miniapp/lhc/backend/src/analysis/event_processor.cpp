#include "../include/analysis/event_processor.h"
#include "../include/utils/logger.h"
#include <sstream>
#include <iomanip>
#include <chrono>
#include <thread>

namespace lhc {

EventProcessor::EventProcessor() {
}

EventProcessor::~EventProcessor() {
}

void EventProcessor::setGenerator(std::unique_ptr<Generator> generator) {
    generator_ = std::move(generator);
}

void EventProcessor::setSimulator(std::unique_ptr<Simulator> simulator) {
    simulator_ = std::move(simulator);
}

void EventProcessor::setAnalyzer(std::unique_ptr<Analyzer> analyzer) {
    analyzer_ = std::move(analyzer);
}

SimulationResult EventProcessor::processSimulation(const SimulationConfig& config) {
    SimulationResult result;
    result.simulationId = generateSimulationId();
    result.status = "running";
    result.progress = 0;
    result.startTime = std::chrono::system_clock::now();
    
    try {
        // 初始化生成器
        if (!generator_ || !generator_->initialize(config.energy, config.particleType)) {
            result.status = "failed";
            result.message = "Failed to initialize generator";
            return result;
        }
        
        // 初始化模拟器
        if (!simulator_ || !simulator_->initialize()) {
            result.status = "failed";
            result.message = "Failed to initialize simulator";
            return result;
        }
        
        // 设置进度回调
        if (simulator_) {
            simulator_->setProgressCallback([this, &result](int progress) {
                result.progress = progress;
                if (progressCallback_) {
                    progressCallback_(progress);
                }
            });
        }
        
        // 初始化分析器
        if (analyzer_) {
            analyzer_->reset();
        }
        
        // 生成和模拟事件
        int totalEvents = config.numberOfEvents;
        std::vector<Event> simulatedEvents;
        simulatedEvents.reserve(totalEvents);
        
        for (int i = 0; i < totalEvents; ++i) {
            // 生成事件
            Event generatedEvent = generator_->generateEvent();
            generatedEvent.eventId = i + 1;
            
            // 模拟事件
            Event simulatedEvent = simulator_->simulateEvent(generatedEvent);
            
            // 分析事件
            if (analyzer_) {
                analyzer_->analyzeEvent(simulatedEvent);
            }
            
            simulatedEvents.push_back(simulatedEvent);
            
            // 更新进度
            int progress = ((i + 1) * 100) / totalEvents;
            result.progress = progress;
            if (progressCallback_) {
                progressCallback_(progress);
            }
        }
        
        result.events = std::move(simulatedEvents);
        result.status = "completed";
        result.progress = 100;
        result.endTime = std::chrono::system_clock::now();
        
        Logger::info("Simulation completed: " + result.simulationId);
        
    } catch (const std::exception& e) {
        result.status = "failed";
        result.message = e.what();
        Logger::error("Simulation failed: " + std::string(e.what()));
    }
    
    return result;
}

void EventProcessor::setProgressCallback(std::function<void(int)> callback) {
    progressCallback_ = callback;
}

std::string EventProcessor::generateSimulationId() {
    auto now = std::chrono::system_clock::now();
    auto time = std::chrono::system_clock::to_time_t(now);
    std::stringstream ss;
    ss << "sim_" << std::put_time(std::localtime(&time), "%Y%m%d_%H%M%S");
    return ss.str();
}

} // namespace lhc
