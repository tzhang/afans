import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  contentId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  parentId?: mongoose.Types.ObjectId;
  likeCount: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  contentId: {
    type: Schema.Types.ObjectId,
    ref: 'Content',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  },
  likeCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// 索引
CommentSchema.index({ contentId: 1 });
CommentSchema.index({ userId: 1 });
CommentSchema.index({ parentId: 1 });
CommentSchema.index({ createdAt: -1 });
CommentSchema.index({ isDeleted: 1 });

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);