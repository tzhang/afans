import axios from 'axios';
import toast from 'react-hot-toast';

// 创建axios实例
const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 添加认证token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 处理通用错误
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          toast.error('登录已过期，请重新登录');
          break;
        case 403:
          toast.error('没有权限访问此资源');
          break;
        case 404:
          toast.error('请求的资源不存在');
          break;
        case 500:
          toast.error('服务器内部错误');
          break;
        default:
          toast.error(data.message || '请求失败');
      }
    } else if (error.request) {
      toast.error('网络连接失败，请检查网络');
    } else {
      toast.error('请求配置错误');
    }
    
    return Promise.reject(error);
  }
);

// 用户相关API
export const userAPI = {
  // 登录
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  // 注册
  register: (userData: {
    username: string;
    email: string;
    password: string;
    accountType: 'user' | 'creator';
  }) => api.post('/auth/register', userData),
  
  // 获取当前用户信息
  getCurrentUser: () => api.get('/user/profile'),
  
  // 更新用户资料
  updateProfile: (profileData: any) => 
    api.put('/user/profile', profileData),
  
  // 上传头像
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // 获取用户订阅列表
  getSubscriptions: () => api.get('/user/subscriptions'),
  
  // 获取用户收藏列表
  getFavorites: () => api.get('/user/favorites'),
};

// 创作者相关API
export const creatorAPI = {
  // 获取创作者列表
  getCreators: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }) => api.get('/creators', { params }),
  
  // 获取创作者详情
  getCreatorById: (id: string) => api.get(`/creators/${id}`),
  
  // 创建/更新创作者资料
  updateCreatorProfile: (profileData: any) => 
    api.put('/creators/profile', profileData),
  
  // 获取创作者内容
  getCreatorContent: (id: string, params?: {
    page?: number;
    limit?: number;
    type?: string;
  }) => api.get(`/creators/${id}/content`, { params }),
  
  // 获取创作者订阅者
  getCreatorSubscribers: (id: string) => 
    api.get(`/creators/${id}/subscribers`),
  
  // 获取收益统计
  getEarningsStats: () => api.get('/creators/earnings'),
};

// 内容相关API
export const contentAPI = {
  // 获取内容列表
  getContentList: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    creatorId?: string;
    contentType?: string;
  }) => {
    const response = await api.get('/content', { params });
    return response.data;
  },

  // 获取内容详情
  getContentById: async (id: string) => {
    const response = await api.get(`/content/${id}`);
    return response.data;
  },

  // 上传视频
  uploadVideo: async (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('video', file);
    
    const response = await api.post('/content/upload-video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return response.data;
  },

  // 上传缩略图
  uploadThumbnail: async (file: File) => {
    const formData = new FormData();
    formData.append('thumbnail', file);
    
    const response = await api.post('/content/upload-thumbnail', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 创建内容
  createContent: async (contentData: any) => {
    const response = await api.post('/content', contentData);
    return response.data;
  },

  // 更新内容
  updateContent: async (id: string, contentData: any) => {
    const response = await api.put(`/content/${id}`, contentData);
    return response.data;
  },

  // 删除内容
  deleteContent: async (id: string) => {
    const response = await api.delete(`/content/${id}`);
    return response.data;
  },

  // 点赞内容
  likeContent: async (id: string) => {
    const response = await api.post(`/content/${id}/like`);
    return response.data;
  },

  // 取消点赞
  unlikeContent: async (id: string) => {
    const response = await api.delete(`/content/${id}/like`);
    return response.data;
  },

  // 收藏内容
  favoriteContent: async (id: string) => {
    const response = await api.post(`/content/${id}/favorite`);
    return response.data;
  },

  // 取消收藏
  unfavoriteContent: async (id: string) => {
    const response = await api.delete(`/content/${id}/favorite`);
    return response.data;
  },

  // 获取评论
  getComments: (contentId: string, params?: {
    page?: number;
    limit?: number;
  }) => api.get(`/content/${contentId}/comments`, { params }),
  
  // 添加评论
  addComment: (contentId: string, comment: string) => 
    api.post(`/content/${contentId}/comments`, { comment }),
};

// 订阅相关API
export const subscriptionAPI = {
  // 创建订阅
  createSubscription: (creatorId: string, planId: string) => 
    api.post('/subscriptions', { creatorId, planId }),
  
  // 获取用户订阅列表
  getUserSubscriptions: () => api.get('/subscriptions/user'),
  
  // 获取创作者订阅者列表
  getCreatorSubscribers: (creatorId: string) => 
    api.get(`/subscriptions/creator/${creatorId}`),
  
  // 取消订阅
  cancelSubscription: (subscriptionId: string) => 
    api.delete(`/subscriptions/${subscriptionId}`),
  
  // 暂停订阅
  pauseSubscription: (subscriptionId: string) => 
    api.put(`/subscriptions/${subscriptionId}/pause`),
  
  // 恢复订阅
  resumeSubscription: (subscriptionId: string) => 
    api.put(`/subscriptions/${subscriptionId}/resume`),
  
  // 更新订阅设置
  updateSubscriptionSettings: (subscriptionId: string, settings: any) => 
    api.put(`/subscriptions/${subscriptionId}/settings`, settings),
  
  // 获取订阅详情
  getSubscriptionDetails: (subscriptionId: string) => 
    api.get(`/subscriptions/${subscriptionId}`),
};

// 支付相关API
export const paymentAPI = {
  // 创建支付意图
  createPaymentIntent: (amount: number, currency: string, metadata?: any) => 
    api.post('/payments/create-intent', { amount, currency, metadata }),
  
  // 确认支付
  confirmPayment: (paymentIntentId: string, paymentMethodId: string) => 
    api.post('/payments/confirm', { paymentIntentId, paymentMethodId }),
  
  // 获取支付历史
  getPaymentHistory: (params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }) => api.get('/payments/history', { params }),
  
  // 获取支付详情
  getPaymentDetails: (paymentId: string) => 
    api.get(`/payments/${paymentId}`),
  
  // 申请退款
  requestRefund: (paymentId: string, reason?: string) => 
    api.post(`/payments/${paymentId}/refund`, { reason }),
  
  // 获取收益统计
  getEarningsStats: (params?: {
    startDate?: string;
    endDate?: string;
    granularity?: 'day' | 'week' | 'month';
  }) => api.get('/payments/earnings', { params }),
};

// 认证相关工具函数
export const authUtils = {
  // 设置token
  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },
  
  // 获取token
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  // 清除token
  clearToken: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // 检查是否已登录
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  // 设置用户信息
  setUser: (user: any) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  // 获取用户信息
  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

export default api;