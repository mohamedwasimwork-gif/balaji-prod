import mongoose, { Schema, Document, Types } from 'mongoose';
import { IProjectSnapshot } from './Expense.js';

export interface IInvoice extends Document {
  invoiceId: string;
  projectId: Types.ObjectId;
  projectSnapshot: IProjectSnapshot;
  purpose: string;
  amount: number;
  amountType: 'credit' | 'debit';
  paymentMode: 'cash' | 'upi' | 'bank' | 'other';
  refId: string;
  remarks?: string;
  vendorName?: string;
  invoiceNumber?: string;
  gstNumber?: string;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSnapshotSchema = new Schema(
  {
    projectTitle: String,
    companyName: String,
    clientName: String,
    phoneNumber: String,
    email: String,
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },
  },
  { _id: false }
);

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceId: { type: String, required: true, unique: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    projectSnapshot: { type: projectSnapshotSchema, required: true },
    purpose: { type: String, required: true, maxlength: 5000 },
    amount: { type: Number, required: true, min: 0 },
    amountType: { type: String, enum: ['credit', 'debit'], required: true },
    paymentMode: { type: String, enum: ['cash', 'upi', 'bank', 'other'], required: true },
    refId: { type: String, required: true },
    remarks: { type: String },
    vendorName: { type: String, maxlength: 500 },
    invoiceNumber: { type: String, maxlength: 100 },
    gstNumber: { type: String, maxlength: 20 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

invoiceSchema.index({ projectId: 1 });
invoiceSchema.index({ createdAt: -1 });

export const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema);
