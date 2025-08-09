import request from 'supertest';
import app from '../../app';
import { User } from '../../models/User';
import { Creator } from '../../models/Creator';
import { Content } from '../../models/Content';

describe('Content Routes', () => {
  let user: any;
  let creator: any;
  let authToken: string;

  beforeEach(async () => {
    // 创建测试用户
    user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
      isVerified: true,
      isCreator: true,
    });

    // 创建测试创作者
    creator = await Creator.create({
      userId: user._id,
      displayName: 'Test Creator',
      description: 'Test description',
      category: 'fitness',
    });

    authToken = generateAuthToken(user._id.toString());
  });

  describe('GET /content', () => {
    beforeEach(async () => {
      // 创建测试内容
      await Content.create([
        {
          title: 'Public Video 1',
          description: 'Public content',
          creatorId: creator._id,
          contentType: 'video',
          videoUrl: '/uploads/videos/video1.mp4',
          thumbnailUrl: '/uploads/thumbnails/thumb1.jpg',
          isPublic: true,
          category: 'fitness',
          tags: ['workout', 'fitness'],
          status: 'published',
          publishedAt: new Date()
        },
        {
          title: 'Private Video 1',
          description: 'Private content',
          creatorId: creator._id,
          contentType: 'video',
          videoUrl: '/uploads/videos/video2.mp4',
          thumbnailUrl: '/uploads/thumbnails/thumb2.jpg',
          isPublic: false,
          category: 'fitness',
          tags: ['premium'],
          status: 'published',
          publishedAt: new Date()
        },
      ]);
    });

    it('should get public content list without authentication', async () => {
      const response = await request(app)
        .get('/api/content')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.content).toHaveLength(1);
      expect(response.body.data.content[0].title).toBe('Public Video 1');
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should get all content with authentication', async () => {
      const response = await request(app)
        .get('/api/content')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.content.length).toBeGreaterThanOrEqual(1);
    });

    it('should filter content by category', async () => {
      const response = await request(app)
        .get('/api/content?category=fitness')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.content[0].category).toBe('fitness');
    });

    it('should search content by title', async () => {
      const response = await request(app)
        .get('/api/content?search=Public')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.content[0].title).toContain('Public');
    });

    it('should paginate content correctly', async () => {
      const response = await request(app)
        .get('/api/content?page=1&limit=1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.content).toHaveLength(1);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(1);
    });
  });

  describe('GET /content/:id', () => {
    let content: any;

    beforeEach(async () => {
      content = await Content.create({
        title: 'Test Video',
        description: 'Test description',
        creatorId: creator._id,
        contentType: 'video',
        videoUrl: '/uploads/videos/test.mp4',
        thumbnailUrl: '/uploads/thumbnails/test.jpg',
        isPublic: true,
        category: 'fitness',
        tags: ['test'],
        viewCount: 0,
        status: 'published',
        publishedAt: new Date()
      });
    });

    it('should get content by id', async () => {
      const response = await request(app)
        .get(`/api/content/${content._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Test Video');
      expect(response.body.data.creator).toBeDefined();
      expect(response.body.data.creator.displayName).toBe('Test Creator');
    });

    it('should increment views when getting content', async () => {
      await request(app)
        .get(`/api/content/${content._id}`)
        .expect(200);

      // 检查浏览量是否增加
      const updatedContent = await Content.findById(content._id);
      expect((updatedContent as any)?.viewCount).toBe(1);
    });

    it('should return 404 for non-existent content', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/content/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('内容不存在');
    });

    it('should return 403 for private content without permission', async () => {
      // 创建私有内容
      const privateContent = await Content.create({
        title: 'Private Video',
        description: 'Private description',
        creatorId: creator._id,
        contentType: 'video',
        videoUrl: '/uploads/videos/private.mp4',
        isPublic: false,
        category: 'fitness',
        status: 'published',
        publishedAt: new Date()
      });

      const response = await request(app)
        .get(`/api/content/${privateContent._id}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('无权访问此内容');
    });
  });

  describe('POST /content', () => {
    it('should create content successfully', async () => {
      const contentData = {
        title: 'New Video',
        description: 'New video description',
        contentType: 'video',
        videoUrl: '/uploads/videos/new.mp4',
        thumbnailUrl: '/uploads/thumbnails/new.jpg',
        category: 'fitness',
        tags: ['new', 'video'],
        isPublic: true,
      };

      const response = await request(app)
        .post('/api/content')
        .set('Authorization', `Bearer ${authToken}`)
        .send(contentData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(contentData.title);
      expect(response.body.data.creatorId).toBe(creator._id.toString());

      // 验证内容已保存到数据库
      const savedContent = await Content.findById(response.body.data._id);
      expect(savedContent).toBeTruthy();
      expect(savedContent?.title).toBe(contentData.title);
    });

    it('should require authentication', async () => {
      const contentData = {
        title: 'New Video',
        description: 'New video description',
        contentType: 'video',
        videoUrl: '/uploads/videos/new.mp4',
      };

      const response = await request(app)
        .post('/api/content')
        .send(contentData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should require creator profile', async () => {
      // 创建没有创作者资料的用户
      const newUser = await User.create({
        username: 'newuser',
        email: 'new@example.com',
        password: 'hashedpassword',
        isEmailVerified: true,
      });

      const newUserToken = generateAuthToken((newUser._id as any).toString());

      const contentData = {
        title: 'New Video',
        description: 'New video description',
        contentType: 'video',
        videoUrl: '/uploads/videos/new.mp4',
      };

      const response = await request(app)
        .post('/api/content')
        .set('Authorization', `Bearer ${newUserToken}`)
        .send(contentData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('需要创作者权限');
    });

    it('should validate required fields', async () => {
      const incompleteData = {
        description: 'Missing title',
      };

      const response = await request(app)
        .post('/api/content')
        .set('Authorization', `Bearer ${authToken}`)
        .send(incompleteData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /content/upload-video', () => {
    it('should upload video successfully', async () => {
      const response = await request(app)
        .post('/api/content/upload-video')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('video', Buffer.from('fake video content'), 'test.mp4')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.filename).toBeDefined();
      expect(response.body.data.videoUrl).toBeDefined();
      expect(response.body.data.originalName).toBeDefined();
      expect(response.body.data.size).toBeDefined();
      expect(response.body.data.mimetype).toBeDefined();
    });

    it('should require authentication for video upload', async () => {
      const response = await request(app)
        .post('/api/content/upload-video')
        .attach('video', Buffer.from('fake video content'), 'test.mp4')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /content/upload-thumbnail', () => {
    it('should upload thumbnail successfully', async () => {
      const response = await request(app)
        .post('/api/content/upload-thumbnail')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('thumbnail', Buffer.from('fake image content'), 'test.jpg')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.filename).toBeDefined();
      expect(response.body.data.thumbnailUrl).toBeDefined();
      expect(response.body.data.originalName).toBeDefined();
      expect(response.body.data.size).toBeDefined();
      expect(response.body.data.mimetype).toBeDefined();
    });

    it('should require authentication for thumbnail upload', async () => {
      const response = await request(app)
        .post('/api/content/upload-thumbnail')
        .attach('thumbnail', Buffer.from('fake image content'), 'test.jpg')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});