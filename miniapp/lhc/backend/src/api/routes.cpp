#include "../include/api/routes.h"
#include "../include/analysis/event_processor.h"
#include "../include/generator/generator_factory.h"
#include "../include/simulation/geant4_simulator.h"
#include "../include/analysis/athena_analyzer.h"
#include "../include/types/event.h"
#include "../include/utils/logger.h"
#include <sstream>
#include <map>
#include <thread>

namespace lhc {

void Routes::handleRequest(const std::string& request, 
                          std::string& response,
                          EventProcessor* processor) {
    // 简化的HTTP请求解析
    std::istringstream iss(request);
    std::string method, path, version;
    iss >> method >> path >> version;
    
    // 提取请求体
    std::string body;
    size_t bodyPos = request.find("\r\n\r\n");
    if (bodyPos != std::string::npos) {
        body = request.substr(bodyPos + 4);
    }
    
    // 路由处理
    if (method == "POST" && path == "/api/simulation/start") {
        handleStartSimulation(body, response, processor);
    } else if (method == "GET" && path.find("/api/simulation/status/") == 0) {
        std::string id = path.substr(24);  // 提取ID
        handleGetStatus(id, response, processor);
    } else if (method == "GET" && path == "/api/results") {
        handleGetResults(body, response, processor);
    } else {
        response = errorResponse("Not Found", 404);
    }
}

void Routes::handleStartSimulation(const std::string& body,
                                  std::string& response,
                                  EventProcessor* processor) {
    if (!processor) {
        response = errorResponse("Event processor not initialized", 500);
        return;
    }
    
    // 解析JSON（简化版，实际应使用JSON库）
    // 假设body格式: {"generator":"pythia","energy":7000,"particleType":"proton"}
    
    SimulationConfig config;
    // 简化的JSON解析
    if (body.find("pythia") != std::string::npos) config.generator = "pythia";
    if (body.find("sherpa") != std::string::npos) config.generator = "sherpa";
    if (body.find("madgraph") != std::string::npos) config.generator = "madgraph";
    
    // 设置生成器
    auto generator = GeneratorFactory::create(config.generator);
    processor->setGenerator(std::move(generator));
    
    // 设置模拟器
    auto simulator = std::make_unique<Geant4Simulator>();
    processor->setSimulator(std::move(simulator));
    
    // 设置分析器
    auto analyzer = std::make_unique<AthenaAnalyzer>();
    processor->setAnalyzer(std::move(analyzer));
    
    // 启动模拟（异步）
    std::thread([processor, config]() {
        processor->processSimulation(config);
    }).detach();
    
    std::string json = R"({"simulationId":"sim_12345","status":"running"})";
    response = jsonResponse(json);
}

void Routes::handleGetStatus(const std::string& simulationId,
                             std::string& response,
                             EventProcessor* processor) {
    // 实际实现需要存储模拟状态
    std::string json = R"({"status":"running","progress":50})";
    response = jsonResponse(json);
}

void Routes::handleGetResults(const std::string& body,
                              std::string& response,
                              EventProcessor* processor) {
    // 返回结果列表
    std::string json = R"([{"id":"sim_12345","generator":"pythia","energy":7000,"eventCount":1000}])";
    response = jsonResponse(json);
}

std::string Routes::jsonResponse(const std::string& json) {
    std::ostringstream oss;
    oss << "HTTP/1.1 200 OK\r\n"
        << "Content-Type: application/json\r\n"
        << "Access-Control-Allow-Origin: *\r\n"
        << "Content-Length: " << json.length() << "\r\n"
        << "\r\n"
        << json;
    return oss.str();
}

std::string Routes::errorResponse(const std::string& message, int code) {
    std::ostringstream oss;
    std::string json = R"({"error":")" + message + R"("})";
    oss << "HTTP/1.1 " << code << " Error\r\n"
        << "Content-Type: application/json\r\n"
        << "Content-Length: " << json.length() << "\r\n"
        << "\r\n"
        << json;
    return oss.str();
}

} // namespace lhc
