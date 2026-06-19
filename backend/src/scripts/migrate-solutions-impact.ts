import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { PageContent } from '../models/PageContent.js';

async function migrate() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/balaji';
  await mongoose.connect(uri);
  console.log('Connected to', uri);

  const doc = await PageContent.findOne({ page: 'solutions' });
  if (!doc) {
    console.error('solutions PageContent not found — run seed first');
    process.exit(1);
  }

  const existing = doc.data as Record<string, unknown>;

  // Only migrate if impactStats is still the old array format
  if (Array.isArray(existing.impactStats)) {
    const oldItems = existing.impactStats as Array<{ value: string; label: string }>;
    const newImpactStats = {
      sectionLabel: 'Our Impact',
      heading: 'Real Results for Real Projects',
      description: 'Numbers that reflect our commitment to quality execution and long-term client value.',
      items: oldItems.length > 0 ? oldItems : [
        { value: '2000+ MW', label: 'Wind Turbine Foundations' },
        { value: '65%', label: 'Reduction in Electricity Costs' },
        { value: '20+', label: 'Years of Experience' },
        { value: '90%', label: 'Energy Independence Achieved' },
      ],
    };

    await PageContent.findOneAndUpdate(
      { page: 'solutions' },
      { $set: { 'data.impactStats': newImpactStats } }
    );
    console.log('✓ impactStats migrated from array → section object');
  } else {
    console.log('✓ impactStats already in new format — no migration needed');
  }

  await mongoose.disconnect();
}

migrate().catch((err) => { console.error(err); process.exit(1); });
