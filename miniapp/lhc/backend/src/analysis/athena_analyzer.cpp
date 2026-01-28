#include "../include/analysis/athena_analyzer.h"
#include "../include/utils/logger.h"
#include <algorithm>
#include <cmath>

namespace lhc {

AthenaAnalyzer::AthenaAnalyzer() 
    : totalEvents_(0), totalParticles_(0), totalEnergy_(0.0),
      maxPt_(0.0), maxEta_(0.0) {
    reset();
}

AthenaAnalyzer::~AthenaAnalyzer() {
}

void AthenaAnalyzer::analyzeEvent(const Event& event) {
    totalEvents_++;
    updateStatistics(event);
    calculateEventVariables(event);
}

void AthenaAnalyzer::analyzeEvents(const std::vector<Event>& events) {
    for (const auto& event : events) {
        analyzeEvent(event);
    }
}

void AthenaAnalyzer::updateStatistics(const Event& event) {
    for (const auto& particle : event.particles) {
        totalParticles_++;
        totalEnergy_ += particle.energy;
        
        double pt = particle.pt();
        if (pt > maxPt_) {
            maxPt_ = pt;
        }
        
        double eta = std::abs(particle.eta());
        if (eta > maxEta_) {
            maxEta_ = eta;
        }
        
        // 更新分布
        ptDistribution_.push_back(pt);
        etaDistribution_.push_back(particle.eta());
    }
}

void AthenaAnalyzer::calculateEventVariables(const Event& event) {
    // 计算事件级变量
    // 例如：缺失横向能量、喷注等
    // 这里提供基础实现
}

std::map<std::string, double> AthenaAnalyzer::getResults() const {
    std::map<std::string, double> results;
    
    results["totalEvents"] = totalEvents_;
    results["totalParticles"] = totalParticles_;
    results["averageParticlesPerEvent"] = 
        totalEvents_ > 0 ? static_cast<double>(totalParticles_) / totalEvents_ : 0.0;
    results["totalEnergy"] = totalEnergy_;
    results["averageEnergyPerEvent"] = 
        totalEvents_ > 0 ? totalEnergy_ / totalEvents_ : 0.0;
    results["maxPt"] = maxPt_;
    results["maxEta"] = maxEta_;
    
    // 计算平均值
    if (!ptDistribution_.empty()) {
        double sumPt = 0.0;
        for (double pt : ptDistribution_) {
            sumPt += pt;
        }
        results["averagePt"] = sumPt / ptDistribution_.size();
    }
    
    return results;
}

void AthenaAnalyzer::reset() {
    totalEvents_ = 0;
    totalParticles_ = 0;
    totalEnergy_ = 0.0;
    maxPt_ = 0.0;
    maxEta_ = 0.0;
    ptDistribution_.clear();
    etaDistribution_.clear();
}

} // namespace lhc
