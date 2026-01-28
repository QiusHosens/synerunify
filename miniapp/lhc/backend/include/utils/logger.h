#ifndef LOGGER_H
#define LOGGER_H

#include <string>
#include <iostream>
#include <sstream>
#include <chrono>
#include <iomanip>

namespace lhc {

/**
 * 简单日志工具
 */
class Logger {
public:
    enum Level {
        DEBUG,
        INFO,
        WARN,
        ERROR
    };
    
    static void log(Level level, const std::string& message);
    static void debug(const std::string& message);
    static void info(const std::string& message);
    static void warn(const std::string& message);
    static void error(const std::string& message);
    
private:
    static std::string getLevelString(Level level);
    static std::string getTimestamp();
};

} // namespace lhc

#endif // LOGGER_H
