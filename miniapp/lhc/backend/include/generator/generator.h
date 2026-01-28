#ifndef GENERATOR_H
#define GENERATOR_H

#include "../types/event.h"
#include <memory>
#include <string>

namespace lhc {

/**
 * 事件生成器接口
 * 支持Pythia、Sherpa、MadGraph等生成器
 */
class Generator {
public:
    virtual ~Generator() = default;
    
    /**
     * 初始化生成器
     * @param energy 碰撞能量 (GeV)
     * @param particleType 粒子类型
     */
    virtual bool initialize(double energy, const std::string& particleType) = 0;
    
    /**
     * 生成一个事件
     * @return 生成的事件
     */
    virtual Event generateEvent() = 0;
    
    /**
     * 生成多个事件
     * @param nEvents 事件数量
     * @return 事件列表
     */
    virtual std::vector<Event> generateEvents(int nEvents);
    
    /**
     * 获取生成器名称
     */
    virtual std::string getName() const = 0;
    
    /**
     * 清理资源
     */
    virtual void cleanup() = 0;
};

} // namespace lhc

#endif // GENERATOR_H
