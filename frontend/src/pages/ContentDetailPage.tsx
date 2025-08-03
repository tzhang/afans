import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Heart, Share2, MessageCircle, Calendar, Eye, ThumbsUp } from 'lucide-react';
import toast from 'react-hot-toast';

const ContentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [newComment, setNewComment] = useState('');

  // TODO: 从API获取内容数据
  const content = {
    id: id || '1',
    title: '示例视频标题 - 这是一个很长的标题用来测试显示效果',
    description: '这是视频的详细描述。在这里创作者可以详细介绍视频内容、背景信息以及相关的补充说明。这个描述可以很长，包含多个段落和详细信息。',
    videoUrl: 'https://example.com/video.mp4',
    thumbnail: 'https://via.placeholder.com/800x450',
    duration: '15:30',
    publishedAt: '2024-01-15T10:00:00Z',
    viewCount: 2500,
    likeCount: 156,
    commentCount: 23,
    creator: {
      id: '1',
      username: 'example_creator',
      displayName: '示例创作者',
      avatar: 'https://via.placeholder.com/50',
      isVerified: true,
      subscriberCount: 1234,
    },
    tags: ['教程', '技术', '编程'],
    isSubscriberOnly: true,
  };

  const comments = [
    {
      id: '1',
      user: {
        username: 'user1',
        displayName: '用户一',
        avatar: 'https://via.placeholder.com/40',
      },
      content: '很棒的视频！学到了很多东西。',
      publishedAt: '2024-01-15T12:00:00Z',
      likeCount: 5,
    },
    {
      id: '2',
      user: {
        username: 'user2',
        displayName: '用户二',
        avatar: 'https://via.placeholder.com/40',
      },
      content: '请问有相关的资料可以分享吗？',
      publishedAt: '2024-01-15T14:30:00Z',
      likeCount: 2,
    },
  ];

  const handleLike = async () => {
    try {
      setIsLiked(!isLiked);
      toast.success(isLiked ? '已取消点赞' : '点赞成功！');
    } catch (error) {
      toast.error('操作失败，请稍后重试');
    }
  };

  const handleFavorite = async () => {
    try {
      setIsFavorited(!isFavorited);
      toast.success(isFavorited ? '已取消收藏' : '收藏成功！');
    } catch (error) {
      toast.error('操作失败，请稍后重试');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('链接已复制到剪贴板');
    } catch (error) {
      toast.error('分享失败，请稍后重试');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      // TODO: 实现评论提交逻辑
      console.log('New comment:', newComment);
      setNewComment('');
      toast.success('评论发布成功！');
    } catch (error) {
      toast.error('评论发布失败，请稍后重试');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容区域 */}
          <div className="lg:col-span-2">
            {/* 视频播放器 */}
            <div className="bg-black rounded-lg overflow-hidden mb-6">
              <div className="relative aspect-video">
                <img
                  className="w-full h-full object-cover"
                  src={content.thumbnail}
                  alt={content.title}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200">
                    <Play className="w-8 h-8 text-gray-900 ml-1" />
                  </button>
                </div>
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                  {content.duration}
                </div>
              </div>
            </div>

            {/* 视频信息 */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{content.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{content.viewCount.toLocaleString()} 次观看</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(content.publishedAt).toLocaleDateString('zh-CN')}</span>
                </div>
                {content.isSubscriberOnly && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    订阅者专享
                  </span>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center space-x-4 mb-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isLiked
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{content.likeCount + (isLiked ? 1 : 0)}</span>
                </button>
                
                <button
                  onClick={handleFavorite}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isFavorited
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                  <span>收藏</span>
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <Share2 className="w-4 h-4" />
                  <span>分享</span>
                </button>
              </div>

              {/* 标签 */}
              {content.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {content.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 描述 */}
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{content.description}</p>
              </div>
            </div>

            {/* 评论区 */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  评论 ({content.commentCount})
                </h3>
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  {showComments ? '隐藏评论' : '显示评论'}
                </button>
              </div>

              {/* 评论输入框 */}
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex space-x-3">
                  <img
                    className="w-8 h-8 rounded-full"
                    src="https://via.placeholder.com/32"
                    alt="Your avatar"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="写下你的评论..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        发布评论
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* 评论列表 */}
              {showComments && (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={comment.user.avatar}
                        alt={comment.user.displayName}
                      />
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {comment.user.displayName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.publishedAt).toLocaleDateString('zh-CN')}
                            </span>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <button className="hover:text-blue-600 transition-colors">
                            <ThumbsUp className="w-3 h-3 inline mr-1" />
                            {comment.likeCount}
                          </button>
                          <button className="hover:text-blue-600 transition-colors">
                            回复
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            {/* 创作者信息 */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  className="w-12 h-12 rounded-full"
                  src={content.creator.avatar}
                  alt={content.creator.displayName}
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-1">
                    <Link
                      to={`/creator/${content.creator.id}`}
                      className="font-medium text-gray-900 hover:text-blue-600"
                    >
                      {content.creator.displayName}
                    </Link>
                    {content.creator.isVerified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {content.creator.subscriberCount.toLocaleString()} 订阅者
                  </p>
                </div>
              </div>
              
              <Link
                to={`/creator/${content.creator.id}`}
                className="btn-primary w-full text-center"
              >
                查看创作者
              </Link>
            </div>

            {/* 相关推荐 */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">相关推荐</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex space-x-3">
                    <img
                      className="w-20 h-12 object-cover rounded"
                      src={`https://via.placeholder.com/80x48`}
                      alt={`推荐视频 ${i}`}
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                        推荐视频标题 {i}
                      </h4>
                      <p className="text-xs text-gray-500">创作者名称</p>
                      <p className="text-xs text-gray-500">1.2k 观看 · 2天前</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetailPage;