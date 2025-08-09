import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { contentAPI, userAPI, creatorAPI } from '../../services/api';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

// Mock axios instance
const mockAxiosInstance = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() }
  }
};

mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

describe('API Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('contentAPI', () => {
    it('应该获取内容列表', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            contents: [{ id: '1', title: '测试视频' }],
            pagination: { page: 1, limit: 10, total: 1 }
          }
        }
      };
      
      mockAxiosInstance.get.mockResolvedValue(mockResponse);
      
      const result = await contentAPI.getContentList({ page: 1, limit: 10 });
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/content', {
        params: { page: 1, limit: 10 }
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('应该获取内容详情', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { id: '1', title: '测试视频', description: '测试描述' }
        }
      };
      
      mockAxiosInstance.get.mockResolvedValue(mockResponse);
      
      const result = await contentAPI.getContentById('1');
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/content/1');
      expect(result).toEqual(mockResponse.data);
    });

    it('应该上传视频文件', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            videoUrl: '/uploads/videos/test.mp4',
            filename: 'test.mp4'
          }
        }
      };
      
      mockAxiosInstance.post.mockResolvedValue(mockResponse);
      
      const file = new File(['video content'], 'test.mp4', { type: 'video/mp4' });
      const onProgress = vi.fn();
      
      const result = await contentAPI.uploadVideo(file, onProgress);
      
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/content/upload-video',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: expect.any(Function)
        })
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('应该上传缩略图', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            thumbnailUrl: '/uploads/thumbnails/thumb.jpg',
            filename: 'thumb.jpg'
          }
        }
      };
      
      mockAxiosInstance.post.mockResolvedValue(mockResponse);
      
      const file = new File(['image content'], 'thumb.jpg', { type: 'image/jpeg' });
      
      const result = await contentAPI.uploadThumbnail(file);
      
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/content/upload-thumbnail',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('应该创建内容', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { id: '1', title: '新视频', status: 'published' }
        }
      };
      
      mockAxiosInstance.post.mockResolvedValue(mockResponse);
      
      const contentData = {
        title: '新视频',
        description: '视频描述',
        category: 'entertainment',
        tags: ['测试'],
        videoUrl: '/uploads/videos/test.mp4'
      };
      
      const result = await contentAPI.createContent(contentData);
      
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/content', contentData);
      expect(result).toEqual(mockResponse.data);
    });

    it('应该处理API错误', async () => {
      const errorMessage = '网络错误';
      mockAxiosInstance.get.mockRejectedValue(new Error(errorMessage));
      
      await expect(contentAPI.getContentList()).rejects.toThrow(errorMessage);
    });
  });

  describe('userAPI', () => {
    it('应该获取当前用户', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { id: '1', username: 'testuser', email: 'test@example.com' }
        }
      };
      
      mockAxiosInstance.get.mockResolvedValue(mockResponse);
      
      const result = await userAPI.getCurrentUser();
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/profile');
      expect(result).toEqual(mockResponse.data);
    });

    it('应该更新用户资料', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { id: '1', username: 'updateduser' }
        }
      };
      
      mockAxiosInstance.put.mockResolvedValue(mockResponse);
      
      const updateData = { username: 'updateduser' };
      const result = await userAPI.updateProfile(updateData);
      
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/users/profile', updateData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('creatorAPI', () => {
    it('应该根据ID获取创作者', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: '1',
            displayName: '测试创作者',
            description: '创作者描述'
          }
        }
      };
      
      mockAxiosInstance.get.mockResolvedValue(mockResponse);
      
      const result = await creatorAPI.getCreatorById('1');
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/creators/1');
      expect(result).toEqual(mockResponse.data);
    });

    it('应该更新创作者资料', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: '1',
            displayName: '更新的创作者',
            isVerified: false
          }
        }
      };
      
      mockAxiosInstance.put.mockResolvedValue(mockResponse);
      
      const creatorData = {
        displayName: '更新的创作者',
        description: '更新的描述',
        category: 'entertainment'
      };
      
      const result = await creatorAPI.updateCreatorProfile(creatorData);
      
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/creators/profile', creatorData);
      expect(result).toEqual(mockResponse.data);
    });
  });
});