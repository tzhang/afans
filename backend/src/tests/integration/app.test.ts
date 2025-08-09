import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { User } from '../../models/User';
import { Creator } from '../../models/Creator';
import { Content } from '../../models/Content';
import authRoutes from '../../routes/auth';
import contentRoutes from '../../routes/content';

// 创建测试应用
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);

// 测试数据工厂
class TestDataFactory {
  static async createUser(overrides = {}) {
    const bcrypt = require('bcryptjs');
    const randomSuffix = Math.random().toString(36).substr(2, 6);
    const defaultData = {
      username: `user_${randomSuffix}`,
      email: `test_${randomSuffix}@example.com`,
      password: await bcrypt.hash('password123', 10),
      isVerified: true,
    };
    
    return await User.create({ ...defaultData, ...overrides });
  }

  static async createCreator(userId: string, overrides = {}) {
    const randomSuffix = Math.random().toString(36).substr(2, 6);
    const defaultData = {
      userId,
      displayName: `Creator_${randomSuffix}`,
      description: 'Test creator description',
      category: 'fitness',
    };
    return await Creator.create({ ...defaultData, ...overrides });
  }

  static async createContent(creatorId: string, overrides = {}) {
    const defaultData = {
      title: `Test Content ${Date.now()}`,
      description: 'Test content description',
      creatorId,
      contentType: 'video',
      videoUrl: '/uploads/videos/test.mp4',
      thumbnailUrl: '/uploads/thumbnails/test.jpg',
      isPublic: true,
      category: 'fitness',
      status: 'published',
      publishedAt: new Date(),
      tags: ['test'],
    };
    return await Content.create({ ...defaultData, ...overrides });
  }

  static async authenticateUser(user: any) {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: user.email,
        password: 'password123',
      });
    


    
    if (!loginResponse.body.success || !loginResponse.body.data) {
      throw new Error(`Login failed: ${loginResponse.body.message || 'Unknown error'}`);
    }
    
    return loginResponse.body.data.token;
  }

  static async setupUserWithCreator() {
    const user = await this.createUser({ isCreator: true });
    const creator = await this.createCreator((user._id as any).toString());
    const token = await this.authenticateUser(user);
    return { user, creator, token };
  }
}

// 测试清理工具
class TestCleanup {
  private static createdIds = {
    users: [] as string[],
    creators: [] as string[],
    contents: [] as string[],
  };

  static trackUser(id: string) {
    this.createdIds.users.push(id);
  }

  static trackCreator(id: string) {
    this.createdIds.creators.push(id);
  }

  static trackContent(id: string) {
    this.createdIds.contents.push(id);
  }

  static async cleanupAll() {
    await Promise.all([
      Content.deleteMany({ _id: { $in: this.createdIds.contents } }),
      Creator.deleteMany({ _id: { $in: this.createdIds.creators } }),
      User.deleteMany({ _id: { $in: this.createdIds.users } }),
    ]);
    this.createdIds = { users: [], creators: [], contents: [] };
  }
}

describe('Integration Tests - Complete User Journey', () => {
  // 全局清理
  afterEach(async () => {
    await TestCleanup.cleanupAll();
  });

  describe('User Registration and Authentication Flow', () => {
    it('should complete full registration and login flow', async () => {
      // 1. 注册新用户
      const registrationData = {
        username: 'integrationuser',
        email: 'integration@example.com',
        password: 'password123',
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(registrationData)
        .expect(201);

      expect(registerResponse.body.success).toBe(true);
      expect(registerResponse.body.data.token).toBeDefined();
      const userId = registerResponse.body.data.user.id;
      TestCleanup.trackUser(userId);

      // 2. 验证用户已创建
      const user = await User.findById(userId);
      expect(user).toBeTruthy();
      expect(user?.username).toBe(registrationData.username);

      // 3. 登录
      const loginData = {
        email: registrationData.email,
        password: registrationData.password,
      };

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.data.token).toBeDefined();
    });
  });

  describe('Creator Profile Creation Flow', () => {
    it('should create creator profile', async () => {
      // 1. 创建用户
      const user = await TestDataFactory.createUser({ isCreator: true });
      TestCleanup.trackUser((user._id as any).toString());

      // 2. 创建创作者资料
      const creator = await TestDataFactory.createCreator((user._id as any).toString(), {
        displayName: 'Integration Creator',
        description: 'Test creator for integration tests',
      });
      TestCleanup.trackCreator((creator._id as any).toString());

      // 3. 验证创作者资料已创建
      const savedCreator = await Creator.findById(creator._id);
      expect(savedCreator).toBeTruthy();
      expect(savedCreator?.displayName).toBe('Integration Creator');
    });
  });

  describe('Content Creation and Management Flow', () => {
    it('should upload video and create content', async () => {
      // 1. 设置用户和创作者
      const { user, creator, token } = await TestDataFactory.setupUserWithCreator();
      TestCleanup.trackUser((user._id as any).toString());
      TestCleanup.trackCreator((creator._id as any).toString());

      // 2. 上传视频文件
      const videoUploadResponse = await request(app)
        .post('/api/content/upload-video')
        .set('Authorization', `Bearer ${token}`)
        .attach('video', Buffer.from('fake video content'), 'integration-test.mp4')
        .expect(200);

      expect(videoUploadResponse.body.success).toBe(true);
      const videoUrl = videoUploadResponse.body.data.videoUrl;

      // 3. 上传缩略图
      const thumbnailUploadResponse = await request(app)
        .post('/api/content/upload-thumbnail')
        .set('Authorization', `Bearer ${token}`)
        .attach('thumbnail', Buffer.from('fake image content'), 'integration-thumb.jpg')
        .expect(200);

      expect(thumbnailUploadResponse.body.success).toBe(true);
      const thumbnailUrl = thumbnailUploadResponse.body.data.thumbnailUrl;

      // 4. 创建内容
      const contentData = {
        title: 'Integration Test Video',
        description: 'This is a test video for integration testing',
        contentType: 'video',
        videoUrl: videoUrl,
        thumbnailUrl: thumbnailUrl,
        category: 'fitness',
        tags: ['integration', 'test', 'fitness'],
        isPublic: true,
      };

      const createContentResponse = await request(app)
        .post('/api/content')
        .set('Authorization', `Bearer ${token}`)
        .send(contentData)
        .expect(201);

      expect(createContentResponse.body.success).toBe(true);
      expect(createContentResponse.body.data.title).toBe(contentData.title);
      const contentId = createContentResponse.body.data._id;
      TestCleanup.trackContent(contentId);

      // 5. 验证内容已保存
      const savedContent = await Content.findById(contentId);
      expect(savedContent).toBeTruthy();
      expect(savedContent?.title).toBe(contentData.title);
      expect(savedContent?.creatorId.toString()).toBe((creator._id as any).toString());
    });
  });

  describe('Content Discovery and Viewing Flow', () => {
    it('should discover and view content', async () => {
      // 1. 设置用户、创作者和内容
      const { user, creator, token } = await TestDataFactory.setupUserWithCreator();
      TestCleanup.trackUser((user._id as any).toString());
      TestCleanup.trackCreator((creator._id as any).toString());

      const content = await TestDataFactory.createContent((creator._id as any).toString(), {
        title: 'Integration Test Video',
        category: 'fitness',
        tags: ['integration', 'test'],
      });
      TestCleanup.trackContent((content._id as any).toString());

      // 2. 获取内容列表
      const contentListResponse = await request(app)
        .get('/api/content')
        .expect(200);

      expect(contentListResponse.body.success).toBe(true);
      expect(contentListResponse.body.data.content.length).toBeGreaterThan(0);

      // 3. 搜索内容
      const searchResponse = await request(app)
        .get('/api/content?search=Integration')
        .expect(200);

      expect(searchResponse.body.success).toBe(true);
      expect(searchResponse.body.data.content.length).toBeGreaterThan(0);

      // 4. 按分类筛选
      const categoryResponse = await request(app)
        .get('/api/content?category=fitness')
        .expect(200);

      expect(categoryResponse.body.success).toBe(true);
      expect(categoryResponse.body.data.content.length).toBeGreaterThan(0);

      // 5. 获取内容详情
      const contentDetailResponse = await request(app)
        .get(`/api/content/${content._id}`)
        .expect(200);

      expect(contentDetailResponse.body.success).toBe(true);
      expect(contentDetailResponse.body.data.title).toBe('Integration Test Video');
      expect(contentDetailResponse.body.data.creator).toBeDefined();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle authentication errors', async () => {
      // 1. 无效token
      const invalidTokenResponse = await request(app)
        .post('/api/content')
        .set('Authorization', 'Bearer invalid-token')
        .send({ title: 'Test' })
        .expect(401);

      expect(invalidTokenResponse.body.success).toBe(false);

      // 2. 缺少token
      const noTokenResponse = await request(app)
        .post('/api/content')
        .send({ title: 'Test' })
        .expect(401);

      expect(noTokenResponse.body.success).toBe(false);
    });

    it('should handle validation errors', async () => {
      // 1. 设置认证用户
      const { token } = await TestDataFactory.setupUserWithCreator();

      // 2. 创建内容时缺少必填字段
      const incompleteContentResponse = await request(app)
        .post('/api/content')
        .set('Authorization', `Bearer ${token}`)
        .send({ description: 'Missing title' })
        .expect(400);

      expect(incompleteContentResponse.body.success).toBe(false);

      // 3. 注册时邮箱格式错误
      const invalidEmailResponse = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser2',
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(400);

      expect(invalidEmailResponse.body.success).toBe(false);
    });

    it('should handle resource not found errors', async () => {
      // 1. 获取不存在的内容
      const fakeContentId = '507f1f77bcf86cd799439011';
      const notFoundResponse = await request(app)
        .get(`/api/content/${fakeContentId}`)
        .expect(404);

      expect(notFoundResponse.body.success).toBe(false);
      expect(notFoundResponse.body.message).toBe('内容不存在');
    });

    it('should handle permission errors', async () => {
      // 1. 设置用户和创作者
      const { creator } = await TestDataFactory.setupUserWithCreator();
      TestCleanup.trackCreator((creator._id as any).toString());

      // 2. 创建私有内容
      const privateContent = await TestDataFactory.createContent((creator._id as any).toString(), {
        title: 'Private Content',
        isPublic: false,
      });
      TestCleanup.trackContent((privateContent._id as any).toString());

      // 3. 尝试访问私有内容（未认证）
      const privateAccessResponse = await request(app)
        .get(`/api/content/${privateContent._id}`)
        .expect(403);

      expect(privateAccessResponse.body.success).toBe(false);
      expect(privateAccessResponse.body.message).toBe('无权访问此内容');
    });
  });

  describe('Performance and Pagination', () => {
    it('should handle pagination correctly', async () => {
      // 1. 设置用户和创作者
      const { creator } = await TestDataFactory.setupUserWithCreator();
      TestCleanup.trackCreator((creator._id as any).toString());

      // 2. 创建多个内容用于分页测试
      const contentPromises = [];
      for (let i = 1; i <= 15; i++) {
        const content = TestDataFactory.createContent((creator._id as any).toString(), {
          title: `Test Content ${i}`,
        });
        contentPromises.push(content);
      }
      const contents = await Promise.all(contentPromises);
      contents.forEach(content => TestCleanup.trackContent((content._id as any).toString()));

      // 3. 测试第一页
      const page1Response = await request(app)
        .get('/api/content?page=1&limit=10')
        .expect(200);

      expect(page1Response.body.success).toBe(true);
      expect(page1Response.body.data.content).toHaveLength(10);
      expect(page1Response.body.data.pagination.page).toBe(1);
      expect(page1Response.body.data.pagination.pages).toBeGreaterThan(1);

      // 4. 测试第二页
      const page2Response = await request(app)
        .get('/api/content?page=2&limit=10')
        .expect(200);

      expect(page2Response.body.success).toBe(true);
      expect(page2Response.body.data.content.length).toBeGreaterThan(0);
      expect(page2Response.body.data.pagination.page).toBe(2);
    });

    it('should handle large limit values', async () => {
      // 1. 设置用户和创作者
      const { creator } = await TestDataFactory.setupUserWithCreator();
      TestCleanup.trackCreator((creator._id as any).toString());

      // 2. 创建一些内容
      const content = await TestDataFactory.createContent((creator._id as any).toString());
      TestCleanup.trackContent((content._id as any).toString());

      // 3. 测试大限制值
      const largePageResponse = await request(app)
        .get('/api/content?limit=100')
        .expect(200);

      expect(largePageResponse.body.success).toBe(true);
      expect(largePageResponse.body.data.content.length).toBeGreaterThan(0);
    });
  });
});