#ifndef SHERPA_GENERATOR_H
#define SHERPA_GENERATOR_H

#include "generator.h"

namespace lhc {

/**
 * Sherpa事件生成器实现
 * 注意：Sherpa通常通过外部进程调用
 */
class SherpaGenerator : public Generator {
public:
    SherpaGenerator();
    virtual ~SherpaGenerator();
    
    bool initialize(double energy, const std::string& particleType) override;
    Event generateEvent() override;
    std::string getName() const override { return "sherpa"; }
    void cleanup() override;
    
private:
    bool initialized_;
    double energy_;
    std::string particleType_;
    std::string sherpaPath_;
    
    Event generateFromSherpa();
};

} // namespace lhc

#endif // SHERPA_GENERATOR_H
