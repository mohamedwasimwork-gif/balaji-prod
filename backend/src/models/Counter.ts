import mongoose, { Schema } from 'mongoose';

export interface ICounter {
  _id: string;
  seq: number;
}

const counterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

export const Counter = mongoose.model<ICounter>('Counter', counterSchema);

export async function getNextSequence(name: 'expense' | 'invoice'): Promise<string> {
  const counter = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const num = counter!.seq.toString().padStart(3, '0');
  const prefix = name === 'expense' ? 'exp' : 'inv';
  return `${prefix}-${num}`;
}
