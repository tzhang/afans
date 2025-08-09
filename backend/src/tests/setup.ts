import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// 全局变量
declare global {
  var __MONGO__: MongoMemoryServer;
  var generateAuthToken: (userId: string) => string;
  var createMockUser: () => any;
  var createMockCreator: () => any;
}

// 在所有测试开始前启动内存数据库
beforeAll(async () => {
  global.__MONGO__ = await MongoMemoryServer.create();
  const uri = global.__MONGO__.getUri();
  
  await mongoose.connect(uri);
  
  // 确保索引被创建
  if (mongoose.connection.db) {
    await mongoose.connection.db.collection('users').createIndex({ email: 1 }, { unique: true });
    await mongoose.connection.db.collection('users').createIndex({ username: 1 }, { unique: true });
  }
});

// 在每个测试前清理数据库
beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// 在所有测试结束后关闭数据库连接
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await global.__MONGO__.stop();
});

// 工具函数
global.generateAuthToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'test-secret', {
    expiresIn: '1h',
  });
};

global.createMockUser = () => ({
  _id: new mongoose.Types.ObjectId(),
  username: 'testuser',
  email: 'test@example.com',
  password: 'hashedpassword',
  isVerified: true,
  isCreator: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

global.createMockCreator = () => ({
  _id: new mongoose.Types.ObjectId(),
  userId: new mongoose.Types.ObjectId(),
  displayName: 'Test Creator',
  description: 'Test description',
  category: 'fitness',
  isVerified: false,
  subscriberCount: 0,
  totalEarnings: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Mock multer for file upload tests
jest.mock('multer', () => {
  const multer = () => ({
    single: (fieldName: string) => (req: any, res: any, next: any) => {
      if (fieldName === 'video') {
        req.file = {
          filename: 'test-video.mp4',
          originalname: 'test.mp4',
          path: '/uploads/videos/test-video.mp4',
          size: 1000000,
          mimetype: 'video/mp4',
        };
      } else if (fieldName === 'thumbnail') {
        req.file = {
          filename: 'test-thumb.jpg',
          originalname: 'test.jpg',
          path: '/uploads/thumbnails/test-thumb.jpg',
          size: 100000,
          mimetype: 'image/jpeg',
        };
      }
      next();
    },
    fields: () => (req: any, res: any, next: any) => {
      req.files = {
        video: [{
          filename: 'test-video.mp4',
          originalname: 'test.mp4',
          path: '/uploads/videos/test-video.mp4',
          size: 1000000,
          mimetype: 'video/mp4',
        }],
        thumbnail: [{
          filename: 'test-thumb.jpg',
          originalname: 'test.jpg',
          path: '/uploads/thumbnails/test-thumb.jpg',
          size: 100000,
          mimetype: 'image/jpeg',
        }],
      };
      next();
    },
  });
  
  multer.diskStorage = () => ({});
  
  return multer;
});

// Mock fs for file operations
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(() => true),
  mkdirSync: jest.fn(),
}));