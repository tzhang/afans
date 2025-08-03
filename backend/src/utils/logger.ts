import winston from 'winston';

// 创建 Winston 日志器
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'ago-backend' },
  transports: [
    // 写入所有日志到 combined.log
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// 如果不是生产环境，也输出到控制台
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// 创建日志目录
import { mkdirSync } from 'fs';
import { dirname } from 'path';

try {
  mkdirSync(dirname('logs/combined.log'), { recursive: true });
} catch (error) {
  // 目录可能已存在
}