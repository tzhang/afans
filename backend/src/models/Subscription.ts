import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  creatorId: mongoose.Types.ObjectId;
  planId: string;
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  renewalDate: Date;
  amount: number;
  currency: string;
  paymentMethod: string;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: 'Creator',
    required: true
  },
  planId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled', 'expired'],
    default: 'active'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  renewalDate: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  paymentMethod: {
    type: String,
    required: true
  },
  autoRenew: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// 索引
SubscriptionSchema.index({ userId: 1 });
SubscriptionSchema.index({ creatorId: 1 });
SubscriptionSchema.index({ status: 1 });
SubscriptionSchema.index({ endDate: 1 });
SubscriptionSchema.index({ renewalDate: 1 });

export const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);