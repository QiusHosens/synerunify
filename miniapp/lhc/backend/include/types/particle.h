#ifndef PARTICLE_H
#define PARTICLE_H

#include <string>
#include <vector>

namespace lhc {

/**
 * 粒子类
 * 表示一个基本粒子，包含其物理属性
 */
struct Particle {
    int id;              // 粒子ID (PDG编码)
    std::string type;    // 粒子类型名称
    double px, py, pz;   // 动量分量 (GeV/c)
    double energy;       // 能量 (GeV)
    double mass;         // 质量 (GeV/c²)
    double charge;       // 电荷 (e)
    
    Particle() : id(0), px(0), py(0), pz(0), energy(0), mass(0), charge(0) {}
    
    Particle(int pdgId, double px_, double py_, double pz_, double e_)
        : id(pdgId), px(px_), py(py_), pz(pz_), energy(e_), charge(0) {
        // 计算质量
        double p2 = px*px + py*py + pz*pz;
        mass = (e_*e_ > p2) ? std::sqrt(e_*e_ - p2) : 0.0;
    }
    
    // 计算总动量
    double momentum() const {
        return std::sqrt(px*px + py*py + pz*pz);
    }
    
    // 计算横向动量
    double pt() const {
        return std::sqrt(px*px + py*py);
    }
    
    // 计算赝快度
    double eta() const {
        double p = momentum();
        if (p == 0 || std::abs(pz) >= p) return 0.0;
        return 0.5 * std::log((p + pz) / (p - pz));
    }
};

/**
 * 事件类
 * 包含一次碰撞产生的所有粒子
 */
struct Event {
    int eventId;
    std::vector<Particle> particles;
    double collisionEnergy;  // 碰撞能量 (GeV)
    std::string generator;   // 使用的生成器
    
    Event() : eventId(0), collisionEnergy(0.0) {}
    
    void addParticle(const Particle& p) {
        particles.push_back(p);
    }
    
    size_t size() const {
        return particles.size();
    }
};

} // namespace lhc

#endif // PARTICLE_H
