#ifndef GENERATOR_FACTORY_H
#define GENERATOR_FACTORY_H

#include "generator.h"
#include <memory>
#include <string>

namespace lhc {

/**
 * 生成器工厂
 * 根据名称创建对应的生成器实例
 */
class GeneratorFactory {
public:
    /**
     * 创建生成器
     * @param name 生成器名称 ("pythia", "sherpa", "madgraph")
     * @return 生成器指针，失败返回nullptr
     */
    static std::unique_ptr<Generator> create(const std::string& name);
    
    /**
     * 获取可用的生成器列表
     */
    static std::vector<std::string> getAvailableGenerators();
};

} // namespace lhc

#endif // GENERATOR_FACTORY_H
