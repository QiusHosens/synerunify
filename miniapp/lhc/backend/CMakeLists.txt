cmake_minimum_required(VERSION 3.15)
project(LHCSimulator VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 输出目录
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib)
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib)

# 包含目录
include_directories(${CMAKE_SOURCE_DIR}/include)

# 查找依赖
find_package(PkgConfig REQUIRED)

# Geant4
find_package(Geant4 REQUIRED)
include(${Geant4_USE_FILE})

# ROOT (用于数据分析)
find_package(ROOT REQUIRED)
include(${ROOT_USE_FILE})

# Pythia8 (事件生成器)
find_package(Pythia8 QUIET)
if(NOT Pythia8_FOUND)
    message(WARNING "Pythia8 not found. Event generation may not work.")
endif()

# 编译选项
if(CMAKE_COMPILER_IS_GNUCXX OR CMAKE_CXX_COMPILER_ID MATCHES "Clang")
    add_compile_options(-Wall -Wextra -pedantic)
endif()

# 源文件
set(SOURCES
    src/main.cpp
    src/api/server.cpp
    src/api/routes.cpp
    src/generator/pythia_generator.cpp
    src/generator/sherpa_generator.cpp
    src/generator/madgraph_generator.cpp
    src/generator/generator_factory.cpp
    src/simulation/geant4_simulator.cpp
    src/simulation/detector_construction.cpp
    src/simulation/physics_list.cpp
    src/simulation/primary_generator.cpp
    src/analysis/athena_analyzer.cpp
    src/analysis/event_processor.cpp
    src/utils/logger.cpp
    src/utils/config.cpp
)

# 头文件
set(HEADERS
    include/api/server.h
    include/api/routes.h
    include/generator/generator.h
    include/generator/pythia_generator.h
    include/generator/sherpa_generator.h
    include/generator/madgraph_generator.h
    include/generator/generator_factory.h
    include/simulation/simulator.h
    include/simulation/geant4_simulator.h
    include/simulation/detector_construction.h
    include/simulation/physics_list.h
    include/simulation/primary_generator.h
    include/analysis/analyzer.h
    include/analysis/athena_analyzer.h
    include/analysis/event_processor.h
    include/utils/logger.h
    include/utils/config.h
    include/types/particle.h
    include/types/event.h
)

# 可执行文件
add_executable(lhc_simulator ${SOURCES} ${HEADERS})

# 链接库
target_link_libraries(lhc_simulator
    ${Geant4_LIBRARIES}
    ${ROOT_LIBRARIES}
)

# Pythia8链接
if(Pythia8_FOUND)
    target_link_libraries(lhc_simulator ${Pythia8_LIBRARIES})
    target_include_directories(lhc_simulator PRIVATE ${Pythia8_INCLUDE_DIRS})
endif()

# 安装规则
install(TARGETS lhc_simulator
    RUNTIME DESTINATION bin
)

install(DIRECTORY include/
    DESTINATION include
    FILES_MATCHING PATTERN "*.h"
)
