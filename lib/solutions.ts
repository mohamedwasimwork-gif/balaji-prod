export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface SolutionItem {
  title: string;
  items: string[];
}

export const CORE_SERVICES: Service[] = [
  {
    id: 'site-selection',
    number: '01',
    title: 'Site Selection',
    description:
      'Conducting thorough technical assessments and detailed load flow studies to ensure safe, efficient, and compliant project planning outcomes.',
  },
  {
    id: 'government-approvals',
    number: '02',
    title: 'Government Approvals',
    description:
      'Facilitating project registration and obtaining all required approvals, including Minister NOC, until successful project commissioning.',
  },
  {
    id: 'land-acquisition',
    number: '03',
    title: 'Land Acquisition',
    description:
      'Securing land with clear titles, including cleaning, soil testing, contour surveys, and preparation for construction activities onsite.',
  },
  {
    id: 'civil-foundations',
    number: '04',
    title: 'Civil Foundations',
    description:
      'Developing civil foundations, crane pads, access pathways, and supporting infrastructure required for smooth turbine installation operations.',
  },
];

export const WIND_SOLUTION: SolutionItem = {
  title: 'Wind Solutions',
  items: [
    'Precision-engineered WTG foundations',
    'Heavy-duty crane pad construction',
    'HT line and DP yard works',
  ],
};

export const SOLAR_SOLUTION: SolutionItem = {
  title: 'Solar Solutions',
  items: [
    'Ground-mount structure installation',
    'DC and AC electrical works',
    'Inverter, SCADA, and monitoring setup',
  ],
};

export const WORKFLOW_STEPS = [
  {
    title: 'Survey',
    description: 'Site analysis ensures accurate planning and smooth project execution from start.',
  },
  {
    title: 'Engineering',
    description:
      'Detailed designs optimize safety, strength, and performance for every project requirement.',
  },
  {
    title: 'Construction',
    description:
      'Skilled teams execute civil and electrical works with strict quality standards.',
  },
  {
    title: 'Commissioning',
    description:
      'Final testing verifies complete system readiness and long-term operational reliability.',
  },
];

export const ACHIEVEMENTS = [
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
];
