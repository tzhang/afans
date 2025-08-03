import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign, Settings, Pause, Play, X, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

interface Subscription {
  id: string;
  creator: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    isVerified: boolean;
  };
  plan: {
    name: string;
    price: number;
    currency: string;
  };
  status: 'active' | 'paused' | 'cancelled';
  startDate: string;
  nextBillingDate: string;
  autoRenew: boolean;
}

const SubscriptionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'paused' | 'cancelled'>('active');
  const [isLoading, setIsLoading] = useState(false);

  // TODO: 从API获取订阅数据
  const subscriptions: Subscription[] = [
    {
      id: '1',
      creator: {
        id: '1',
        username: 'creator1',
        displayName: '创作者一',
        avatar: 'https://via.placeholder.com/50',
        isVerified: true,
      },
      plan: {
        name: '月度订阅',
        price: 29.99,
        currency: 'CNY',
      },
      status: 'active',
      startDate: '2024-01-01',
      nextBillingDate: '2024-02-01',
      autoRenew: true,
    },
    {
      id: '2',
      creator: {
        id: '2',
        username: 'creator2',
        displayName: '创作者二',
        avatar: 'https://via.placeholder.com/50',
        isVerified: false,
      },
      plan: {
        name: '月度订阅',
        price: 19.99,
        currency: 'CNY',
      },
      status: 'paused',
      startDate: '2023-12-15',
      nextBillingDate: '2024-02-15',
      autoRenew: false,
    },
    {
      id: '3',
      creator: {
        id: '3',
        username: 'creator3',
        displayName: '创作者三',
        avatar: 'https://via.placeholder.com/50',
        isVerified: true,
      },
      plan: {
        name: '月度订阅',
        price: 39.99,
        currency: 'CNY',
      },
      status: 'cancelled',
      startDate: '2023-11-01',
      nextBillingDate: '2023-12-01',
      autoRenew: false,
    },
  ];

  const filteredSubscriptions = subscriptions.filter(sub => sub.status === activeTab);

  const handlePauseSubscription = async (subscriptionId: string) => {
    setIsLoading(true);
    try {
      // TODO: 实现暂停订阅逻辑
      console.log('Pausing subscription:', subscriptionId);
      toast.success('订阅已暂停');
    } catch (error) {
      toast.error('操作失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeSubscription = async (subscriptionId: string) => {
    setIsLoading(true);
    try {
      // TODO: 实现恢复订阅逻辑
      console.log('Resuming subscription:', subscriptionId);
      toast.success('订阅已恢复');
    } catch (error) {
      toast.error('操作失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!confirm('确定要取消这个订阅吗？取消后将无法访问该创作者的付费内容。')) {
      return;
    }

    setIsLoading(true);
    try {
      // TODO: 实现取消订阅逻辑
      console.log('Cancelling subscription:', subscriptionId);
      toast.success('订阅已取消');
    } catch (error) {
      toast.error('操作失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: Subscription['status']) => {
    const statusConfig = {
      active: { text: '活跃', className: 'bg-green-100 text-green-800' },
      paused: { text: '已暂停', className: 'bg-yellow-100 text-yellow-800' },
      cancelled: { text: '已取消', className: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.text}
      </span>
    );
  };

  const getActionButtons = (subscription: Subscription) => {
    switch (subscription.status) {
      case 'active':
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handlePauseSubscription(subscription.id)}
              disabled={isLoading}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors disabled:opacity-50"
            >
              <Pause className="w-3 h-3" />
              <span>暂停</span>
            </button>
            <button
              onClick={() => handleCancelSubscription(subscription.id)}
              disabled={isLoading}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
            >
              <X className="w-3 h-3" />
              <span>取消</span>
            </button>
          </div>
        );
      case 'paused':
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleResumeSubscription(subscription.id)}
              disabled={isLoading}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
            >
              <Play className="w-3 h-3" />
              <span>恢复</span>
            </button>
            <button
              onClick={() => handleCancelSubscription(subscription.id)}
              disabled={isLoading}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
            >
              <X className="w-3 h-3" />
              <span>取消</span>
            </button>
          </div>
        );
      case 'cancelled':
        return (
          <span className="text-sm text-gray-500">已取消</span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的订阅</h1>
          <p className="text-gray-600">管理你的所有订阅和付费内容</p>
        </div>

        {/* 标签页 */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { key: 'active', label: '活跃订阅', count: subscriptions.filter(s => s.status === 'active').length },
                { key: 'paused', label: '已暂停', count: subscriptions.filter(s => s.status === 'paused').length },
                { key: 'cancelled', label: '已取消', count: subscriptions.filter(s => s.status === 'cancelled').length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                      activeTab === tab.key
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 订阅列表 */}
        <div className="space-y-4">
          {filteredSubscriptions.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'active' && '暂无活跃订阅'}
                {activeTab === 'paused' && '暂无暂停的订阅'}
                {activeTab === 'cancelled' && '暂无已取消的订阅'}
              </h3>
              <p className="text-gray-500 mb-6">
                {activeTab === 'active' && '发现感兴趣的创作者并开始订阅吧！'}
                {activeTab === 'paused' && '你可以随时暂停不需要的订阅。'}
                {activeTab === 'cancelled' && '已取消的订阅会显示在这里。'}
              </p>
              {activeTab === 'active' && (
                <Link to="/creators" className="btn-primary">
                  发现创作者
                </Link>
              )}
            </div>
          ) : (
            filteredSubscriptions.map((subscription) => (
              <div key={subscription.id} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      className="w-12 h-12 rounded-full object-cover"
                      src={subscription.creator.avatar}
                      alt={subscription.creator.displayName}
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/creator/${subscription.creator.id}`}
                          className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {subscription.creator.displayName}
                        </Link>
                        {subscription.creator.isVerified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        {getStatusBadge(subscription.status)}
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-3 h-3" />
                          <span>{subscription.plan.price} {subscription.plan.currency}/月</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {subscription.status === 'cancelled'
                              ? `已于 ${new Date(subscription.nextBillingDate).toLocaleDateString('zh-CN')} 取消`
                              : `下次扣费: ${new Date(subscription.nextBillingDate).toLocaleDateString('zh-CN')}`
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {subscription.status !== 'cancelled' && (
                      <button className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <Settings className="w-3 h-3" />
                        <span>设置</span>
                      </button>
                    )}
                    {getActionButtons(subscription)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 订阅统计 */}
        {subscriptions.length > 0 && (
          <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">订阅统计</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {subscriptions.filter(s => s.status === 'active').length}
                </div>
                <div className="text-sm text-gray-500">活跃订阅</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ¥{subscriptions
                    .filter(s => s.status === 'active')
                    .reduce((total, s) => total + s.plan.price, 0)
                    .toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">月度支出</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {subscriptions.length}
                </div>
                <div className="text-sm text-gray-500">总订阅数</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionsPage;