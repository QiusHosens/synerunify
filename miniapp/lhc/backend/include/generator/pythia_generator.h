#ifndef PYTHIA_GENERATOR_H
#define PYTHIA_GENERATOR_H

#include "generator.h"

#ifdef USE_PYTHIA8
#include "Pythia8/Pythia.h"
#endif

namespace lhc {

/**
 * Pythia8事件生成器实现
 */
class PythiaGenerator : public Generator {
public:
    PythiaGenerator();
    virtual ~PythiaGenerator();
    
    bool initialize(double energy, const std::string& particleType) override;
    Event generateEvent() override;
    std::string getName() const override { return "pythia"; }
    void cleanup() override;
    
private:
#ifdef USE_PYTHIA8
    Pythia8::Pythia* pythia_;
#else
    void* pythia_;  // 占位符
#endif
    bool initialized_;
    double energy_;
    std::string particleType_;
    
    void configurePythia();
};

} // namespace lhc

#endif // PYTHIA_GENERATOR_H
