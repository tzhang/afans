import mongoose, { Document, Schema } from 'mongoose';

export interface ICreator extends Document {
  userId: mongoose.Types.ObjectId;
  displayName: string;
  description: string;
  category: string;
  avatar: string;
  coverImage: string;
  socialLinks: {
    website?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  subscriptionPlans: {
    id: string;
    name: string;
    price: number;
    description: string;
    features: string[];
  }[];
  stats: {
    totalSubscribers: number;
    totalContent: number;
    totalEarnings: number;
    averageRating: number;
  };
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CreatorSchema = new Schema<ICreator>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['fitness', 'cooking', 'education', 'entertainment', 'lifestyle', 'technology', 'art', 'music', 'other']
  },
  avatar: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  socialLinks: {
    website: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    youtube: { type: String, default: '' }
  },
  subscriptionPlans: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    features: [{ type: String }]
  }],
  stats: {
    totalSubscribers: { type: Number, default: 0 },
    totalContent: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// 索引
CreatorSchema.index({ userId: 1 });
CreatorSchema.index({ category: 1 });
CreatorSchema.index({ isVerified: 1 });
CreatorSchema.index({ isActive: 1 });
CreatorSchema.index({ 'stats.totalSubscribers': -1 });

export const Creator = mongoose.model<ICreator>('Creator', CreatorSchema);