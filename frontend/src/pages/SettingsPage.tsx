import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Shield, Bell, Lock, CreditCard, ChevronRight, Check, X } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: 'account', name: '账户设置', icon: User, color: 'bg-blue-500', description: '管理基本账户信息' },
    { id: 'security', name: '安全设置', icon: Shield, color: 'bg-green-500', description: '保护账户安全' },
    { id: 'notifications', name: '通知设置', icon: Bell, color: 'bg-yellow-500', description: '管理通知偏好' },
    { id: 'privacy', name: '隐私设置', icon: Lock, color: 'bg-purple-500', description: '控制隐私选项' },
    { id: 'billing', name: '账单设置', icon: CreditCard, color: 'bg-pink-500', description: '管理付款和账单' },
  ];

  const handleSave = async () => {
    setIsLoading(true);
    // 模拟保存操作
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            to="/profile"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            返回个人中心
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">设置</h1>
          <p className="mt-2 text-gray-600">管理您的账户设置和偏好</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 侧边栏导航 */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <ul className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <li key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-300 group ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-md border-l-4 border-blue-500 transform scale-105'
                            : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm hover:transform hover:scale-102'
                        }`}
                      >
                        <div className={`p-2 rounded-lg mr-3 transition-colors duration-300 ${
                          activeTab === tab.id ? tab.color : 'bg-gray-200 group-hover:bg-gray-300'
                        }`}>
                          <IconComponent className={`w-4 h-4 ${
                            activeTab === tab.id ? 'text-white' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{tab.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{tab.description}</div>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
                          activeTab === tab.id ? 'transform rotate-90 text-blue-500' : 'text-gray-400'
                        }`} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* 主内容区域 */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              {/* 内容头部 */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {tabs.find(tab => tab.id === activeTab)?.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {tabs.find(tab => tab.id === activeTab)?.description}
                    </p>
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>保存中...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>保存设置</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 账户设置 */}
              {activeTab === 'account' && (
                <div className="p-6">
                  <div className="space-y-8">
                    {/* 基本信息 */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-600" />
                        基本信息
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            用户名
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            defaultValue="john_doe"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            显示名称
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            defaultValue="John Doe"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            邮箱地址
                          </label>
                          <input
                            type="email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            defaultValue="john@example.com"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            手机号码
                          </label>
                          <input
                            type="tel"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            defaultValue="+86 138****8888"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 危险操作 */}
                    <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                      <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
                        <X className="w-5 h-5 mr-2" />
                        危险操作
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-red-600">删除账户</h4>
                          <p className="text-sm text-gray-500">永久删除您的账户和所有数据</p>
                        </div>
                        <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                          删除账户
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 安全设置 */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <div className="space-y-8">
                    {/* 密码安全 */}
                    <div className="bg-blue-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-blue-600" />
                        密码安全
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">更改密码</h4>
                            <p className="text-sm text-gray-500">上次更改：2024年1月15日</p>
                          </div>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105">
                            更改密码
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 两步验证 */}
                    <div className="bg-green-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Lock className="w-5 h-5 mr-2 text-green-600" />
                        两步验证
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">两步验证</h4>
                            <p className="text-sm text-gray-500">为您的账户添加额外的安全保护</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <X className="w-3 h-3 mr-1" />
                              未启用
                            </span>
                            <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105">
                              启用
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 设备管理 */}
                    <div className="bg-purple-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-purple-600" />
                        设备管理
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">登录设备</h4>
                            <p className="text-sm text-gray-500">管理已登录的设备</p>
                          </div>
                          <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105">
                            查看设备
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">登录历史</h4>
                            <p className="text-sm text-gray-500">查看最近的登录记录</p>
                          </div>
                          <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105">
                            查看历史
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 通知设置 */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <div className="space-y-8">
                    {/* 邮件通知 */}
                    <div className="bg-yellow-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Bell className="w-5 h-5 mr-2 text-yellow-600" />
                        邮件通知
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-yellow-200">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">新内容通知</h4>
                            <p className="text-sm text-gray-500">当您订阅的创作者发布新内容时</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-yellow-200">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">订阅提醒</h4>
                            <p className="text-sm text-gray-500">订阅即将到期时的提醒</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-yellow-200">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">营销邮件</h4>
                            <p className="text-sm text-gray-500">接收产品更新和推广信息</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* 推送通知 */}
                    <div className="bg-orange-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Bell className="w-5 h-5 mr-2 text-orange-600" />
                        推送通知
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-orange-200">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">浏览器通知</h4>
                            <p className="text-sm text-gray-500">在浏览器中显示通知</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 隐私设置 */}
              {activeTab === 'privacy' && (
                <div className="p-6">
                  <div className="space-y-8">
                    {/* 可见性设置 */}
                    <div className="bg-purple-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Lock className="w-5 h-5 mr-2 text-purple-600" />
                        可见性设置
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">个人资料可见性</h4>
                            <p className="text-sm text-gray-500">控制谁可以查看您的个人资料</p>
                          </div>
                          <select className="border border-purple-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                            <option>所有人</option>
                            <option>仅订阅者</option>
                            <option>仅自己</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">订阅列表可见性</h4>
                            <p className="text-sm text-gray-500">控制谁可以查看您的订阅列表</p>
                          </div>
                          <select className="border border-purple-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                            <option>所有人</option>
                            <option>仅自己</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 数据管理 */}
                    <div className="bg-indigo-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-indigo-600" />
                        数据管理
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-indigo-200">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">数据下载</h4>
                            <p className="text-sm text-gray-500">下载您的个人数据副本</p>
                          </div>
                          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105">
                            请求下载
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-indigo-200">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Cookie 设置</h4>
                            <p className="text-sm text-gray-500">管理网站 Cookie 偏好</p>
                          </div>
                          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105">
                            管理 Cookie
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 账单设置 */}
              {activeTab === 'billing' && (
                <div className="p-6">
                  <div className="space-y-8">
                    {/* 当前订阅 */}
                    <div className="bg-green-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                        当前订阅
                      </h3>
                      <div className="bg-white rounded-lg border border-green-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">高级会员</h4>
                            <p className="text-sm text-gray-500">享受所有高级功能</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">¥29.9</p>
                            <p className="text-sm text-gray-500">每月</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Check className="w-3 h-3 mr-1" />
                            活跃订阅
                          </span>
                          <div className="space-x-2">
                            <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105">
                              管理订阅
                            </button>
                            <button className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105">
                              升级套餐
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 付款方式 */}
                    <div className="bg-blue-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                        付款方式
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                              <span className="text-white text-xs font-bold">VISA</span>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">**** **** **** 1234</h4>
                              <p className="text-sm text-gray-500">到期日：12/26</p>
                            </div>
                          </div>
                          <div className="space-x-2">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-all duration-200 transform hover:scale-105">
                              更改
                            </button>
                            <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 rounded-lg transition-all duration-200 transform hover:scale-105">
                              删除
                            </button>
                          </div>
                        </div>
                        
                        <button className="w-full p-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors duration-200">
                          + 添加新的付款方式
                        </button>
                      </div>
                    </div>

                    {/* 账单历史 */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
                        账单管理
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">账单历史</h4>
                            <p className="text-sm text-gray-500">查看过往的付款记录和发票</p>
                          </div>
                          <button className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105">
                            查看历史
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">发票设置</h4>
                            <p className="text-sm text-gray-500">配置发票信息和收件地址</p>
                          </div>
                          <button className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105">
                            设置发票
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">自动续费</h4>
                            <p className="text-sm text-gray-500">管理订阅的自动续费设置</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;