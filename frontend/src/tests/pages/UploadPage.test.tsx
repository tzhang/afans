import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UploadPage from '../../pages/UploadPage';
import { contentAPI } from '../../services/api';

// Mock API
vi.mock('../../services/api', () => ({
  contentAPI: {
    uploadVideo: vi.fn(),
    uploadThumbnail: vi.fn(),
    createContent: vi.fn()
  }
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

const renderUploadPage = () => {
  return render(
    <BrowserRouter>
      <UploadPage />
    </BrowserRouter>
  );
};

describe('UploadPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该渲染上传页面的基本元素', () => {
    renderUploadPage();
    
    expect(screen.getByText('上传视频')).toBeInTheDocument();
    expect(screen.getByLabelText('视频文件')).toBeInTheDocument();
    expect(screen.getByLabelText('标题')).toBeInTheDocument();
    expect(screen.getByLabelText('描述')).toBeInTheDocument();
    expect(screen.getByLabelText('分类')).toBeInTheDocument();
    expect(screen.getByText('发布视频')).toBeInTheDocument();
  });

  it('应该验证必填字段', async () => {
    renderUploadPage();
    
    const submitButton = screen.getByText('发布视频');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('请选择视频文件')).toBeInTheDocument();
    });
  });

  it('应该处理视频文件选择', () => {
    renderUploadPage();
    
    const fileInput = screen.getByLabelText('视频文件') as HTMLInputElement;
    const file = new File(['video content'], 'test-video.mp4', { type: 'video/mp4' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(fileInput.files?.[0]).toBe(file);
    expect(screen.getByText('test-video.mp4')).toBeInTheDocument();
  });

  it('应该验证视频文件类型', () => {
    renderUploadPage();
    
    const fileInput = screen.getByLabelText('视频文件');
    const invalidFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });
    
    expect(screen.getByText('请选择有效的视频文件')).toBeInTheDocument();
  });

  it('应该验证视频文件大小', () => {
    renderUploadPage();
    
    const fileInput = screen.getByLabelText('视频文件');
    // 创建一个超过500MB的模拟文件
    const largeFile = new File(['x'.repeat(500 * 1024 * 1024 + 1)], 'large-video.mp4', { type: 'video/mp4' });
    Object.defineProperty(largeFile, 'size', { value: 500 * 1024 * 1024 + 1 });
    
    fireEvent.change(fileInput, { target: { files: [largeFile] } });
    
    expect(screen.getByText('文件大小不能超过500MB')).toBeInTheDocument();
  });

  it('应该处理标签添加和删除', () => {
    renderUploadPage();
    
    const tagInput = screen.getByPlaceholderText('输入标签后按回车');
    
    // 添加标签
    fireEvent.change(tagInput, { target: { value: '测试标签' } });
    fireEvent.keyDown(tagInput, { key: 'Enter' });
    
    expect(screen.getByText('测试标签')).toBeInTheDocument();
    
    // 删除标签
    const deleteButton = screen.getByRole('button', { name: /删除标签/ });
    fireEvent.click(deleteButton);
    
    expect(screen.queryByText('测试标签')).not.toBeInTheDocument();
  });

  it('应该处理表单提交', async () => {
    const mockUploadVideo = vi.mocked(contentAPI.uploadVideo);
    const mockCreateContent = vi.mocked(contentAPI.createContent);
    
    mockUploadVideo.mockResolvedValue({
      success: true,
      data: { videoUrl: '/uploads/videos/test.mp4' }
    });
    
    mockCreateContent.mockResolvedValue({
      success: true,
      data: { id: '123', title: '测试视频' }
    });
    
    renderUploadPage();
    
    // 填写表单
    const fileInput = screen.getByLabelText('视频文件');
    const titleInput = screen.getByLabelText('标题');
    const descriptionInput = screen.getByLabelText('描述');
    
    const file = new File(['video content'], 'test-video.mp4', { type: 'video/mp4' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.change(titleInput, { target: { value: '测试视频标题' } });
    fireEvent.change(descriptionInput, { target: { value: '测试视频描述' } });
    
    // 提交表单
    const submitButton = screen.getByText('发布视频');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockUploadVideo).toHaveBeenCalledWith(file, expect.any(Function));
    });
    
    await waitFor(() => {
      expect(mockCreateContent).toHaveBeenCalledWith({
        title: '测试视频标题',
        description: '测试视频描述',
        category: 'entertainment',
        tags: [],
        contentType: 'video',
        videoUrl: '/uploads/videos/test.mp4',
        thumbnailUrl: ''
      });
    });
  });

  it('应该显示上传进度', async () => {
    const mockUploadVideo = vi.mocked(contentAPI.uploadVideo);
    
    mockUploadVideo.mockImplementation((file, onProgress) => {
      // 模拟上传进度
      setTimeout(() => onProgress?.(50), 100);
      setTimeout(() => onProgress?.(100), 200);
      
      return Promise.resolve({
        success: true,
        data: { videoUrl: '/uploads/videos/test.mp4' }
      });
    });
    
    renderUploadPage();
    
    // 填写表单并提交
    const fileInput = screen.getByLabelText('视频文件');
    const titleInput = screen.getByLabelText('标题');
    
    const file = new File(['video content'], 'test-video.mp4', { type: 'video/mp4' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.change(titleInput, { target: { value: '测试视频' } });
    
    const submitButton = screen.getByText('发布视频');
    fireEvent.click(submitButton);
    
    // 检查上传进度显示
    await waitFor(() => {
      expect(screen.getByText('上传中...')).toBeInTheDocument();
    });
  });

  it('应该处理上传错误', async () => {
    const mockUploadVideo = vi.mocked(contentAPI.uploadVideo);
    
    mockUploadVideo.mockRejectedValue(new Error('上传失败'));
    
    renderUploadPage();
    
    // 填写表单并提交
    const fileInput = screen.getByLabelText('视频文件');
    const titleInput = screen.getByLabelText('标题');
    
    const file = new File(['video content'], 'test-video.mp4', { type: 'video/mp4' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.change(titleInput, { target: { value: '测试视频' } });
    
    const submitButton = screen.getByText('发布视频');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('上传失败，请重试')).toBeInTheDocument();
    });
  });
});