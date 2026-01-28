#ifndef DETECTOR_CONSTRUCTION_H
#define DETECTOR_CONSTRUCTION_H

#ifdef USE_GEANT4
#include "G4VUserDetectorConstruction.hh"

class G4VPhysicalVolume;

namespace lhc {

/**
 * ATLAS探测器构造
 * 定义探测器的几何结构
 */
class DetectorConstruction : public G4VUserDetectorConstruction {
public:
    DetectorConstruction();
    virtual ~DetectorConstruction();
    
    virtual G4VPhysicalVolume* Construct() override;
    
private:
    void constructInnerDetector();
    void constructCalorimeters();
    void constructMuonSpectrometer();
};

} // namespace lhc

#endif // USE_GEANT4

#endif // DETECTOR_CONSTRUCTION_H
