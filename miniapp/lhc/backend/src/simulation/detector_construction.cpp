#include "../include/simulation/detector_construction.h"
#include "../include/utils/logger.h"

#ifdef USE_GEANT4
#include "G4NistManager.hh"
#include "G4Box.hh"
#include "G4LogicalVolume.hh"
#include "G4PVPlacement.hh"
#include "G4SystemOfUnits.hh"

namespace lhc {

DetectorConstruction::DetectorConstruction() {
}

DetectorConstruction::~DetectorConstruction() {
}

G4VPhysicalVolume* DetectorConstruction::Construct() {
    // 获取材料管理器
    G4NistManager* nist = G4NistManager::Instance();
    
    // 创建世界体积
    G4double worldSize = 50.0 * m;
    G4Material* worldMat = nist->FindOrBuildMaterial("G4_AIR");
    
    G4Box* solidWorld = new G4Box("World", 
                                   0.5*worldSize, 
                                   0.5*worldSize, 
                                   0.5*worldSize);
    
    G4LogicalVolume* logicWorld = new G4LogicalVolume(solidWorld, 
                                                       worldMat, 
                                                       "World");
    
    G4VPhysicalVolume* physWorld = new G4PVPlacement(0,
                                                     G4ThreeVector(),
                                                     logicWorld,
                                                     "World",
                                                     0,
                                                     false,
                                                     0);
    
    // 构造ATLAS探测器组件
    constructInnerDetector();
    constructCalorimeters();
    constructMuonSpectrometer();
    
    Logger::info("Detector construction completed");
    return physWorld;
}

void DetectorConstruction::constructInnerDetector() {
    // 内层探测器构造
    // 包括像素探测器、硅条探测器等
}

void DetectorConstruction::constructCalorimeters() {
    // 量能器构造
    // 包括电磁量能器和强子量能器
}

void DetectorConstruction::constructMuonSpectrometer() {
    // μ子谱仪构造
}

} // namespace lhc

#endif // USE_GEANT4
