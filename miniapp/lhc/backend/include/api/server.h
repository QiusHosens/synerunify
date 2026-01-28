#ifndef SERVER_H
#define SERVER_H

#include <string>
#include <memory>
#include <thread>
#include <atomic>

namespace lhc {

class EventProcessor;

/**
 * HTTP API服务器
 * 提供REST API接口供前端调用
 */
class Server {
public:
    Server(int port = 8080);
    ~Server();
    
    bool start();
    void stop();
    bool isRunning() const { return running_; }
    
private:
    int port_;
    std::atomic<bool> running_;
    std::unique_ptr<std::thread> serverThread_;
    std::unique_ptr<EventProcessor> eventProcessor_;
    
    void runServer();
    void handleRequest(const std::string& method, const std::string& path, 
                      const std::string& body, std::string& response);
};

} // namespace lhc

#endif // SERVER_H
