#include "../include/api/server.h"
#include "../include/api/routes.h"
#include "../include/analysis/event_processor.h"
#include "../include/utils/logger.h"
#include <sstream>
#include <iostream>
#include <memory>

#ifdef _WIN32
#include <winsock2.h>
#include <ws2tcpip.h>
#pragma comment(lib, "ws2_32.lib")
#else
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#endif

namespace lhc {

Server::Server(int port) : port_(port), running_(false) {
    eventProcessor_ = std::make_unique<EventProcessor>();
}

Server::~Server() {
    stop();
}

bool Server::start() {
    if (running_) {
        Logger::warn("Server already running");
        return true;
    }
    
    running_ = true;
    serverThread_ = std::make_unique<std::thread>(&Server::runServer, this);
    
    Logger::info("Server started on port " + std::to_string(port_));
    return true;
}

void Server::stop() {
    if (!running_) {
        return;
    }
    
    running_ = false;
    if (serverThread_ && serverThread_->joinable()) {
        serverThread_->join();
    }
    
    Logger::info("Server stopped");
}

void Server::runServer() {
    // 简化的HTTP服务器实现
    // 实际项目中应使用专业的HTTP库（如cpp-httplib, crow等）
    
#ifdef _WIN32
    WSADATA wsaData;
    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
        Logger::error("WSAStartup failed");
        return;
    }
    
    SOCKET serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSocket == INVALID_SOCKET) {
        Logger::error("Socket creation failed");
        WSACleanup();
        return;
    }
    
    sockaddr_in serverAddr;
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = INADDR_ANY;
    serverAddr.sin_port = htons(port_);
    
    if (bind(serverSocket, (sockaddr*)&serverAddr, sizeof(serverAddr)) == SOCKET_ERROR) {
        Logger::error("Bind failed");
        closesocket(serverSocket);
        WSACleanup();
        return;
    }
    
    if (listen(serverSocket, 5) == SOCKET_ERROR) {
        Logger::error("Listen failed");
        closesocket(serverSocket);
        WSACleanup();
        return;
    }
    
    Logger::info("Server listening on port " + std::to_string(port_));
    
    while (running_) {
        sockaddr_in clientAddr;
        int clientAddrLen = sizeof(clientAddr);
        SOCKET clientSocket = accept(serverSocket, (sockaddr*)&clientAddr, &clientAddrLen);
        
        if (clientSocket == INVALID_SOCKET) {
            if (running_) {
                Logger::error("Accept failed");
            }
            continue;
        }
        
        // 处理请求（简化版）
        char buffer[4096];
        int bytesReceived = recv(clientSocket, buffer, sizeof(buffer) - 1, 0);
        if (bytesReceived > 0) {
            buffer[bytesReceived] = '\0';
            std::string request(buffer);
            
            std::string response;
            Routes::handleRequest(request, response, eventProcessor_.get());
            
            send(clientSocket, response.c_str(), response.length(), 0);
        }
        
        closesocket(clientSocket);
    }
    
    closesocket(serverSocket);
    WSACleanup();
#else
    // Linux实现类似
    int serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    // ... 类似实现
#endif
}

} // namespace lhc
