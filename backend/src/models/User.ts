import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  isCreator: boolean;
  isVerified: boolean;
  subscriptions: mongoose.Types.ObjectId[];
  favorites: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Please enter a valid email address'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  isCreator: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  subscriptions: [{
    type: Schema.Types.ObjectId,
    ref: 'Subscription'
  }],
  favorites: [{
    type: Schema.Types.ObjectId,
    ref: 'Content'
  }]
}, {
  timestamps: true
});

// 索引
UserSchema.index({ isCreator: 1 });

// 确保索引在测试环境中被创建
UserSchema.set('autoIndex', true);

// 强制创建索引
UserSchema.post('init', async function() {
  if (process.env.NODE_ENV === 'test') {
    try {
      await this.collection.createIndex({ email: 1 }, { unique: true });
      await this.collection.createIndex({ username: 1 }, { unique: true });
    } catch (error) {
      // 索引可能已存在，忽略错误
    }
  }
});

export const User = mongoose.model<IUser>('User', UserSchema);