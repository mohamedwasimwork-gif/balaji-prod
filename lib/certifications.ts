export interface Certification {
  name: string;
  description: string;
  image: string;
}

export const CERTIFICATIONS: Certification[] = [
  {
    name: 'ISO 9001:2015',
    description:
      'This standard pertains to our Quality Management System, ensuring excellence in our processes.',
    image: '/images/cert-iso-9001.jpg',
  },
  {
    name: 'ISO 14001:2015',
    description:
      'This Environmental Management System standard reinforces our commitment to sustainable practices.',
    image: '/images/cert-iso-14001.jpg',
  },
  {
    name: 'OHSAS 18001:2007',
    description:
      'This Safety Management System standard underscores our dedication to maintaining a safe work environment.',
    image: '/images/cert-iso-ohsas.jpg',
  },
];
