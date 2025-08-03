#!/bin/bash

# ago.im 开发环境设置脚本
# 基于PRD V1.1简化版 - 专注订阅制内容变现平台

echo "🚀 开始设置 ago.im 开发环境..."

# 检查必要工具
echo "📋 检查开发工具..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js (推荐版本 18+)"
    echo "   下载地址: https://nodejs.org/"
    exit 1
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装"
    exit 1
fi

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker 未安装，建议安装用于容器化部署"
    echo "   下载地址: https://www.docker.com/"
fi

# 检查 Git
if ! command -v git &> /dev/null; then
    echo "❌ Git 未安装，请先安装 Git"
    exit 1
fi

echo "✅ 开发工具检查完成"

# 创建项目目录结构
echo "📁 创建项目目录结构..."

# 创建主要目录
mkdir -p {\
    "backend/{src/{controllers,services,models,middleware,utils,config},tests,docs}",\
    "frontend/{src/{components,pages,hooks,utils,services,assets},public,tests}",\
    "mobile/{src/{screens,components,services,utils},assets}",\
    "shared/{types,constants,utils}",\
    "infrastructure/{docker,kubernetes,terraform}",\
    "docs/{api,architecture,deployment}",\
    "scripts/{build,deploy,test}",\
    "config/{development,staging,production}"\
}

echo "✅ 目录结构创建完成"

# 初始化后端项目 (Node.js + Express + TypeScript)
echo "🔧 初始化后端项目..."
cd backend

# 创建 package.json
cat > package.json << 'EOF'
{
  "name": "ago-backend",
  "version": "1.0.0",
  "description": "ago.im 后端服务 - 订阅制内容变现平台",
  "main": "dist/index.js",
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.0.3",
    "stripe": "^14.9.0",
    "multer": "^1.4.5-lts.1",
    "joi": "^17.11.0",
    "winston": "^3.11.0",
    "redis": "^4.6.10"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/multer": "^1.4.11",
    "@types/node": "^20.10.5",
    "@types/jest": "^29.5.8",
    "typescript": "^5.3.3",
    "nodemon": "^3.0.2",
    "ts-node": "^10.9.1",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "@typescript-eslint/parser": "^6.15.0"
  }
}
EOF

# 创建 TypeScript 配置
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
EOF

# 创建环境变量模板
cat > .env.example << 'EOF'
# 服务配置
PORT=3000
NODE_ENV=development

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/ago_dev
REDIS_URL=redis://localhost:6379

# JWT配置
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# 支付配置
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# 文件存储配置
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=ago-content-bucket

# 邮件配置
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# 安全配置
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

cd ..

# 初始化前端项目 (React + TypeScript + Vite)
echo "🎨 初始化前端项目..."
cd frontend

# 创建 package.json
cat > package.json << 'EOF'
{
  "name": "ago-frontend",
  "version": "1.0.0",
  "description": "ago.im 前端应用 - 订阅制内容变现平台",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "@tanstack/react-query": "^5.12.2",
    "axios": "^1.6.2",
    "zustand": "^4.4.7",
    "@stripe/stripe-js": "^2.2.2",
    "@stripe/react-stripe-js": "^2.4.0",
    "react-hook-form": "^7.48.2",
    "@hookform/resolvers": "^3.3.2",
    "zod": "^3.22.4",
    "lucide-react": "^0.294.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.2.2",
    "vite": "^5.0.8",
    "vitest": "^1.0.4",
    "@vitest/ui": "^1.0.4"
  }
}
EOF

# 创建 Vite 配置
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
EOF

# 创建 Tailwind CSS 配置
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
}
EOF

cd ..

# 创建共享类型定义
echo "📝 创建共享类型定义..."
cat > shared/types/index.ts << 'EOF'
// ago.im 共享类型定义

// 用户相关类型
export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 创作者相关类型
export interface Creator {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  monthlySubscriptionPrice: number;
  subscriberCount: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 内容相关类型
export interface Content {
  id: string;
  creatorId: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  contentType: 'free' | 'subscription';
  tags: string[];
  viewCount: number;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// 订阅相关类型
export interface Subscription {
  id: string;
  userId: string;
  creatorId: string;
  monthlyPrice: number;
  status: 'active' | 'cancelled' | 'expired';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 支付相关类型
export interface SubscriptionOrder {
  id: string;
  userId: string;
  creatorId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'stripe' | 'paypal';
  stripePaymentIntentId?: string;
  billingPeriod: 'monthly';
  createdAt: Date;
  updatedAt: Date;
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 分页类型
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
EOF

# 创建 Docker 配置
echo "🐳 创建 Docker 配置..."
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # MongoDB 数据库
  mongodb:
    image: mongo:7.0
    container_name: ago-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: ago_dev
    volumes:
      - mongodb_data:/data/db
      - ./infrastructure/docker/mongodb/init.js:/docker-entrypoint-initdb.d/init.js:ro

  # Redis 缓存
  redis:
    image: redis:7.2-alpine
    container_name: ago-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # 后端服务
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    container_name: ago-backend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
      MONGODB_URI: mongodb://admin:password@mongodb:27017/ago_dev?authSource=admin
      REDIS_URL: redis://redis:6379
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - mongodb
      - redis
    command: npm run dev

  # 前端服务
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    container_name: ago-frontend
    restart: unless-stopped
    ports:
      - "3001:3001"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev

volumes:
  mongodb_data:
  redis_data:
EOF

# 创建开发脚本
echo "📜 创建开发脚本..."
cat > scripts/dev.sh << 'EOF'
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
EOF

chmod +x scripts/dev.sh

# 创建 README
echo "📖 创建项目文档..."
cat > README.md << 'EOF'
# ago.im - 订阅制内容变现平台

> 专注于创作者订阅制变现的简洁视频内容平台

## 🎯 项目概述

ago.im 是一个专注订阅制的个人视频创作者变现平台，支持：

- 🎬 视频内容发布与管理
- 💰 灵活的月度订阅定价
- 🆓 免费内容试看策略
- 👥 用户订阅与互动
- 📊 数据分析与收益管理

## 🏗️ 技术架构

### 后端技术栈
- **运行时**: Node.js + TypeScript
- **框架**: Express.js
- **数据库**: MongoDB + Redis
- **支付**: Stripe + PayPal
- **存储**: AWS S3
- **认证**: JWT + OAuth 2.0

### 前端技术栈
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **状态管理**: Zustand
- **数据获取**: TanStack Query
- **样式**: Tailwind CSS
- **表单**: React Hook Form + Zod

## 🚀 快速开始

### 环境要求
- Node.js 18+
- Docker & Docker Compose
- Git

### 安装与启动

1. **设置开发环境**
   ```bash
   chmod +x setup-dev-environment.sh
   ./setup-dev-environment.sh
   ```

2. **配置环境变量**
   ```bash
   cp backend/.env.example backend/.env
   # 编辑 backend/.env 填入实际配置
   ```

3. **启动开发服务**
   ```bash
   ./scripts/dev.sh
   ```

4. **访问应用**
   - 前端: http://localhost:3001
   - 后端: http://localhost:3000
   - API文档: http://localhost:3000/api/docs

## 📁 项目结构

```
ago.im/
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── controllers/     # 控制器
│   │   ├── services/        # 业务逻辑
│   │   ├── models/          # 数据模型
│   │   ├── middleware/      # 中间件
│   │   └── utils/           # 工具函数
│   └── tests/               # 测试文件
├── frontend/                # 前端应用
│   ├── src/
│   │   ├── components/      # React 组件
│   │   ├── pages/           # 页面组件
│   │   ├── hooks/           # 自定义 Hooks
│   │   └── services/        # API 服务
│   └── public/              # 静态资源
├── shared/                  # 共享代码
│   ├── types/               # TypeScript 类型
│   └── utils/               # 共享工具
├── infrastructure/          # 基础设施
│   ├── docker/              # Docker 配置
│   └── kubernetes/          # K8s 配置
└── docs/                    # 项目文档
```

## 🔧 开发命令

### 后端开发
```bash
cd backend
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run test         # 运行测试
npm run lint         # 代码检查
```

### 前端开发
```bash
cd frontend
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run test         # 运行测试
npm run lint         # 代码检查
```

## 📋 开发规范

### 代码规范
- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 配置的代码风格
- 组件和函数使用 JSDoc 注释
- Git 提交信息遵循 Conventional Commits

### 分支策略
- `main`: 生产环境分支
- `develop`: 开发环境分支
- `feature/*`: 功能开发分支
- `hotfix/*`: 紧急修复分支

## 🧪 测试策略

- **单元测试**: Jest + Testing Library
- **集成测试**: API 接口测试
- **E2E 测试**: Playwright
- **性能测试**: 负载和压力测试

## 📚 相关文档

- [PRD - 产品需求文档](./PRD-产品需求文档.md)
- [敏捷开发项目实施计划](./敏捷开发项目实施计划.md)
- [API 文档](./docs/api/)
- [部署指南](./docs/deployment/)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

**ago.im** - 让创作者专注创作，让订阅更有价值 🎬✨
EOF

echo "✅ ago.im 开发环境设置完成！"
echo ""
echo "📋 下一步操作："
echo "1. 配置环境变量: cp backend/.env.example backend/.env"
echo "2. 编辑 backend/.env 填入实际配置（数据库、支付等）"
echo "3. 启动开发环境: ./scripts/dev.sh"
echo ""
echo "🌐 访问地址："
echo "   前端: http://localhost:3001"
echo "   后端: http://localhost:3000"
echo ""
echo "📖 查看 README.md 了解更多信息"