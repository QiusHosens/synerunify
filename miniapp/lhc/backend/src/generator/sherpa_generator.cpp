#include "../include/generator/sherpa_generator.h"
#include "../include/utils/logger.h"
#include <cstdlib>
#include <fstream>
#include <sstream>

namespace lhc {

SherpaGenerator::SherpaGenerator() 
    : initialized_(false), energy_(0.0), sherpaPath_("sherpa") {
}

SherpaGenerator::~SherpaGenerator() {
    cleanup();
}

bool SherpaGenerator::initialize(double energy, const std::string& particleType) {
    energy_ = energy;
    particleType_ = particleType;
    
    // 检查Sherpa是否可用
    // 实际实现中需要调用Sherpa的API或通过进程间通信
    
    Logger::info("Sherpa generator initialized: energy=" + std::to_string(energy) + 
                 " GeV, particle=" + particleType);
    initialized_ = true;
    return true;
}

Event SherpaGenerator::generateEvent() {
    Event event;
    event.collisionEnergy = energy_;
    event.generator = "sherpa";
    
    if (!initialized_) {
        Logger::error("Sherpa not initialized");
        return event;
    }
    
    // 实际实现需要调用Sherpa API
    // 这里提供mock实现
    static int eventCounter = 0;
    event.eventId = ++eventCounter;
    
    // Mock粒子
    Particle p1(2212, 0.4, 0.2, 0.7, 0.9);
    Particle p2(211, -0.2, 0.1, -0.4, 0.4);
    event.addParticle(p1);
    event.addParticle(p2);
    
    return event;
}

void SherpaGenerator::cleanup() {
    initialized_ = false;
}

} // namespace lhc
