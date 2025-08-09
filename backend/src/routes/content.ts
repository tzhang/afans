import { Router } from 'express';
import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken, optionalAuth, requireCreator } from '../middleware/auth';
import { Content, Creator } from '../models';

const router = Router();

// 确保上传目录存在
const uploadDir = path.join(process.cwd(), 'uploads');
const videoDir = path.join(uploadDir, 'videos');
const thumbnailDir = path.join(uploadDir, 'thumbnails');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir, { recursive: true });
}
if (!fs.existsSync(thumbnailDir)) {
  fs.mkdirSync(thumbnailDir, { recursive: true });
}

// 配置multer存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'video') {
      cb(null, videoDir);
    } else if (file.fieldname === 'thumbnail') {
      cb(null, thumbnailDir);
    } else {
      cb(null, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// 文件过滤器
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.fieldname === 'video') {
    // 允许的视频格式
    const allowedVideoTypes = /mp4|avi|mov|wmv|flv|webm|mkv/;
    const extname = allowedVideoTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedVideoTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  } else if (file.fieldname === 'thumbnail') {
    // 允许的图片格式
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedImageTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for thumbnails'));
    }
  } else {
    cb(new Error('Unexpected field'));
  }
};

// 配置multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB 限制
  },
  fileFilter: fileFilter
});

// 获取内容列表
router.get('/', optionalAuth, asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 20,
    category,
    search,
    creatorId,
    contentType = 'video'
  } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  // 构建查询条件
  const query: any = {
    status: 'published',
    contentType
  };

  if (category) {
    query.category = category;
  }

  if (creatorId) {
    query.creatorId = creatorId;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search as string, $options: 'i' } },
      { description: { $regex: search as string, $options: 'i' } }
    ];
  }

  // 如果用户未登录，只显示公开内容
  if (!req.user) {
    query.isPublic = true;
  }

  try {
    const [content, total] = await Promise.all([
      Content.find(query)
        .populate('creatorId', 'displayName avatar isVerified')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Content.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        content,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content'
    });
  }
}));

// 获取内容详情
router.get('/:id', optionalAuth, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const content = await Content.findById(id)
      .populate('creatorId', 'displayName avatar isVerified category description')
      .lean();

    if (!content) {
      return res.status(404).json({
        success: false,
        message: '内容不存在'
      });
    }

    // 检查访问权限
    if (!content.isPublic && (!req.user || (req.user._id as any).toString() !== content.creatorId.toString())) {
      return res.status(403).json({
        success: false,
        message: '无权访问此内容'
      });
    }

    // 增加浏览量
    await Content.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

    // 重命名 creatorId 为 creator 以匹配前端期望
    const responseData = {
      ...content,
      creator: content.creatorId,
      creatorId: undefined
    };
    delete responseData.creatorId;

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content details'
    });
  }
}));

// 创建内容
router.post('/', authenticateToken, requireCreator, asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    description,
    category,
    tags,
    contentType = 'video',
    isPublic = true,
    isPremium = false,
    price = 0,
    videoUrl,
    thumbnailUrl
  } = req.body;

  try {
    // 验证必填字段
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: '标题、描述和分类为必填项'
      });
    }

    // 获取创作者信息
    const creator = await Creator.findOne({ userId: req.userId });
    if (!creator) {
      return res.status(404).json({
        success: false,
        message: 'Creator profile not found'
      });
    }

    // 创建内容
    const content = new Content({
      creatorId: creator._id,
      title,
      description,
      category,
      tags: Array.isArray(tags) ? tags : [],
      contentType,
      isPublic,
      isPremium,
      price: isPremium ? price : 0,
      videoUrl,
      thumbnailUrl,
      status: 'published',
      publishedAt: new Date()
    });

    await content.save();

    // 更新创作者统计
    await Creator.findByIdAndUpdate(creator._id, {
      $inc: { 'stats.totalContent': 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      data: content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create content'
    });
  }
}));

// 更新内容
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  // TODO: 实现更新内容逻辑
  res.json({
    success: true,
    message: 'Update content endpoint - to be implemented',
    data: null
  });
}));

// 删除内容
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  // TODO: 实现删除内容逻辑
  res.json({
    success: true,
    message: 'Delete content endpoint - to be implemented'
  });
}));

// 上传视频
router.post('/upload-video', authenticateToken, requireCreator, upload.single('video'), asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No video file uploaded'
      });
    }

    // 获取文件信息
    const file = req.file;
    const videoUrl = `/uploads/videos/${file.filename}`;
    
    // 这里可以添加视频处理逻辑，比如生成缩略图、转码等
    // 暂时返回基本信息
    
    res.json({
      success: true,
      message: 'Video uploaded successfully',
      data: {
        videoUrl,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload video'
    });
  }
}));

// 上传缩略图
router.post('/upload-thumbnail', authenticateToken, requireCreator, upload.single('thumbnail'), asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No thumbnail file uploaded'
      });
    }

    const file = req.file;
    const thumbnailUrl = `/uploads/thumbnails/${file.filename}`;
    
    res.json({
      success: true,
      message: 'Thumbnail uploaded successfully',
      data: {
        thumbnailUrl,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload thumbnail'
    });
  }
}));

// 点赞内容
router.post('/:id/like', asyncHandler(async (req: Request, res: Response) => {
  // TODO: 实现点赞内容逻辑
  res.json({
    success: true,
    message: 'Like content endpoint - to be implemented'
  });
}));

// 收藏内容
router.post('/:id/favorite', asyncHandler(async (req: Request, res: Response) => {
  // TODO: 实现收藏内容逻辑
  res.json({
    success: true,
    message: 'Favorite content endpoint - to be implemented'
  });
}));

// 获取内容评论
router.get('/:id/comments', asyncHandler(async (req: Request, res: Response) => {
  // TODO: 实现获取内容评论逻辑
  res.json({
    success: true,
    message: 'Get content comments endpoint - to be implemented',
    data: []
  });
}));

// 添加评论
router.post('/:id/comments', asyncHandler(async (req: Request, res: Response) => {
  // TODO: 实现添加评论逻辑
  res.json({
    success: true,
    message: 'Add comment endpoint - to be implemented',
    data: null
  });
}));

export default router;