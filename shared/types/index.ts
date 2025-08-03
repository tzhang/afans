// ago.im 共享类型定义

// 用户相关类型
export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 创作者相关类型
export interface Creator {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  monthlySubscriptionPrice: number;
  subscriberCount: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 内容相关类型
export interface Content {
  id: string;
  creatorId: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  contentType: 'free' | 'subscription';
  tags: string[];
  viewCount: number;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// 订阅相关类型
export interface Subscription {
  id: string;
  userId: string;
  creatorId: string;
  monthlyPrice: number;
  status: 'active' | 'cancelled' | 'expired';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 支付相关类型
export interface SubscriptionOrder {
  id: string;
  userId: string;
  creatorId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'stripe' | 'paypal';
  stripePaymentIntentId?: string;
  billingPeriod: 'monthly';
  createdAt: Date;
  updatedAt: Date;
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 分页类型
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}