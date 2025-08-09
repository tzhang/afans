import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// 导入页面组件
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import CreatorsPage from './pages/CreatorsPage';
import NotFoundPage from './pages/NotFoundPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import SettingsPage from './pages/SettingsPage';
import CreatorDetailPage from './pages/CreatorDetailPage';
import ContentDetailPage from './pages/ContentDetailPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import ProfilePage from './pages/ProfilePage';
import UploadPage from './pages/UploadPage';

// 导入布局组件
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* 公开路由 */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="creators" element={<CreatorsPage />} />
          <Route path="creator/:id" element={<CreatorDetailPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="content/:id" element={<ContentDetailPage />} />
          
          {/* 受保护的路由 */}
          <Route path="profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
          <Route path="subscriptions" element={
            <ProtectedRoute>
              <SubscriptionsPage />
            </ProtectedRoute>
          } />
          <Route path="upload" element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          } />
          {/* 404 页面 - 必须放在最后 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      
      {/* 全局通知 */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;