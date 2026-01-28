#include "../include/simulation/simulator.h"

namespace lhc {

std::vector<Event> Simulator::simulateEvents(const std::vector<Event>& events) {
    std::vector<Event> simulatedEvents;
    simulatedEvents.reserve(events.size());
    
    for (const auto& event : events) {
        simulatedEvents.push_back(simulateEvent(event));
    }
    
    return simulatedEvents;
}

} // namespace lhc
