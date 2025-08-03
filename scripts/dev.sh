#!/bin/bash

# ago.im 开发启动脚本

echo "🚀 启动 ago.im 开发环境..."

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 启动数据库服务
echo "📊 启动数据库服务..."
docker-compose up -d mongodb redis

# 等待数据库启动
echo "⏳ 等待数据库启动..."
sleep 10

# 安装依赖（如果需要）
if [ ! -d "backend/node_modules" ]; then
    echo "📦 安装后端依赖..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 安装前端依赖..."
    cd frontend && npm install && cd ..
fi

# 启动开发服务器
echo "🔧 启动开发服务器..."

# 在后台启动后端
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# 在后台启动前端
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ 开发环境启动完成！"
echo "📱 前端地址: http://localhost:3001"
echo "🔧 后端地址: http://localhost:3000"
echo "📊 MongoDB: mongodb://localhost:27017"
echo "🔴 Redis: redis://localhost:6379"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待中断信号
trap 'echo "\n🛑 停止开发服务器..."; kill $BACKEND_PID $FRONTEND_PID; docker-compose down; exit' INT
wait
