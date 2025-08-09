import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Play, Image as ImageIcon, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { contentAPI } from '../services/api';

interface UploadFormData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  contentType: 'free' | 'subscription';
  thumbnail: File | null;
  video: File | null;
}

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    description: '',
    category: '',
    tags: [],
    contentType: 'free',
    thumbnail: null,
    video: null
  });
  const [tagInput, setTagInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    '教育', '娱乐', '生活', '科技', '美食', '旅行', '健身', '音乐', '艺术', '其他'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 检查文件类型
      if (!file.type.startsWith('video/')) {
        toast.error('请选择视频文件');
        return;
      }
      // 检查文件大小 (500MB)
      if (file.size > 500 * 1024 * 1024) {
        toast.error('视频文件大小不能超过500MB');
        return;
      }
      setFormData(prev => ({ ...prev, video: file }));
    }
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        toast.error('请选择图片文件');
        return;
      }
      // 检查文件大小 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('封面图片大小不能超过5MB');
        return;
      }
      setFormData(prev => ({ ...prev, thumbnail: file }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!formData.title.trim()) {
      toast.error('请输入视频标题');
      return;
    }
    if (!formData.video) {
      toast.error('请选择视频文件');
      return;
    }
    if (!formData.category) {
      toast.error('请选择视频分类');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 上传视频文件
      const uploadResponse = await contentAPI.uploadVideo(formData.video, (progress) => {
        setUploadProgress(progress);
      });

      if (!uploadResponse.success) {
        throw new Error(uploadResponse.message || '视频上传失败');
      }

      const videoUrl = uploadResponse.data.videoUrl;
      
      // 上传缩略图（如果有）
      let thumbnailUrl = '';
      if (formData.thumbnail) {
        const thumbnailResponse = await contentAPI.uploadThumbnail(formData.thumbnail);
        if (thumbnailResponse.success) {
          thumbnailUrl = thumbnailResponse.data.thumbnailUrl;
        }
      }

      // 创建内容记录
      const contentData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
        contentType: formData.contentType,
        videoUrl: videoUrl,
        thumbnailUrl: thumbnailUrl || uploadResponse.data.thumbnailUrl
      };

      await contentAPI.createContent(contentData);
      setUploadProgress(100);
      
      toast.success('视频上传成功！');
      
      // 跳转到内容详情页或创作者页面
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || '上传失败，请重试');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">上传视频</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 视频上传区域 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                视频文件 *
              </label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors cursor-pointer"
                onClick={() => videoInputRef.current?.click()}
              >
                {formData.video ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Play className="w-8 h-8 text-purple-600" />
                    <span className="text-gray-900">{formData.video.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData(prev => ({ ...prev, video: null }));
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">点击选择视频文件</p>
                    <p className="text-sm text-gray-500 mt-2">支持 MP4, MOV, AVI 格式，最大 500MB</p>
                  </div>
                )}
              </div>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoSelect}
                className="hidden"
              />
            </div>

            {/* 封面图片上传 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                封面图片
              </label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors cursor-pointer"
                onClick={() => thumbnailInputRef.current?.click()}
              >
                {formData.thumbnail ? (
                  <div className="flex items-center justify-center space-x-2">
                    <ImageIcon className="w-6 h-6 text-purple-600" />
                    <span className="text-gray-900">{formData.thumbnail.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData(prev => ({ ...prev, thumbnail: null }));
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">选择封面图片</p>
                    <p className="text-sm text-gray-500">推荐尺寸 16:9，最大 5MB</p>
                  </div>
                )}
              </div>
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailSelect}
                className="hidden"
              />
            </div>

            {/* 视频信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  视频标题 *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="输入视频标题"
                  maxLength={200}
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  分类 *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">选择分类</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                视频描述
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="描述你的视频内容..."
                maxLength={1000}
              />
            </div>

            {/* 标签 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="输入标签后按回车"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  添加
                </button>
              </div>
            </div>

            {/* 内容类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                内容类型
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="contentType"
                    value="free"
                    checked={formData.contentType === 'free'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-gray-700">免费内容</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="contentType"
                    value="subscription"
                    checked={formData.contentType === 'subscription'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-gray-700 flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    订阅内容（仅订阅用户可观看）
                  </span>
                </label>
              </div>
            </div>

            {/* 上传进度 */}
            {isUploading && (
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>上传进度</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* 提交按钮 */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isUploading}
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? '上传中...' : '发布视频'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;