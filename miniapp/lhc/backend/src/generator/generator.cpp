#include "../include/generator/generator.h"

namespace lhc {

std::vector<Event> Generator::generateEvents(int nEvents) {
    std::vector<Event> events;
    events.reserve(nEvents);
    
    for (int i = 0; i < nEvents; ++i) {
        events.push_back(generateEvent());
    }
    
    return events;
}

} // namespace lhc
