import mongoose, { Schema } from 'mongoose';

export interface IPageContent {
  page: 'home' | 'solutions' | 'contact';
  data: Record<string, unknown>;
  updatedBy?: mongoose.Types.ObjectId;
}

const pageContentSchema = new Schema<IPageContent>(
  {
    page: { type: String, required: true, unique: true, enum: ['home', 'solutions', 'contact'] },
    data: { type: Schema.Types.Mixed, default: {} },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const PageContent = mongoose.model<IPageContent>('PageContent', pageContentSchema);
