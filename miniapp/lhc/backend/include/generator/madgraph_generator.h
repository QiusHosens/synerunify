#ifndef MADGRAPH_GENERATOR_H
#define MADGRAPH_GENERATOR_H

#include "generator.h"

namespace lhc {

/**
 * MadGraph事件生成器实现
 * 注意：MadGraph通常通过外部进程调用
 */
class MadGraphGenerator : public Generator {
public:
    MadGraphGenerator();
    virtual ~MadGraphGenerator();
    
    bool initialize(double energy, const std::string& particleType) override;
    Event generateEvent() override;
    std::string getName() const override { return "madgraph"; }
    void cleanup() override;
    
private:
    bool initialized_;
    double energy_;
    std::string particleType_;
    std::string madgraphPath_;
    
    Event generateFromMadGraph();
};

} // namespace lhc

#endif // MADGRAPH_GENERATOR_H
