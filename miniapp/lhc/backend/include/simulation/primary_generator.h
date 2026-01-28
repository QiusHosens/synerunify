#ifndef PRIMARY_GENERATOR_H
#define PRIMARY_GENERATOR_H

#include "../types/event.h"

#ifdef USE_GEANT4
#include "G4VUserPrimaryGeneratorAction.hh"

class G4Event;

namespace lhc {

/**
 * 主生成器动作
 * 将生成器产生的事件转换为Geant4主粒子
 */
class PrimaryGenerator : public G4VUserPrimaryGeneratorAction {
public:
    PrimaryGenerator();
    virtual ~PrimaryGenerator();
    
    virtual void GeneratePrimaries(G4Event* event) override;
    
    void setEvent(const Event& evt) { inputEvent_ = evt; }
    
private:
    Event inputEvent_;
};

} // namespace lhc

#endif // USE_GEANT4

#endif // PRIMARY_GENERATOR_H
