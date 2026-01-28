#ifndef ROUTES_H
#define ROUTES_H

#include <string>

namespace lhc {

class EventProcessor;

/**
 * API路由处理
 */
class Routes {
public:
    static void handleRequest(const std::string& request, 
                             std::string& response,
                             EventProcessor* processor);
    
private:
    static void handleStartSimulation(const std::string& body, 
                                     std::string& response,
                                     EventProcessor* processor);
    static void handleGetStatus(const std::string& simulationId,
                               std::string& response,
                               EventProcessor* processor);
    static void handleGetResults(const std::string& body,
                                std::string& response,
                                EventProcessor* processor);
    
    static std::string jsonResponse(const std::string& json);
    static std::string errorResponse(const std::string& message, int code = 500);
};

} // namespace lhc

#endif // ROUTES_H
