#ifndef SIMULATOR_H
#define SIMULATOR_H

#include "../types/event.h"
#include <memory>
#include <functional>
#include <vector>

namespace lhc {

/**
 * 模拟器接口
 * 使用Geant4进行物理过程模拟
 */
class Simulator {
public:
    virtual ~Simulator() = default;
    
    /**
     * 初始化模拟器
     */
    virtual bool initialize() = 0;
    
    /**
     * 模拟一个事件
     * @param event 输入事件（从生成器获得）
     * @return 模拟后的事件（包含探测器响应）
     */
    virtual Event simulateEvent(const Event& event) = 0;
    
    /**
     * 批量模拟事件
     */
    virtual std::vector<Event> simulateEvents(const std::vector<Event>& events);
    
    /**
     * 设置进度回调
     */
    virtual void setProgressCallback(std::function<void(int)> callback) = 0;
    
    /**
     * 清理资源
     */
    virtual void cleanup() = 0;
};

} // namespace lhc

#endif // SIMULATOR_H
