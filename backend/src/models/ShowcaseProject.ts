import mongoose, { Schema } from 'mongoose';

export interface IShowcaseProject {
  title: string;
  slug: string;
  client: string;
  location: string;
  category: string;
  projectDate?: Date;
  overview?: string;
  imageUrl?: string;
  images: string[];
  scopeOfWork: string[];
  keyHighlights: string[];
  status: 'draft' | 'published';
  isFeatured: boolean;
  order: number;
}

const showcaseProjectSchema = new Schema<IShowcaseProject>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    client: { type: String, default: '' },
    location: { type: String, default: '' },
    category: { type: String, default: '' },
    projectDate: { type: Date },
    overview: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    images: [{ type: String }],
    scopeOfWork: [{ type: String }],
    keyHighlights: [{ type: String }],
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ShowcaseProject = mongoose.model<IShowcaseProject>('ShowcaseProject', showcaseProjectSchema);
