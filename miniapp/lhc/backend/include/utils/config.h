#ifndef CONFIG_H
#define CONFIG_H

#include <string>
#include <map>

namespace lhc {

/**
 * 配置管理
 */
class Config {
public:
    static Config& getInstance();
    
    void loadFromFile(const std::string& filename);
    void set(const std::string& key, const std::string& value);
    std::string get(const std::string& key, const std::string& defaultValue = "") const;
    int getInt(const std::string& key, int defaultValue = 0) const;
    double getDouble(const std::string& key, double defaultValue = 0.0) const;
    
private:
    Config() = default;
    std::map<std::string, std::string> config_;
};

} // namespace lhc

#endif // CONFIG_H
