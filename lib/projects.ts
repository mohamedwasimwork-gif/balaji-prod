export interface Project {
  slug: string;
  title: string;
  category: string;
  date: string;
  image: string;
  client: string;
  location: string;
  overview: string;
  scope: string[];
  highlights: string[];
}

export const PROJECTS: Project[] = [
  {
    slug: 'weg-4-2mw-wind-turbine-tirunelveli',
    title: 'WEG 4.2 MW Landmark Project',
    category: 'Wind EPC – Turnkey',
    date: 'Dec 14, 2025',
    image: '/images/hero-bg.jpg',
    client: 'WEG Industries Pvt. Ltd',
    location: 'Vadalivilai, Tirunelveli District, Tamil Nadu',
    overview:
      'A landmark project involving the AGW 147 – 4.2 MW, one of India\'s largest onsite wind turbines. Balaji & Co delivered this project with full turnkey responsibility.',
    scope: [
      'Complete WTG foundation construction',
      'Land development and statutory approvals',
      'Site infrastructure and access development',
      'End-to-end civil execution support',
    ],
    highlights: [
      "One of India's largest onsite wind turbines",
      'Full turnkey execution',
      'Zero safety incidents',
      'Recognized milestone project in Tamil Nadu',
    ],
  },
  {
    slug: 'regen-powertech-wind-foundations-south-india',
    title: 'Regen Powertech Wind Installations',
    category: 'Wind Power Foundations',
    date: 'Jul 21, 2025',
    image: '/images/project-regen.webp',
    client: 'Regen Powertech Pvt. Ltd',
    location: 'South India',
    overview:
      'Balaji & Co executed foundation installations for a large fleet of Regen wind turbines across South India, covering varied terrain and soil conditions.',
    scope: [
      'Construction of 168 WTG foundations',
      'Turbine rating: 1.5 MW per unit',
      'Excavation, reinforcement, concreting, and curing',
      'Site logistics and execution planning',
    ],
    highlights: [
      'Large-volume execution across two states',
      'Standardized quality across all sites',
      'Efficient material and manpower deployment',
      'Smooth coordination across multiple locations',
    ],
  },
  {
    slug: 'gamesa-wind-projects-karnataka',
    title: 'Gamesa Wind Projects – Karnataka',
    category: 'Wind Power Foundations',
    date: 'Jul 3, 2025',
    image: '/images/project-gamesa.webp',
    client: 'Gamesa Wind Turbines Pvt. Ltd',
    location: 'Karnataka',
    overview:
      'This project involved complex foundation execution for multiple Gamesa turbine configurations across Karnataka, including eight-wall foundation designs.',
    scope: [
      'Construction of 30 units of 2.0 MW WTGs',
      'Execution of 71 eight-wall foundations',
      'Excavation, reinforcement, shuttering, and concreting',
      'Access roads and turbine movement pathways',
    ],
    highlights: [
      'Total execution of 101 WTG foundations',
      'Handled advanced foundation geometries',
      'Delivered across multiple locations',
      'Strong compliance with OEM specifications',
    ],
  },
  {
    slug: 'renew-power-wind-projects-karnataka',
    title: 'ReNew Power Wind Developments',
    category: 'Wind Power Foundations',
    date: 'Jun 23, 2025',
    image: '/images/H2IlCMMmRklSFMpvMe1avxyrc8.webp',
    client: 'ReNew Power Pvt. Ltd',
    location: 'Karnataka',
    overview:
      'Balaji & Co executed large-scale wind turbine foundation works for ReNew Power across Karnataka, delivering complex civil execution with reliable quality and on-time completion.',
    scope: [
      'WTG foundation construction',
      'Crane pad and access road development',
      'Electrical infrastructure support',
      'Site logistics and coordination',
    ],
    highlights: [
      'Delivered across multiple wind farm sites',
      'Strict compliance with OEM requirements',
      'Zero safety incidents throughout execution',
      'On-time project completion',
    ],
  },
  {
    slug: 'suzlon-wind-projects-tamil-nadu',
    title: 'Suzlon Wind Farm – Tamil Nadu',
    category: 'Wind Power Foundations',
    date: 'Mar 10, 2025',
    image: '/images/intro-foundations.jpg',
    client: 'Suzlon Energy Ltd',
    location: 'Tirunelveli, Tamil Nadu',
    overview:
      'Balaji & Co executed civil foundation works for Suzlon S111 wind turbines across Tirunelveli district, delivering high-quality construction under challenging terrain conditions.',
    scope: [
      'Construction of 45 WTG foundations',
      'Turbine rating: 2.1 MW per unit',
      'Excavation, reinforcement, and concreting',
      'Internal roads and crane pad development',
    ],
    highlights: [
      'Completed ahead of schedule',
      'Complex terrain management',
      'Zero safety incidents',
      'Strong OEM compliance throughout',
    ],
  },
  {
    slug: 'adani-solar-epc-rajasthan',
    title: 'Adani Solar EPC – Rajasthan',
    category: 'Solar EPC – Turnkey',
    date: 'Jan 18, 2025',
    image: '/images/intro-solar.jpg',
    client: 'Adani Green Energy Ltd',
    location: 'Jodhpur, Rajasthan',
    overview:
      'End-to-end solar EPC execution for a 50 MW ground-mounted solar plant in Rajasthan, covering civil, structural, electrical, and commissioning works.',
    scope: [
      'MMS structure installation for 50 MW capacity',
      'DC and AC cabling works',
      'Inverter and transformer installation',
      'Grid connectivity and commissioning',
    ],
    highlights: [
      '50 MW capacity successfully commissioned',
      'Completed within budget and timeline',
      'Full turnkey delivery',
      'Meets international quality benchmarks',
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
