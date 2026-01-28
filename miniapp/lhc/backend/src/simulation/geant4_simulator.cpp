#include "../include/simulation/geant4_simulator.h"
#include "../include/utils/logger.h"

namespace lhc {

Geant4Simulator::Geant4Simulator() 
    : runManager_(nullptr), detector_(nullptr), 
      physicsList_(nullptr), primaryGen_(nullptr),
      visManager_(nullptr),
      initialized_(false), totalEvents_(0), currentEvent_(0) {
}

Geant4Simulator::~Geant4Simulator() {
    cleanup();
}

bool Geant4Simulator::initialize() {
#ifdef USE_GEANT4
    if (initialized_) {
        Logger::warn("Geant4Simulator already initialized");
        return true;
    }
    
    // 创建RunManager
    runManager_ = new G4RunManager();
    
    // 设置探测器构造
    detector_ = new DetectorConstruction();
    runManager_->SetUserInitialization(detector_);
    
    // 设置物理列表
    physicsList_ = new PhysicsList();
    runManager_->SetUserInitialization(physicsList_);
    
    // 设置主生成器
    primaryGen_ = new PrimaryGenerator();
    runManager_->SetUserAction(primaryGen_);
    
    // 初始化Geant4
    runManager_->Initialize();
    
    initialized_ = true;
    Logger::info("Geant4Simulator initialized");
    return true;
#else
    Logger::warn("Geant4 support not compiled. Using mock simulator.");
    initialized_ = true;
    return true;
#endif
}

Event Geant4Simulator::simulateEvent(const Event& event) {
    Event simulatedEvent = event;  // 复制输入事件
    
    if (!initialized_) {
        Logger::error("Geant4Simulator not initialized");
        return simulatedEvent;
    }
    
#ifdef USE_GEANT4
    // 设置主生成器使用输入事件
    if (primaryGen_) {
        primaryGen_->setEvent(event);
    }
    
    // 运行一个事件
    runManager_->BeamOn(1);
    
    // 从Geant4获取模拟结果
    // 实际实现需要从G4Event中提取信息
    processGeant4Event(event);
    
    // 更新进度
    if (progressCallback_) {
        currentEvent_++;
        int progress = totalEvents_ > 0 
            ? (currentEvent_ * 100 / totalEvents_) 
            : 0;
        progressCallback_(progress);
    }
#else
    // Mock实现：添加一些模拟后的粒子
    Particle simulatedP1(22, 0.1, 0.05, 0.2, 0.25);  // 光子
    simulatedEvent.addParticle(simulatedP1);
#endif
    
    return simulatedEvent;
}


void Geant4Simulator::setProgressCallback(std::function<void(int)> callback) {
    progressCallback_ = callback;
}

void Geant4Simulator::setupGeant4() {
    // Geant4特定设置
}

void Geant4Simulator::processGeant4Event(const Event& inputEvent) {
    // 处理Geant4事件，提取模拟结果
    // 实际实现需要访问G4Event对象
}

void Geant4Simulator::cleanup() {
#ifdef USE_GEANT4
    if (runManager_) {
        delete runManager_;
        runManager_ = nullptr;
    }
    if (detector_) {
        delete detector_;
        detector_ = nullptr;
    }
    if (physicsList_) {
        delete physicsList_;
        physicsList_ = nullptr;
    }
    if (primaryGen_) {
        delete primaryGen_;
        primaryGen_ = nullptr;
    }
    if (visManager_) {
        delete visManager_;
        visManager_ = nullptr;
    }
#endif
    initialized_ = false;
}

} // namespace lhc
