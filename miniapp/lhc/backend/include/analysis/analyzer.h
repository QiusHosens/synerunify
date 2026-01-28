#ifndef ANALYZER_H
#define ANALYZER_H

#include "../types/event.h"
#include <vector>
#include <map>
#include <string>
#include <memory>

namespace lhc {

/**
 * 数据分析器接口
 * 基于Athena框架进行数据分析
 */
class Analyzer {
public:
    virtual ~Analyzer() = default;
    
    /**
     * 分析单个事件
     */
    virtual void analyzeEvent(const Event& event) = 0;
    
    /**
     * 分析事件列表
     */
    virtual void analyzeEvents(const std::vector<Event>& events);
    
    /**
     * 获取分析结果
     */
    virtual std::map<std::string, double> getResults() const = 0;
    
    /**
     * 重置分析器
     */
    virtual void reset() = 0;
};

} // namespace lhc

#endif // ANALYZER_H
