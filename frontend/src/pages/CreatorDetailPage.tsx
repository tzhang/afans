import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Users, Play, Heart, Calendar, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const CreatorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: 从API获取创作者数据
  const creator = {
    id: id || '1',
    username: 'example_creator',
    displayName: '示例创作者',
    avatar: 'https://via.placeholder.com/150',
    bio: '这是一个示例创作者的简介，专注于分享高质量的视频内容。',
    subscriberCount: 1234,
    videoCount: 56,
    monthlyPrice: 29.99,
    joinedAt: '2023-01-15',
    isVerified: true,
  };

  const recentVideos = [
    {
      id: '1',
      title: '示例视频标题 1',
      thumbnail: 'https://via.placeholder.com/300x200',
      duration: '10:30',
      publishedAt: '2024-01-15',
      viewCount: 1500,
    },
    {
      id: '2',
      title: '示例视频标题 2',
      thumbnail: 'https://via.placeholder.com/300x200',
      duration: '15:45',
      publishedAt: '2024-01-10',
      viewCount: 2300,
    },
    {
      id: '3',
      title: '示例视频标题 3',
      thumbnail: 'https://via.placeholder.com/300x200',
      duration: '8:20',
      publishedAt: '2024-01-05',
      viewCount: 980,
    },
  ];

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      // TODO: 实现订阅逻辑
      setIsSubscribed(!isSubscribed);
      toast.success(isSubscribed ? '已取消订阅' : '订阅成功！');
    } catch (error) {
      toast.error('操作失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 创作者信息头部 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex-shrink-0">
              <img
                className="w-24 h-24 rounded-full object-cover"
                src={creator.avatar}
                alt={creator.displayName}
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{creator.displayName}</h1>
                {creator.isVerified && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-gray-600 mb-4">{creator.bio}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{creator.subscriberCount.toLocaleString()} 订阅者</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Play className="w-4 h-4" />
                  <span>{creator.videoCount} 个视频</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>加入于 {new Date(creator.joinedAt).toLocaleDateString('zh-CN')}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-3">
              <div className="text-right">
                <div className="flex items-center space-x-1 text-lg font-semibold text-gray-900">
                  <DollarSign className="w-5 h-5" />
                  <span>{creator.monthlyPrice}</span>
                  <span className="text-sm text-gray-500">/月</span>
                </div>
              </div>
              
              <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSubscribed
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isLoading ? '处理中...' : isSubscribed ? '已订阅' : '订阅'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 视频列表 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">最新视频</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentVideos.map((video) => (
              <div key={video.id} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="relative">
                  <img
                    className="w-full h-48 object-cover rounded-t-lg"
                    src={video.thumbnail}
                    alt={video.title}
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Play className="w-3 h-3" />
                      <span>{video.viewCount.toLocaleString()} 次观看</span>
                    </div>
                    <span>{new Date(video.publishedAt).toLocaleDateString('zh-CN')}</span>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      观看视频
                    </button>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 加载更多按钮 */}
        <div className="text-center">
          <button className="btn-secondary">
            加载更多视频
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatorDetailPage;