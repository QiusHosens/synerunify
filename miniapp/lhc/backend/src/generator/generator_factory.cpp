#include "../include/generator/generator_factory.h"
#include "../include/generator/pythia_generator.h"
#include "../include/generator/sherpa_generator.h"
#include "../include/generator/madgraph_generator.h"

namespace lhc {

std::unique_ptr<Generator> GeneratorFactory::create(const std::string& name) {
    if (name == "pythia") {
        return std::make_unique<PythiaGenerator>();
    } else if (name == "sherpa") {
        return std::make_unique<SherpaGenerator>();
    } else if (name == "madgraph") {
        return std::make_unique<MadGraphGenerator>();
    }
    
    return nullptr;
}

std::vector<std::string> GeneratorFactory::getAvailableGenerators() {
    return {"pythia", "sherpa", "madgraph"};
}

} // namespace lhc
