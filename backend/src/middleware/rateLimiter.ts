import { Request, Response, NextFunction } from 'express';

// 简化的速率限制器（生产环境建议使用 express-rate-limit）
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15分钟
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  
  // 清理过期记录
  if (store[clientIP] && now > store[clientIP].resetTime) {
    delete store[clientIP];
  }
  
  // 初始化或更新计数
  if (!store[clientIP]) {
    store[clientIP] = {
      count: 1,
      resetTime: now + WINDOW_MS
    };
  } else {
    store[clientIP].count++;
  }
  
  // 检查是否超过限制
  if (store[clientIP].count > MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests, please try again later.',
      retryAfter: Math.ceil((store[clientIP].resetTime - now) / 1000)
    });
  }
  
  // 添加响应头
  res.set({
    'X-RateLimit-Limit': MAX_REQUESTS.toString(),
    'X-RateLimit-Remaining': (MAX_REQUESTS - store[clientIP].count).toString(),
    'X-RateLimit-Reset': new Date(store[clientIP].resetTime).toISOString()
  });
  
  next();
};