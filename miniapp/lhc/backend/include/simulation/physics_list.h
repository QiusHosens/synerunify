#ifndef PHYSICS_LIST_H
#define PHYSICS_LIST_H

#ifdef USE_GEANT4
#include "G4VModularPhysicsList.hh"

namespace lhc {

/**
 * 物理过程列表
 * 定义模拟中使用的物理过程
 */
class PhysicsList : public G4VModularPhysicsList {
public:
    PhysicsList();
    virtual ~PhysicsList();
    
    void ConstructParticle();
    void ConstructProcess();
    void SetCuts();
};

} // namespace lhc

#endif // USE_GEANT4

#endif // PHYSICS_LIST_H
