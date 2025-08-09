import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* 404 图标 */}
          <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-8">
            <span className="text-4xl font-bold text-blue-600">404</span>
          </div>
          
          {/* 标题和描述 */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            页面未找到
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            抱歉，您访问的页面不存在或已被移除。
          </p>
          
          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              返回首页
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              返回上页
            </button>
          </div>
          
          {/* 建议链接 */}
          <div className="mt-12">
            <h3 className="text-sm font-medium text-gray-900 mb-4">您可能想要访问：</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/creators"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                浏览创作者
              </Link>
              <Link
                to="/search"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                搜索内容
              </Link>
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                登录账户
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;