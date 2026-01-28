#include "../include/api/server.h"
#include "../include/utils/logger.h"
#include <iostream>
#include <signal.h>
#include <thread>
#include <chrono>

std::unique_ptr<lhc::Server> g_server;

void signalHandler(int signal) {
    if (g_server) {
        Logger::info("Received signal, shutting down...");
        g_server->stop();
    }
    exit(0);
}

int main(int argc, char* argv[]) {
    // 注册信号处理
    signal(SIGINT, signalHandler);
    signal(SIGTERM, signalHandler);
    
    Logger::info("LHC Simulator starting...");
    
    // 创建并启动服务器
    g_server = std::make_unique<lhc::Server>(8080);
    
    if (!g_server->start()) {
        Logger::error("Failed to start server");
        return 1;
    }
    
    // 等待服务器运行
    while (g_server->isRunning()) {
        std::this_thread::sleep_for(std::chrono::seconds(1));
    }
    
    Logger::info("LHC Simulator stopped");
    return 0;
}
