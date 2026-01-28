#ifndef ATHENA_ANALYZER_H
#define ATHENA_ANALYZER_H

#include "analyzer.h"

namespace lhc {

/**
 * Athena分析器实现
 * 提供物理量计算和统计分析
 */
class AthenaAnalyzer : public Analyzer {
public:
    AthenaAnalyzer();
    virtual ~AthenaAnalyzer();
    
    void analyzeEvent(const Event& event) override;
    std::map<std::string, double> getResults() const override;
    void reset() override;
    
private:
    // 统计数据
    int totalEvents_;
    int totalParticles_;
    double totalEnergy_;
    double maxPt_;
    double maxEta_;
    
    // 直方图数据（简化版）
    std::vector<double> ptDistribution_;
    std::vector<double> etaDistribution_;
    
    void calculateEventVariables(const Event& event);
    void updateStatistics(const Event& event);
};

} // namespace lhc

#endif // ATHENA_ANALYZER_H
