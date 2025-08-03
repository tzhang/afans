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
