#include "../include/generator/pythia_generator.h"
#include "../include/utils/logger.h"
#include <sstream>

namespace lhc {

PythiaGenerator::PythiaGenerator() 
    : pythia_(nullptr), initialized_(false), energy_(0.0) {
#ifdef USE_PYTHIA8
    pythia_ = new Pythia8::Pythia();
#endif
}

PythiaGenerator::~PythiaGenerator() {
    cleanup();
}

bool PythiaGenerator::initialize(double energy, const std::string& particleType) {
    energy_ = energy;
    particleType_ = particleType;
    
#ifdef USE_PYTHIA8
    if (!pythia_) {
        Logger::error("Pythia8 not available");
        return false;
    }
    
    // 配置Pythia参数
    configurePythia();
    
    // 初始化
    if (!pythia_->init()) {
        Logger::error("Failed to initialize Pythia8");
        return false;
    }
    
    initialized_ = true;
    Logger::info("Pythia8 initialized: energy=" + std::to_string(energy) + 
                 " GeV, particle=" + particleType);
    return true;
#else
    Logger::warn("Pythia8 support not compiled. Using mock generator.");
    initialized_ = true;
    return true;
#endif
}

void PythiaGenerator::configurePythia() {
#ifdef USE_PYTHIA8
    // 设置碰撞能量
    pythia_->settings.parm("Beams:eCM", energy_);
    
    // 设置粒子类型
    if (particleType_ == "proton") {
        pythia_->settings.mode("Beams:idA", 2212);  // 质子
        pythia_->settings.mode("Beams:idB", 2212);
    } else if (particleType_ == "electron") {
        pythia_->settings.mode("Beams:idA", 11);    // 电子
        pythia_->settings.mode("Beams:idB", -11);   // 正电子
    }
    
    // 其他配置
    pythia_->settings.flag("PartonLevel:all", true);
    pythia_->settings.flag("HadronLevel:all", true);
#endif
}

Event PythiaGenerator::generateEvent() {
    Event event;
    event.collisionEnergy = energy_;
    event.generator = "pythia";
    
#ifdef USE_PYTHIA8
    if (!initialized_ || !pythia_) {
        Logger::error("Pythia8 not initialized");
        return event;
    }
    
    // 生成事件
    if (!pythia_->next()) {
        Logger::warn("Failed to generate Pythia event");
        return event;
    }
    
    // 转换Pythia事件到我们的Event格式
    for (int i = 0; i < pythia_->event.size(); ++i) {
        const auto& pythiaParticle = pythia_->event[i];
        
        // 只保存最终状态粒子（状态码 > 0）
        if (pythiaParticle.status() > 0) {
            Particle particle(
                pythiaParticle.id(),
                pythiaParticle.px(),
                pythiaParticle.py(),
                pythiaParticle.pz(),
                pythiaParticle.e()
            );
            particle.type = pythiaParticle.name();
            particle.charge = pythiaParticle.charge();
            event.addParticle(particle);
        }
    }
#else
    // Mock实现：生成示例粒子
    static int eventCounter = 0;
    event.eventId = ++eventCounter;
    
    // 生成一些示例粒子
    Particle p1(2212, 0.5, 0.3, 0.8, 1.0);  // 质子
    Particle p2(-211, -0.3, 0.2, -0.5, 0.5);  // π-
    event.addParticle(p1);
    event.addParticle(p2);
#endif
    
    return event;
}

void PythiaGenerator::cleanup() {
#ifdef USE_PYTHIA8
    if (pythia_) {
        delete pythia_;
        pythia_ = nullptr;
    }
#endif
    initialized_ = false;
}

} // namespace lhc
