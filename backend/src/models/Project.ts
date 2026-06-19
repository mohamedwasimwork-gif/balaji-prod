import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

export interface IProject extends Document {
  projectTitle: string;
  companyName: string;
  clientName: string;
  phoneNumber: string;
  email: string;
  gstNumber?: string;
  address?: IAddress;
  status: 'active' | 'draft' | 'inactive';
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    line1: { type: String },
    line2: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    country: { type: String, default: 'India' },
  },
  { _id: false }
);

const projectSchema = new Schema<IProject>(
  {
    projectTitle: { type: String, required: true },
    companyName: { type: String, required: true },
    clientName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    gstNumber: { type: String },
    address: { type: addressSchema },
    status: { type: String, enum: ['active', 'draft', 'inactive'], default: 'active' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

projectSchema.index({ projectTitle: 'text', companyName: 'text', clientName: 'text' });

export const Project = mongoose.model<IProject>('Project', projectSchema);
