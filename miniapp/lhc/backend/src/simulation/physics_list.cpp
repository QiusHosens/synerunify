#include "../include/simulation/physics_list.h"

#ifdef USE_GEANT4
#include "G4DecayPhysics.hh"
#include "G4EmStandardPhysics.hh"
#include "G4HadronElasticPhysics.hh"
#include "G4HadronPhysicsFTFP_BERT.hh"
#include "G4IonPhysics.hh"
#include "G4StoppingPhysics.hh"

namespace lhc {

PhysicsList::PhysicsList() {
    // 注册物理模块
    RegisterPhysics(new G4DecayPhysics());
    RegisterPhysics(new G4EmStandardPhysics());
    RegisterPhysics(new G4HadronElasticPhysics());
    RegisterPhysics(new G4HadronPhysicsFTFP_BERT());
    RegisterPhysics(new G4IonPhysics());
    RegisterPhysics(new G4StoppingPhysics());
}

PhysicsList::~PhysicsList() {
}

void PhysicsList::ConstructParticle() {
    G4VModularPhysicsList::ConstructParticle();
}

void PhysicsList::ConstructProcess() {
    G4VModularPhysicsList::ConstructProcess();
}

void PhysicsList::SetCuts() {
    SetCutValue(0.7*mm, "proton");
    SetCutValue(0.7*mm, "e-");
    SetCutValue(0.7*mm, "e+");
}

} // namespace lhc

#endif // USE_GEANT4
