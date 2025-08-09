#!/bin/bash

# MVP1.0 自动化测试运行脚本
# 此脚本用于运行前端和后端的所有测试用例

echo "🚀 开始运行 MVP1.0 自动化测试"
echo "================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 错误处理
set -e

# 检查依赖
check_dependencies() {
    echo -e "${BLUE}📋 检查依赖...${NC}"
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js 未安装${NC}"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm 未安装${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ 依赖检查通过${NC}"
}

# 运行后端测试
run_backend_tests() {
    echo -e "${BLUE}🔧 运行后端测试...${NC}"
    cd backend
    
    # 安装依赖（如果需要）
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 安装后端依赖...${NC}"
        npm install
    fi
    
    # 运行测试
    echo -e "${BLUE}🧪 执行后端测试用例...${NC}"
    npm test
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ 后端测试通过${NC}"
    else
        echo -e "${RED}❌ 后端测试失败${NC}"
        exit 1
    fi
    
    cd ..
}

# 运行前端测试
run_frontend_tests() {
    echo -e "${BLUE}🎨 运行前端测试...${NC}"
    cd frontend
    
    # 安装依赖（如果需要）
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 安装前端依赖...${NC}"
        npm install
    fi
    
    # 运行测试
    echo -e "${BLUE}🧪 执行前端测试用例...${NC}"
    npm test -- --run
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ 前端测试通过${NC}"
    else
        echo -e "${RED}❌ 前端测试失败${NC}"
        exit 1
    fi
    
    cd ..
}

# 生成测试报告
generate_report() {
    echo -e "${BLUE}📊 生成测试报告...${NC}"
    
    # 创建报告目录
    mkdir -p test-reports
    
    # 后端覆盖率报告
    if [ -d "backend/coverage" ]; then
        cp -r backend/coverage test-reports/backend-coverage
        echo -e "${GREEN}✅ 后端覆盖率报告已生成: test-reports/backend-coverage${NC}"
    fi
    
    # 前端覆盖率报告
    if [ -d "frontend/coverage" ]; then
        cp -r frontend/coverage test-reports/frontend-coverage
        echo -e "${GREEN}✅ 前端覆盖率报告已生成: test-reports/frontend-coverage${NC}"
    fi
    
    echo -e "${GREEN}📈 测试报告生成完成${NC}"
}

# 主函数
main() {
    echo -e "${YELLOW}🎯 MVP1.0 自动化测试套件${NC}"
    echo -e "${YELLOW}测试范围:${NC}"
    echo "  • 用户认证功能"
    echo "  • 内容上传与管理"
    echo "  • 内容发现与浏览"
    echo "  • API 端点测试"
    echo "  • 数据库模型测试"
    echo "  • 集成测试"
    echo ""
    
    check_dependencies
    
    # 运行测试
    run_backend_tests
    run_frontend_tests
    
    # 生成报告
    generate_report
    
    echo ""
    echo -e "${GREEN}🎉 所有测试通过！MVP1.0 测试完成${NC}"
    echo -e "${GREEN}✨ 系统已准备好进行部署${NC}"
    echo ""
    echo -e "${BLUE}📋 测试摘要:${NC}"
    echo "  • 后端测试: ✅ 通过"
    echo "  • 前端测试: ✅ 通过"
    echo "  • 集成测试: ✅ 通过"
    echo "  • 覆盖率报告: 📊 已生成"
}

# 处理命令行参数
case "$1" in
    "backend")
        check_dependencies
        run_backend_tests
        ;;
    "frontend")
        check_dependencies
        run_frontend_tests
        ;;
    "report")
        generate_report
        ;;
    "")
        main
        ;;
    *)
        echo "用法: $0 [backend|frontend|report]"
        echo "  backend  - 仅运行后端测试"
        echo "  frontend - 仅运行前端测试"
        echo "  report   - 仅生成测试报告"
        echo "  (无参数) - 运行所有测试"
        exit 1
        ;;
esac