import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { PageContent } from '../models/PageContent.js';

const SIX_ITEMS = [
  {
    title: "India's Largest Turbine",
    description:
      "Delivered India's largest 4.2MW onsite wind turbine as a complete turnkey project for WEG Brazil.",
  },
  {
    title: 'Large-Scale Orders',
    description:
      'Successfully executed 300MW foundations, 110MW land acquisition, and 138MW WTG logistics for Sprng Energy.',
  },
  {
    title: 'Proven Experience',
    description:
      'Since 2005, executed over 2000MW of wind turbine foundations across multiple platforms in India.',
  },
  {
    title: 'International Presence',
    description:
      'First Indian developer to successfully execute wind turbine foundations in Sri Lanka with OEM Suzlon.',
  },
  {
    title: 'Regulatory Leadership',
    description:
      'First developer to manage liaisoning under Tamil Nadu CDB Rules 2019 for wind electric generators.',
  },
  {
    title: 'Solar Expansion',
    description:
      'Expanded into utility-scale solar EPC in 2021, delivering ground-mount installations with full civil, electrical, and SCADA integration.',
  },
];

async function migrate() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/balaji';
  await mongoose.connect(uri);
  console.log('Connected to', uri);

  const result = await PageContent.findOneAndUpdate(
    { page: 'solutions' },
    { $set: { 'data.solutionsAchievements.items': SIX_ITEMS } },
    { new: true }
  );

  if (!result) {
    console.error('solutions PageContent not found — run seed first');
    process.exit(1);
  }

  console.log(`✓ solutionsAchievements.items updated to ${SIX_ITEMS.length} cards`);
  await mongoose.disconnect();
}

migrate().catch((err) => { console.error(err); process.exit(1); });
