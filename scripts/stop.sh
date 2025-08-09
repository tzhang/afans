#!/bin/bash

# ago.im 一键停止所有服务脚本

echo "🛑 停止 ago.im 所有服务..."

# 停止前端和后端开发服务器
echo "📱 停止前端和后端服务器..."
pkill -f "npm run dev" 2>/dev/null || echo "没有找到运行中的 npm dev 进程"
pkill -f "node.*vite" 2>/dev/null || echo "没有找到运行中的 Vite 进程"
pkill -f "nodemon" 2>/dev/null || echo "没有找到运行中的 nodemon 进程"
pkill -f "ts-node" 2>/dev/null || echo "没有找到运行中的 ts-node 进程"

# 停止 MongoDB
echo "📊 停止 MongoDB 服务..."
pkill -f "mongod" 2>/dev/null || echo "没有找到运行中的 MongoDB 进程"

# 停止 Redis
echo "🔴 停止 Redis 服务..."
pkill -f "redis-server" 2>/dev/null || echo "没有找到运行中的 Redis 进程"

# 停止 Docker 容器（如果使用 Docker）
echo "🐳 停止 Docker 容器..."
if command -v docker &> /dev/null; then
    docker-compose down 2>/dev/null || echo "没有找到运行中的 Docker Compose 服务"
    docker stop ago-mongodb ago-redis ago-backend ago-frontend 2>/dev/null || echo "没有找到指定的 Docker 容器"
else
    echo "Docker 未安装，跳过 Docker 容器停止"
fi

# 检查端口占用情况
echo "🔍 检查服务端口状态..."
echo "前端端口 (3001):"
lsof -i :3001 2>/dev/null || echo "端口 3001 无服务运行"
echo "后端端口 (3000):"
lsof -i :3000 2>/dev/null || echo "端口 3000 无服务运行"
echo "MongoDB 端口 (27017):"
lsof -i :27017 2>/dev/null || echo "端口 27017 无服务运行"
echo "Redis 端口 (6379):"
lsof -i :6379 2>/dev/null || echo "端口 6379 无服务运行"

# 清理临时文件
echo "🧹 清理临时文件..."
rm -f /tmp/mongodb.log 2>/dev/null || true
rm -rf /tmp/mongodb 2>/dev/null || true

echo "✅ 所有服务已停止！"
echo "💡 如需重新启动，请运行: ./scripts/dev.sh"