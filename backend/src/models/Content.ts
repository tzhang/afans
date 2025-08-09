import mongoose, { Document, Schema } from 'mongoose';

export interface IContent extends Document {
  creatorId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  contentType: 'video' | 'image' | 'audio' | 'text';
  category: string;
  tags: string[];
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number; // 视频时长（秒）
  fileSize?: number; // 文件大小（字节）
  resolution?: string; // 视频分辨率
  isPublic: boolean;
  isPremium: boolean;
  price?: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  status: 'draft' | 'published' | 'archived' | 'processing';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>({
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: 'Creator',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  contentType: {
    type: String,
    required: true,
    enum: ['video', 'image', 'audio', 'text']
  },
  category: {
    type: String,
    required: true,
    enum: ['fitness', 'cooking', 'education', 'entertainment', 'lifestyle', 'technology', 'art', 'music', 'other']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  videoUrl: {
    type: String,
    default: ''
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    min: 0
  },
  fileSize: {
    type: Number,
    min: 0
  },
  resolution: {
    type: String,
    default: ''
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    min: 0,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  likeCount: {
    type: Number,
    default: 0,
    min: 0
  },
  commentCount: {
    type: Number,
    default: 0,
    min: 0
  },
  shareCount: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'processing'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// 索引
ContentSchema.index({ creatorId: 1 });
ContentSchema.index({ category: 1 });
ContentSchema.index({ contentType: 1 });
ContentSchema.index({ status: 1 });
ContentSchema.index({ isPublic: 1 });
ContentSchema.index({ isPremium: 1 });
ContentSchema.index({ publishedAt: -1 });
ContentSchema.index({ viewCount: -1 });
ContentSchema.index({ likeCount: -1 });
ContentSchema.index({ tags: 1 });
ContentSchema.index({ title: 'text', description: 'text' });

export const Content = mongoose.model<IContent>('Content', ContentSchema);