#ifndef GEANT4_SIMULATOR_H
#define GEANT4_SIMULATOR_H

#include "simulator.h"
#include "detector_construction.h"
#include "physics_list.h"
#include "primary_generator.h"

#ifdef USE_GEANT4
#include "G4RunManager.hh"
#include "G4UImanager.hh"
#include "G4VisManager.hh"
#include "G4UIExecutive.hh"
#endif

namespace lhc {

/**
 * Geant4模拟器实现
 */
class Geant4Simulator : public Simulator {
public:
    Geant4Simulator();
    virtual ~Geant4Simulator();
    
    bool initialize() override;
    Event simulateEvent(const Event& event) override;
    void setProgressCallback(std::function<void(int)> callback) override;
    void cleanup() override;
    
private:
#ifdef USE_GEANT4
    G4RunManager* runManager_;
    DetectorConstruction* detector_;
    PhysicsList* physicsList_;
    PrimaryGenerator* primaryGen_;
    G4VisManager* visManager_;
#else
    void* runManager_;  // 占位符
    void* detector_;
    void* physicsList_;
    void* primaryGen_;
#endif
    
    bool initialized_;
    std::function<void(int)> progressCallback_;
    int totalEvents_;
    int currentEvent_;
    void* visManager_;  // 占位符
    
    void setupGeant4();
    void processGeant4Event(const Event& inputEvent);
};

} // namespace lhc

#endif // GEANT4_SIMULATOR_H
