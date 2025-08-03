import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Users, Star, TrendingUp } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              让创作者专注创作
              <br />
              <span className="text-blue-600">让订阅更有价值</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              ago.im 是专注于订阅制的个人视频创作者变现平台，提供简洁的内容发布、灵活的定价策略和优质的用户体验。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-primary text-lg px-8 py-3"
              >
                开始创作
              </Link>
              <Link
                to="/creators"
                className="btn-secondary text-lg px-8 py-3"
              >
                发现创作者
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              为什么选择 ago.im？
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              我们专注于订阅制模式，为创作者和用户提供最佳的内容变现体验。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">简洁发布</h3>
              <p className="text-gray-600">
                一键上传视频，简单设置订阅价格，专注于内容创作本身。
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">订阅制变现</h3>
              <p className="text-gray-600">
                月度订阅模式，稳定的收入来源，与粉丝建立长期关系。
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">优质体验</h3>
              <p className="text-gray-600">
                流畅的视频播放，便捷的订阅管理，为用户提供最佳观看体验。
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">数据分析</h3>
              <p className="text-gray-600">
                详细的订阅数据和收益分析，帮助创作者优化内容策略。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            准备开始你的创作之旅？
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            加入 ago.im，与数千名创作者一起，通过订阅制模式实现内容变现。
          </p>
          <Link
            to="/register"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg text-lg transition-colors duration-200"
          >
            立即注册
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;