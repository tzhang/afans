import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Users, Play, Calendar, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

interface SearchResult {
  id: string;
  type: 'creator' | 'content';
  title: string;
  description: string;
  thumbnail: string;
  creator?: {
    id: string;
    displayName: string;
    avatar: string;
    subscriberCount: number;
  };
  stats?: {
    viewCount?: number;
    duration?: string;
    publishedAt?: string;
  };
}

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'creators' | 'content'>('all');
  const [sortBy, setSortBy] = useState('relevance');

  // TODO: 从API获取搜索结果
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm.trim()) {
        setResults([]);
        return;
      }

      try {
        setIsLoading(true);
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 模拟搜索结果
        const mockResults: SearchResult[] = [
          {
            id: '1',
            type: 'creator',
            title: '科技大师',
            description: '专注于最新科技趋势和产品评测，带你了解科技前沿',
            thumbnail: 'https://via.placeholder.com/150',
            creator: {
              id: '1',
              displayName: '科技大师',
              avatar: 'https://via.placeholder.com/150',
              subscriberCount: 125000
            }
          },
          {
            id: '2',
            type: 'content',
            title: '2024年最值得购买的智能手机推荐',
            description: '深度评测今年最热门的智能手机，从性能、拍照、续航等多个维度为你推荐最适合的选择',
            thumbnail: 'https://via.placeholder.com/300x200',
            creator: {
              id: '1',
              displayName: '科技大师',
              avatar: 'https://via.placeholder.com/150',
              subscriberCount: 125000
            },
            stats: {
              viewCount: 45000,
              duration: '15:32',
              publishedAt: '2024-01-15'
            }
          },
          {
            id: '3',
            type: 'creator',
            title: '健身教练小王',
            description: '专业健身指导，帮助你打造完美身材',
            thumbnail: 'https://via.placeholder.com/150',
            creator: {
              id: '2',
              displayName: '健身教练小王',
              avatar: 'https://via.placeholder.com/150',
              subscriberCount: 89000
            }
          },
          {
            id: '4',
            type: 'content',
            title: '30天健身挑战：从零开始的完整训练计划',
            description: '适合初学者的30天健身计划，每天只需30分钟，帮你建立健康的运动习惯',
            thumbnail: 'https://via.placeholder.com/300x200',
            creator: {
              id: '2',
              displayName: '健身教练小王',
              avatar: 'https://via.placeholder.com/150',
              subscriberCount: 89000
            },
            stats: {
              viewCount: 32000,
              duration: '25:18',
              publishedAt: '2024-01-10'
            }
          },
          {
            id: '5',
            type: 'content',
            title: 'AI技术如何改变我们的生活',
            description: '探讨人工智能在日常生活中的应用，以及未来可能带来的变化',
            thumbnail: 'https://via.placeholder.com/300x200',
            creator: {
              id: '1',
              displayName: '科技大师',
              avatar: 'https://via.placeholder.com/150',
              subscriberCount: 125000
            },
            stats: {
              viewCount: 67000,
              duration: '20:45',
              publishedAt: '2024-01-08'
            }
          }
        ];
        
        // 根据搜索词过滤结果
        const filteredResults = mockResults.filter(result => 
          result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        setResults(filteredResults);
      } catch (error) {
        toast.error('搜索失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    }
  };

  // 筛选结果
  const filteredResults = results.filter(result => {
    if (activeTab === 'all') return true;
    return result.type === (activeTab === 'creators' ? 'creator' : 'content');
  });

  // 排序结果
  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        if (a.stats?.publishedAt && b.stats?.publishedAt) {
          return new Date(b.stats.publishedAt).getTime() - new Date(a.stats.publishedAt).getTime();
        }
        return 0;
      case 'popular':
        if (a.stats?.viewCount && b.stats?.viewCount) {
          return b.stats.viewCount - a.stats.viewCount;
        }
        if (a.creator?.subscriberCount && b.creator?.subscriberCount) {
          return b.creator.subscriberCount - a.creator.subscriberCount;
        }
        return 0;
      default:
        return 0;
    }
  });

  const creatorResults = results.filter(r => r.type === 'creator');
  const contentResults = results.filter(r => r.type === 'content');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索框 */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索创作者或内容..."
                className="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>
        </div>

        {searchTerm && (
          <>
            {/* 搜索结果统计 */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                搜索结果："{searchTerm}"
              </h1>
              <p className="text-gray-600">
                找到 {results.length} 个结果
              </p>
            </div>

            {/* 筛选和排序 */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                {/* 标签页 */}
                <div className="flex space-x-1">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'all'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    全部 ({results.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('creators')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'creators'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    创作者 ({creatorResults.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('content')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'content'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    内容 ({contentResults.length})
                  </button>
                </div>

                {/* 排序 */}
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="relevance">相关度</option>
                    <option value="newest">最新发布</option>
                    <option value="popular">最受欢迎</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 搜索结果 */}
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                    <div className="flex space-x-4">
                      <div className="w-32 h-24 bg-gray-300 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded mb-2 w-3/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedResults.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到相关结果</h3>
                <p className="text-gray-600">尝试使用不同的关键词或调整筛选条件</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedResults.map((result) => (
                  <div key={result.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="p-6">
                      <div className="flex space-x-4">
                        {/* 缩略图 */}
                        <div className="flex-shrink-0">
                          <img
                            className={`object-cover rounded-lg ${
                              result.type === 'creator' ? 'w-20 h-20 rounded-full' : 'w-32 h-24'
                            }`}
                            src={result.thumbnail}
                            alt={result.title}
                          />
                        </div>

                        {/* 内容信息 */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              {/* 类型标签 */}
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 ${
                                result.type === 'creator'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {result.type === 'creator' ? '创作者' : '内容'}
                              </span>

                              {/* 标题 */}
                              <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
                                <Link to={result.type === 'creator' ? `/creator/${result.id}` : `/content/${result.id}`}>
                                  {result.title}
                                </Link>
                              </h3>

                              {/* 描述 */}
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {result.description}
                              </p>

                              {/* 创作者信息和统计 */}
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                {result.creator && (
                                  <div className="flex items-center space-x-2">
                                    <img
                                      className="w-6 h-6 rounded-full"
                                      src={result.creator.avatar}
                                      alt={result.creator.displayName}
                                    />
                                    <Link
                                      to={`/creator/${result.creator.id}`}
                                      className="hover:text-blue-600"
                                    >
                                      {result.creator.displayName}
                                    </Link>
                                    <div className="flex items-center space-x-1">
                                      <Users className="w-3 h-3" />
                                      <span>{result.creator.subscriberCount.toLocaleString()}</span>
                                    </div>
                                  </div>
                                )}

                                {result.stats && (
                                  <>
                                    {result.stats.viewCount && (
                                      <div className="flex items-center space-x-1">
                                        <Eye className="w-3 h-3" />
                                        <span>{result.stats.viewCount.toLocaleString()} 次观看</span>
                                      </div>
                                    )}
                                    {result.stats.duration && (
                                      <div className="flex items-center space-x-1">
                                        <Play className="w-3 h-3" />
                                        <span>{result.stats.duration}</span>
                                      </div>
                                    )}
                                    {result.stats.publishedAt && (
                                      <div className="flex items-center space-x-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{new Date(result.stats.publishedAt).toLocaleDateString('zh-CN')}</span>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 加载更多 */}
            {!isLoading && sortedResults.length > 0 && (
              <div className="text-center mt-8">
                <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  加载更多结果
                </button>
              </div>
            )}
          </>
        )}

        {/* 空状态 - 没有搜索词 */}
        {!searchTerm && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">开始搜索</h3>
            <p className="text-gray-600">输入关键词搜索创作者或内容</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;