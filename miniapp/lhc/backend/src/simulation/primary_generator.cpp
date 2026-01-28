#include "../include/simulation/primary_generator.h"

#ifdef USE_GEANT4
#include "G4ParticleTable.hh"
#include "G4ParticleDefinition.hh"
#include "G4SystemOfUnits.hh"
#include "G4PrimaryParticle.hh"
#include "G4PrimaryVertex.hh"

namespace lhc {

PrimaryGenerator::PrimaryGenerator() {
}

PrimaryGenerator::~PrimaryGenerator() {
}

void PrimaryGenerator::GeneratePrimaries(G4Event* event) {
    // 创建主顶点（对撞点）
    G4PrimaryVertex* vertex = new G4PrimaryVertex(0, 0, 0, 0);
    
    // 为事件中的每个粒子创建主粒子
    for (const auto& particle : inputEvent_.particles) {
        G4ParticleTable* particleTable = G4ParticleTable::GetParticleTable();
        G4ParticleDefinition* particleDef = 
            particleTable->FindParticle(particle.id);
        
        if (particleDef) {
            G4PrimaryParticle* primaryParticle = new G4PrimaryParticle(
                particleDef,
                particle.px * GeV,
                particle.py * GeV,
                particle.pz * GeV
            );
            vertex->SetPrimary(primaryParticle);
        }
    }
    
    event->AddPrimaryVertex(vertex);
}

} // namespace lhc

#endif // USE_GEANT4
