#include "../include/generator/madgraph_generator.h"
#include "../include/utils/logger.h"

namespace lhc {

MadGraphGenerator::MadGraphGenerator() 
    : initialized_(false), energy_(0.0), madgraphPath_("madgraph") {
}

MadGraphGenerator::~MadGraphGenerator() {
    cleanup();
}

bool MadGraphGenerator::initialize(double energy, const std::string& particleType) {
    energy_ = energy;
    particleType_ = particleType;
    
    // 实际实现需要调用MadGraph API
    Logger::info("MadGraph generator initialized: energy=" + std::to_string(energy) + 
                 " GeV, particle=" + particleType);
    initialized_ = true;
    return true;
}

Event MadGraphGenerator::generateEvent() {
    Event event;
    event.collisionEnergy = energy_;
    event.generator = "madgraph";
    
    if (!initialized_) {
        Logger::error("MadGraph not initialized");
        return event;
    }
    
    // Mock实现
    static int eventCounter = 0;
    event.eventId = ++eventCounter;
    
    Particle p1(2212, 0.6, 0.4, 0.9, 1.1);
    Particle p2(-211, -0.3, 0.2, -0.5, 0.5);
    event.addParticle(p1);
    event.addParticle(p2);
    
    return event;
}

void MadGraphGenerator::cleanup() {
    initialized_ = false;
}

} // namespace lhc
