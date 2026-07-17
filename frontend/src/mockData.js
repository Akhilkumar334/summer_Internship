export const mockAppliedJobs = [
  {
    id: '1',
    title: 'Frontend Engineer',
    company: 'TechCorp',
    logo: 'T',
    appliedDate: 'Oct 12, 2023',
    status: 'Interviewed',
    timeline: [
      { step: 'Applied', date: 'Oct 12, 2023', completed: true },
      { step: 'Reviewed', date: 'Oct 14, 2023', completed: true },
      { step: 'Interviewed', date: 'Oct 18, 2023', completed: true },
      { step: 'Offered', date: null, completed: false }
    ],
    description: 'Looking for a strong React developer to join our core team.',
    location: 'Remote',
    salary: '₹12,00,000 - ₹14,00,000'
  },
  {
    id: '2',
    title: 'Product Designer',
    company: 'Designify',
    logo: 'D',
    appliedDate: 'Oct 15, 2023',
    status: 'Reviewed',
    timeline: [
      { step: 'Applied', date: 'Oct 15, 2023', completed: true },
      { step: 'Reviewed', date: 'Oct 17, 2023', completed: true },
      { step: 'Interviewed', date: null, completed: false },
      { step: 'Offered', date: null, completed: false }
    ],
    description: 'Seeking a creative product designer with a strong portfolio.',
    location: 'New York, NY',
    salary: '₹11,00,000 - ₹13,00,000'
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    company: 'StartupInc',
    logo: 'S',
    appliedDate: 'Oct 20, 2023',
    status: 'Applied',
    timeline: [
      { step: 'Applied', date: 'Oct 20, 2023', completed: true },
      { step: 'Reviewed', date: null, completed: false },
      { step: 'Interviewed', date: null, completed: false },
      { step: 'Offered', date: null, completed: false }
    ],
    description: 'Join our fast-paced startup building the future of work.',
    location: 'San Francisco, CA',
    salary: '₹13,00,000 - ₹16,00,000'
  }
];

export const mockJobListings = [
  {
    id: '101',
    title: 'Senior Frontend Developer',
    company: 'Innovate LLC',
    logo: 'I',
    location: 'Remote',
    salary: '₹14,00,000 - ₹16,00,000',
    matchPercentage: 94,
    tags: ['React', 'TypeScript', 'CSS'],
    posted: '2 days ago'
  },
  {
    id: '102',
    title: 'UI/UX Engineer',
    company: 'Creative Solutions',
    logo: 'C',
    location: 'Austin, TX',
    salary: '₹11,50,000 - ₹13,50,000',
    matchPercentage: 88,
    tags: ['Figma', 'React', 'Tailwind'],
    posted: '5 hours ago'
  },
  {
    id: '103',
    title: 'Web Developer',
    company: 'Global Tech',
    logo: 'G',
    location: 'Remote',
    salary: '₹9,00,000 - ₹11,00,000',
    matchPercentage: 75,
    tags: ['JavaScript', 'HTML', 'CSS'],
    posted: '1 week ago'
  }
];
