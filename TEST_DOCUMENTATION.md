# MVP1.0 自动化测试文档

## 概述

本文档描述了 ago.im 平台 MVP1.0 版本的自动化测试套件。测试覆盖了前端、后端和集成测试，确保核心功能的稳定性和可靠性。

## 测试架构

### 前端测试 (Frontend Tests)
- **框架**: Vitest + React Testing Library
- **覆盖范围**: 组件测试、API 服务测试、用户交互测试
- **位置**: `frontend/src/tests/`

### 后端测试 (Backend Tests)
- **框架**: Jest + Supertest + MongoDB Memory Server
- **覆盖范围**: API 路由测试、数据库模型测试、中间件测试
- **位置**: `backend/src/tests/`

### 集成测试 (Integration Tests)
- **框架**: Jest + Supertest
- **覆盖范围**: 端到端用户流程测试
- **位置**: `backend/src/tests/integration/`

## 测试用例详情

### 1. 前端测试用例

#### 1.1 页面组件测试 (`frontend/src/tests/pages/`)

**UploadPage.test.tsx**
- ✅ 组件正确渲染
- ✅ 表单验证（必填字段、文件类型、文件大小）
- ✅ 文件选择和预览
- ✅ 标签添加和删除
- ✅ 表单提交流程
- ✅ 上传进度显示
- ✅ 错误处理

#### 1.2 API 服务测试 (`frontend/src/tests/services/`)

**api.test.ts**
- ✅ 内容 API 测试
  - 获取内容列表
  - 获取内容详情
  - 视频上传
  - 缩略图上传
  - 内容创建
- ✅ 用户 API 测试
  - 获取当前用户
  - 更新用户资料
- ✅ 创作者 API 测试
  - 获取创作者信息
  - 更新创作者资料
- ✅ API 错误处理

### 2. 后端测试用例

#### 2.1 认证路由测试 (`backend/src/tests/routes/auth.test.ts`)

**用户注册测试**
- ✅ 成功注册新用户
- ✅ 重复邮箱错误处理
- ✅ 无效邮箱格式验证
- ✅ 密码长度验证

**用户登录测试**
- ✅ 有效凭据登录成功
- ✅ 无效邮箱错误处理
- ✅ 错误密码处理
- ✅ 未验证邮箱处理

**登出测试**
- ✅ 成功登出

#### 2.2 内容路由测试 (`backend/src/tests/routes/content.test.ts`)

**内容列表测试**
- ✅ 获取公开内容（无认证）
- ✅ 获取所有内容（有认证）
- ✅ 分类筛选
- ✅ 搜索功能
- ✅ 分页功能

**内容详情测试**
- ✅ 根据 ID 获取内容
- ✅ 浏览量自动增加
- ✅ 不存在内容的 404 处理
- ✅ 私有内容权限控制

**内容创建测试**
- ✅ 成功创建内容
- ✅ 认证要求
- ✅ 创作者权限要求
- ✅ 必填字段验证

**文件上传测试**
- ✅ 视频上传成功
- ✅ 缩略图上传成功
- ✅ 上传认证要求

#### 2.3 数据库模型测试 (`backend/src/tests/models/User.test.ts`)

**用户创建测试**
- ✅ 有效数据创建用户
- ✅ 必填字段验证（用户名、邮箱、密码）
- ✅ 唯一性约束（邮箱、用户名）
- ✅ 邮箱格式验证
- ✅ 密码长度验证

**用户方法测试**
- ✅ 密码比较功能
- ✅ 用户资料更新
- ✅ 邮箱验证状态

**用户查询测试**
- ✅ 根据邮箱查找用户
- ✅ 根据用户名查找用户
- ✅ 查找已验证用户
- ✅ 用户计数

### 3. 集成测试用例 (`backend/src/tests/integration/app.test.ts`)

#### 3.1 完整用户流程测试

**注册和认证流程**
- ✅ 完整的注册和登录流程
- ✅ 用户数据验证
- ✅ Token 生成和验证

**创作者资料创建流程**
- ✅ 创建创作者资料
- ✅ 用户角色更新
- ✅ 创作者数据验证

**内容创建和管理流程**
- ✅ 视频文件上传
- ✅ 缩略图上传
- ✅ 内容记录创建
- ✅ 数据关联验证

**内容发现和浏览流程**
- ✅ 内容列表获取
- ✅ 搜索功能
- ✅ 分类筛选
- ✅ 内容详情查看
- ✅ 浏览量统计

#### 3.2 错误处理和边界情况

**认证错误处理**
- ✅ 无效 Token 处理
- ✅ 缺失 Token 处理

**验证错误处理**
- ✅ 缺失必填字段
- ✅ 无效数据格式

**资源不存在处理**
- ✅ 404 错误处理
- ✅ 权限错误处理

#### 3.3 性能和分页测试

**分页功能**
- ✅ 正确的分页逻辑
- ✅ 页码和限制参数
- ✅ 大数据量处理

## 运行测试

### 快速开始

```bash
# 运行所有测试
./test-runner.sh

# 仅运行后端测试
./test-runner.sh backend

# 仅运行前端测试
./test-runner.sh frontend

# 生成测试报告
./test-runner.sh report
```

### 手动运行

#### 前端测试
```bash
cd frontend
npm test
```

#### 后端测试
```bash
cd backend
npm test
```

#### 监视模式
```bash
# 前端
cd frontend
npm test -- --watch

# 后端
cd backend
npm run test:watch
```

## 测试配置

### 前端测试配置
- **配置文件**: `frontend/vitest.config.ts`
- **设置文件**: `frontend/src/tests/setup.ts`
- **环境**: JSDOM
- **覆盖率**: 自动生成

### 后端测试配置
- **配置文件**: `backend/jest.config.js`
- **设置文件**: `backend/src/tests/setup.ts`
- **数据库**: MongoDB Memory Server
- **覆盖率**: 自动生成

## 测试覆盖率目标

| 组件 | 目标覆盖率 | 当前状态 |
|------|------------|----------|
| 后端 API 路由 | 90%+ | ✅ |
| 后端数据模型 | 95%+ | ✅ |
| 前端组件 | 80%+ | ✅ |
| 前端服务 | 90%+ | ✅ |
| 集成测试 | 核心流程 100% | ✅ |

## 持续集成

### GitHub Actions 配置建议

```yaml
name: MVP1.0 Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:latest
        ports:
          - 27017:27017
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd backend && npm install
          cd ../frontend && npm install
          
      - name: Run tests
        run: ./test-runner.sh
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## 测试数据管理

### Mock 数据
- 用户数据: 测试用户、创作者资料
- 内容数据: 视频文件、缩略图、元数据
- 文件上传: Mock multer 中间件

### 数据清理
- 每个测试前自动清理数据库
- 测试结束后清理临时文件
- 内存数据库自动销毁

## 故障排除

### 常见问题

1. **MongoDB 连接失败**
   - 确保 MongoDB Memory Server 正确安装
   - 检查端口冲突

2. **文件上传测试失败**
   - 验证 multer mock 配置
   - 检查文件路径权限

3. **前端测试环境问题**
   - 确保 JSDOM 正确配置
   - 检查 React Testing Library 版本

### 调试技巧

```bash
# 详细输出
npm test -- --verbose

# 单个测试文件
npm test -- auth.test.ts

# 调试模式
npm test -- --inspect-brk
```

## 测试最佳实践

1. **测试隔离**: 每个测试独立运行，不依赖其他测试
2. **数据清理**: 测试前后清理数据，避免数据污染
3. **Mock 外部依赖**: 文件系统、第三方 API 等
4. **描述性命名**: 测试名称清楚描述测试内容
5. **边界测试**: 测试正常情况和异常情况
6. **性能考虑**: 避免过长的测试运行时间

## 未来扩展

### 计划添加的测试
- E2E 测试 (Playwright/Cypress)
- 性能测试 (负载测试)
- 安全测试 (渗透测试)
- 可访问性测试
- 移动端测试

### 测试工具升级
- 测试报告可视化
- 测试覆盖率趋势分析
- 自动化测试部署
- 测试数据生成工具

---

**测试状态**: ✅ 所有测试通过  
**最后更新**: 2024年  
**维护者**: 开发团队