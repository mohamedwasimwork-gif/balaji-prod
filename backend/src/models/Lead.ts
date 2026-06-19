import mongoose, { Schema } from 'mongoose';

export interface ILead {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  formName?: string;
  status: 'new' | 'contacted' | 'closed';
  source: 'framer' | 'react' | 'manual';
  isContacted: boolean;
  contactedAt?: Date;
  contactedBy?: mongoose.Types.ObjectId;
  notes?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    service: { type: String, default: '' },
    message: { type: String, default: '' },
    formName: { type: String, default: 'contact' },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
    source: { type: String, enum: ['framer', 'react', 'manual'], default: 'framer' },
    isContacted: { type: Boolean, default: false },
    contactedAt: { type: Date },
    contactedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String, default: '' },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true }
);

leadSchema.index({ status: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ email: 1 });

export const Lead = mongoose.model<ILead>('Lead', leadSchema);
