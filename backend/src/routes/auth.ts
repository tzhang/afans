import { Router } from 'express';
import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const router = Router();

// 使用数据库模型替代临时存储

// 用户注册
router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password, userType = 'user' } = req.body;

  // 验证必填字段
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: '用户名、邮箱和密码都是必填项'
    });
  }

  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: '邮箱格式不正确'
    });
  }

  // 验证密码长度
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: '密码长度至少为6位'
    });
  }

  // 检查用户是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '该邮箱已被注册'
      });
    }

  // 密码加密
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // 创建新用户
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    isCreator: userType === 'creator',
    isVerified: true  // 简化测试，默认设为已验证
  });

  await newUser.save();

  // 生成JWT令牌
  const token = jwt.sign(
    { userId: newUser._id, email: newUser.email },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );

  res.status(201).json({
    success: true,
    message: '注册成功',
    data: {
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          isCreator: newUser.isCreator
        },
        token
      }
  });
}));

// 用户登录
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // 验证必填字段
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: '邮箱和密码都是必填项'
    });
  }

  // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 检查邮箱是否已验证
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: '请先验证邮箱'
      });
    }

  // 生成JWT令牌
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    message: '登录成功',
    data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isCreator: user.isCreator
        },
        token
      }
  });
}));

// 用户登出
router.post('/logout', asyncHandler(async (req: Request, res: Response) => {
  // TODO: 实现用户登出逻辑
  res.json({
    success: true,
    message: '退出登录成功'
  });
}));

// 刷新令牌
router.post('/refresh', asyncHandler(async (req: Request, res: Response) => {
  // TODO: 实现令牌刷新逻辑
  res.json({
    success: true,
    message: 'Token refresh endpoint - to be implemented',
    data: null
  });
}));

// 忘记密码
router.post('/forgot-password', asyncHandler(async (req: Request, res: Response) => {
  // TODO: 实现忘记密码逻辑
  res.json({
    success: true,
    message: 'Forgot password endpoint - to be implemented'
  });
}));

// 重置密码
router.post('/reset-password', asyncHandler(async (req: Request, res: Response) => {
  // TODO: 实现重置密码逻辑
  res.json({
    success: true,
    message: 'Reset password endpoint - to be implemented'
  });
}));

export default router;