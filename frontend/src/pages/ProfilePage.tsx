import React, { useState } from 'react';
import { Camera, Edit3, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: 'example_user',
    displayName: '示例用户',
    email: 'user@example.com',
    bio: '这是用户的个人简介，可以在这里介绍自己。',
    avatar: 'https://via.placeholder.com/150',
    location: '北京, 中国',
    website: 'https://example.com',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: 实现更新用户资料逻辑
      console.log('Updated profile data:', formData);
      setIsEditing(false);
      toast.success('资料更新成功！');
    } catch (error) {
      toast.error('更新失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // TODO: 重置表单数据到原始状态
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // TODO: 实现头像上传逻辑
      console.log('Uploading avatar:', file);
      toast.success('头像上传成功！');
    } catch (error) {
      toast.error('头像上传失败，请稍后重试');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* 头部 */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">个人资料</h1>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>编辑资料</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>取消</span>
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isLoading ? '保存中...' : '保存'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 头像区域 */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      className="w-32 h-32 rounded-full object-cover mx-auto"
                      src={formData.avatar}
                      alt={formData.displayName}
                    />
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                        <Camera className="w-5 h-5 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {isEditing ? '点击相机图标更换头像' : '用户头像'}
                  </p>
                </div>
              </div>

              {/* 表单区域 */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                      用户名
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="请输入用户名"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.username}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                      显示名称
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="displayName"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="请输入显示名称"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.displayName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    邮箱地址
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="请输入邮箱地址"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    个人简介
                  </label>
                  {isEditing ? (
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      className="input-field resize-none"
                      placeholder="请输入个人简介"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.bio || '暂无个人简介'}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      所在地
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="请输入所在地"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.location || '未设置'}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                      个人网站
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="请输入个人网站"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {formData.website ? (
                          <a
                            href={formData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            {formData.website}
                          </a>
                        ) : (
                          '未设置'
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* 账户设置 */}
        <div className="mt-8 bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">账户设置</h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">更改密码</h3>
                <p className="text-sm text-gray-500">定期更改密码以保护账户安全</p>
              </div>
              <button className="btn-secondary">
                更改密码
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">两步验证</h3>
                <p className="text-sm text-gray-500">为账户添加额外的安全保护</p>
              </div>
              <button className="btn-secondary">
                启用
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">邮件通知</h3>
                <p className="text-sm text-gray-500">管理邮件通知偏好设置</p>
              </div>
              <button className="btn-secondary">
                设置
              </button>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-red-600">删除账户</h3>
                  <p className="text-sm text-gray-500">永久删除账户和所有相关数据</p>
                </div>
                <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                  删除账户
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;