import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Play, Heart, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

interface Creator {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  subscriberCount: number;
  videoCount: number;
  monthlyFee: number;
  category: string;
  isVerified: boolean;
  joinedAt: string;
}

const CreatorsPage: React.FC = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  // TODO: 从API获取创作者列表
  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setIsLoading(true);
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟数据
        const mockCreators: Creator[] = [
          {
            id: '1',
            username: 'tech_guru',
            displayName: '科技大师',
            avatar: 'https://via.placeholder.com/150',
            bio: '专注于最新科技趋势和产品评测，带你了解科技前沿',
            subscriberCount: 125000,
            videoCount: 89,
            monthlyFee: 29.99,
            category: '科技',
            isVerified: true,
            joinedAt: '2023-01-15'
          },
          {
            id: '2',
            username: 'fitness_coach',
            displayName: '健身教练小王',
            avatar: 'https://via.placeholder.com/150',
            bio: '专业健身指导，帮助你打造完美身材',
            subscriberCount: 89000,
            videoCount: 156,
            monthlyFee: 19.99,
            category: '健身',
            isVerified: true,
            joinedAt: '2022-11-20'
          },
          {
            id: '3',
            username: 'cooking_master',
            displayName: '美食达人',
            avatar: 'https://via.placeholder.com/150',
            bio: '分享各种美食制作技巧和家常菜谱',
            subscriberCount: 67000,
            videoCount: 203,
            monthlyFee: 15.99,
            category: '美食',
            isVerified: false,
            joinedAt: '2023-03-10'
          },
          {
            id: '4',
            username: 'travel_blogger',
            displayName: '旅行日记',
            avatar: 'https://via.placeholder.com/150',
            bio: '记录世界各地的美景和旅行攻略',
            subscriberCount: 45000,
            videoCount: 78,
            monthlyFee: 25.99,
            category: '旅行',
            isVerified: true,
            joinedAt: '2023-02-05'
          },
          {
            id: '5',
            username: 'music_producer',
            displayName: '音乐制作人',
            avatar: 'https://via.placeholder.com/150',
            bio: '分享音乐制作技巧和原创作品',
            subscriberCount: 92000,
            videoCount: 134,
            monthlyFee: 39.99,
            category: '音乐',
            isVerified: true,
            joinedAt: '2022-09-18'
          },
          {
            id: '6',
            username: 'art_teacher',
            displayName: '绘画老师',
            avatar: 'https://via.placeholder.com/150',
            bio: '从零开始学绘画，提升你的艺术技能',
            subscriberCount: 34000,
            videoCount: 95,
            monthlyFee: 22.99,
            category: '艺术',
            isVerified: false,
            joinedAt: '2023-04-12'
          }
        ];
        
        setCreators(mockCreators);
      } catch (error) {
        toast.error('获取创作者列表失败');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreators();
  }, []);

  // 筛选和排序创作者
  const filteredAndSortedCreators = creators
    .filter(creator => {
      const matchesSearch = creator.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           creator.bio.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || creator.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.subscriberCount - a.subscriberCount;
        case 'newest':
          return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
        case 'price_low':
          return a.monthlyFee - b.monthlyFee;
        case 'price_high':
          return b.monthlyFee - a.monthlyFee;
        default:
          return 0;
      }
    });

  const categories = ['all', '科技', '健身', '美食', '旅行', '音乐', '艺术'];
  const categoryLabels: { [key: string]: string } = {
    all: '全部分类',
    科技: '科技',
    健身: '健身',
    美食: '美食',
    旅行: '旅行',
    音乐: '音乐',
    艺术: '艺术'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">发现创作者</h1>
          <p className="text-gray-600">找到你感兴趣的创作者，订阅他们的独家内容</p>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* 搜索框 */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索创作者..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              {/* 分类筛选 */}
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {categoryLabels[category]}
                    </option>
                  ))}
                </select>
              </div>

              {/* 排序 */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="popular">最受欢迎</option>
                <option value="newest">最新加入</option>
                <option value="price_low">价格从低到高</option>
                <option value="price_high">价格从高到低</option>
              </select>
            </div>
          </div>
        </div>

        {/* 创作者列表 */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedCreators.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到创作者</h3>
            <p className="text-gray-600">尝试调整搜索条件或筛选选项</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedCreators.map((creator) => (
              <div key={creator.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  {/* 创作者头像和基本信息 */}
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      className="w-16 h-16 rounded-full object-cover"
                      src={creator.avatar}
                      alt={creator.displayName}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {creator.displayName}
                        </h3>
                        {creator.isVerified && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">@{creator.username}</p>
                    </div>
                  </div>

                  {/* 创作者简介 */}
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{creator.bio}</p>

                  {/* 统计信息 */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{creator.subscriberCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Play className="w-4 h-4" />
                      <span>{creator.videoCount} 个视频</span>
                    </div>
                  </div>

                  {/* 分类和价格 */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {creator.category}
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      ¥{creator.monthlyFee}/月
                    </span>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/creator/${creator.id}`}
                      className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                    >
                      查看详情
                    </Link>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 加载更多按钮 */}
        {!isLoading && filteredAndSortedCreators.length > 0 && (
          <div className="text-center mt-8">
            <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              加载更多
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorsPage;