// src/data/mock.js

/**
 * This file serves as a centralized mock database for the application.
 * By exporting the data from here, we create a "single source of truth"
 * that can be imported into any component that needs it, ensuring consistency.
 */

// 1. ADD a currentUser object to simulate a logged-in user.
// We'll make this user the founder of one of the existing projects.
export const currentUser = {
  id: 'user-123',
  name: 'Alice Smith',
   location: 'Cape Town, WC',
  role: 'founder', // 'founder' or 'developer'
  bio: 'Creative entrepreneur with a passion for unique, handmade products. Looking for skilled developers to help build a beautiful online marketplace that empowers artisans.',
  skills: ['Product Management', 'UI/UX Design', 'Marketing'], // Skills for a founder
  location: 'Austin, TX',
  availability: 'Full-time',
  portfolioLink: 'https://alicesmith.design',
  lookingForProject: false, // Founders are typically not looking for projects
};


// 2. UPDATE the mockProjects array.
// The only change here is adding the `founderId` to link projects to users.
export const mockProjects = [
  { 
    id: '1', 
    founderId: 'user-456', // Belongs to a different user
    title: 'AI-Powered Fitness Coach App', 
    description: 'A mobile application that uses AI to create personalized workout plans and track progress, adapting to user performance and goals, providing a truly personalized fitness experience.', 
    skillsNeeded: ['React Native', 'Python', 'TensorFlow', 'AWS'], 
    compensation: 'Hybrid (Paid + Equity)', 
    location: 'San Francisco, CA',
    stage: 'Wireframe', 
    founder: 'Bob Johnson' 
  },
  { 
    id: '2', 
    founderId: 'user-789', // Belongs to a different user
    title: 'Decentralized Social Media Platform', 
    description: 'A new social media platform built on blockchain technology, emphasizing user data privacy and censorship-resistance. Users will have full control over their data.', 
    skillsNeeded: ['Solidity', 'Web3.js', 'React', 'IPFS'], 
    compensation: 'Equity-based', 
    location: 'Remote',
    stage: 'Prototype', 
    founder: 'Charlie Brown' 
  },
  { 
    id: '3', 
    founderId: 'user-123', // This project belongs to our currentUser (Alice Smith)
    title: 'E-commerce Platform for Artisanal Goods', 
    description: 'An online marketplace for artisans to sell their unique, handmade goods. The platform will focus on beautiful design and a great user experience to highlight the products.', 
    skillsNeeded: ['React', 'Node.js', 'MongoDB', 'Stripe API'], 
    compensation: 'Equity-based',
    location: 'Cape Town, WC', 
    stage: 'Concept', 
    founder: 'Alice Smith' 
  },
  { 
    id: '4', 
    founderId: 'user-000', // Belongs to a different user
    title: 'Smart Home Automation System', 
    description: 'Develop an intuitive smart home system that integrates various IoT devices into a single, easy-to-use interface, controllable via web and mobile apps.', 
    skillsNeeded: ['IoT', 'Python', 'Raspberry Pi', 'React'], 
    compensation: 'Paid Freelance', 
    location: 'New York, NY',
    stage: 'MVP Development', 
    founder: 'David Lee' 
  },
];


// 3. ADD a new mockInterests array to simulate project connections.
export const mockInterests = [
    {
      id: 'interest-1',
      senderId: 'user-123',
      receiverId: 'dev-abc',
      projectId: '3',
      status: 'approved',
      timestamp: '2023-11-15T11:00:00Z' // <-- MUST HAVE TIMESTAMP
  },
  {
      id: 'interest-2',
      senderId: 'dev-xyz',
      receiverId: 'user-123',
      projectId: '3',
      status: 'approved',
      timestamp: '2023-11-14T18:30:00Z' // <-- MUST HAVE TIMESTAMP
  },
  {
      id: 'interest-3',
      senderId: 'user-123',
      receiverId: 'dev-ghi',
      projectId: '2',
      status: 'pending',
      timestamp: '2023-11-16T09:15:00Z' // <-- MUST HAVE TIMESTAMP
  },
  {
      id: 'interest-4',
      senderId: 'dev-alpha',
      receiverId: 'user-123',
      projectId: '3',
      status: 'pending',
      timestamp: '2023-11-16T14:00:00Z' // <-- MUST HAVE TIMESTAMP
  }
];

export const mockConversations = [
    {
        id: 'convo-1',
        participants: ['user-123', 'dev-abc'],
        lastMessage: 'Sounds great, let\'s chat next week.',
        timestamp: '2023-10-27T14:30:00Z'
    },
    {
        id: 'convo-2',
        participants: ['user-123', 'dev-xyz'],
        lastMessage: 'Can you look over the new designs?',
        timestamp: '2023-10-26T18:00:00Z'
    }
];

// We'll also need a list of users for the InterestRequestCard
export const mockUsers = {
    'dev-alpha': { name: 'David Chen', role: 'developer', avatarUrl: null, location: 'New York, NY'},
    'user-123': { name: 'Alice Smith', role: 'founder', avatarUrl: '/avatars/alice.png', location: 'Cape Town, WC' }, // Example with an image
    'dev-abc': { name: 'Bobbie Draper', role: 'developer', avatarUrl: null,location: 'San Francisco, CA' },
    'dev-xyz': { name: 'Chrisjen Avasarala', role: 'developer', avatarUrl: '/avatars/chrisjen.png',location: 'Boston, MA' },
};

// ADD mockMessages. The keys correspond to conversation IDs.
export const mockMessages = {
  'convo-1': [
    { id: 'msg1', senderId: 'dev-abc', text: 'Hey Alice, I saw your project and I\'m very interested. My skills in Node.js and MongoDB would be a perfect fit.', timestamp: '2023-10-27T14:25:00Z' },
    { id: 'msg2', senderId: 'user-123', text: 'Thanks for reaching out! Your profile looks impressive. Do you have a portfolio I could look at?', timestamp: '2023-10-27T14:28:00Z' },
    { id: 'msg3', senderId: 'dev-abc', text: 'Absolutely, you can find it at my github.com/dev-abc.', timestamp: '2023-10-27T14:29:00Z' },
    { id: 'msg4', senderId: 'user-123', text: 'Sounds great, let\'s chat next week.', timestamp: '2023-10-27T14:30:00Z' },
  ],
  'convo-2': [
    { id: 'msg5', senderId: 'user-123', text: 'Hey! Ready to get started on the design integration?', timestamp: '2023-10-26T17:58:00Z' },
    { id: 'msg6', senderId: 'dev-xyz', text: 'Yep, just pulling up the Figma files now.', timestamp: '2023-10-26T17:59:00Z' },
    { id: 'msg7', senderId: 'user-123', text: 'Can you look over the new designs?', timestamp: '2023-10-26T18:00:00Z' },
  ]
};

export const allUsers = [
  { 
    id: 'user-123', 
    name: 'Alice Smith', 
    role: 'founder', 
    bio: 'Creative entrepreneur with a passion for unique, handmade products...', 
    skills: ['Product Management', 'UI/UX Design', 'Marketing'],
    location: 'Austin, TX',
    availability: 'Full-time',
    lookingForProject: false,
    avatarUrl: '/avatars/alice.png' 
  },
  { 
    id: 'dev-alpha', 
    name: 'David Chen', 
    role: 'developer', 
    bio: 'Full-stack developer specializing in scalable backend systems and cloud infrastructure.', 
    skills: ['Node.js', 'Python', 'Go', 'AWS', 'Kubernetes'],
    location: 'New York, NY',
    availability: '20-30 hours/week',
    lookingForProject: true,
    avatarUrl: null
  },
  { 
    id: 'dev-abc', 
    name: 'Bobbie Draper', 
    role: 'developer', 
    bio: 'Frontend developer who loves building beautiful and intuitive user interfaces with React.', 
    skills: ['React', 'TypeScript', 'Next.js', 'CSS Modules', 'Figma'],
    location: 'San Francisco, CA',
    availability: 'Full-time',
    lookingForProject: true,
    avatarUrl: null
  },
  { 
    id: 'dev-xyz', 
    name: 'Chrisjen Avasarala', 
    role: 'developer', 
    bio: 'Experienced data scientist and machine learning engineer.', 
    skills: ['Python', 'TensorFlow', 'PyTorch', 'AI/ML'],
    location: 'Boston, MA',
    availability: 'Part-time',
    lookingForProject: false,
    avatarUrl: '/avatars/chrisjen.png'
  },
];

export const mockReviews = [
  {
    id: 'rev1',
    developerId: 'dev-abc', // Bobbie Draper
    founderId: 'user-123', // Alice Smith
    rating: 5,
    comment: 'Bobbie was an exceptional developer. Her expertise in React and her attention to detail were instrumental in bringing our project to life ahead of schedule. Highly recommended!',
    timestamp: '2023-11-10T15:00:00Z'
  },
  {
    id: 'rev2',
    developerId: 'dev-alpha', // David Chen
    founderId: 'user-789', // Some other founder
    rating: 4,
    comment: 'David has a deep understanding of backend systems. He helped us scale our infrastructure effectively. Communication could be slightly more proactive, but his technical skills are top-notch.',
    timestamp: '2023-10-05T12:00:00Z'
  },
  {
    id: 'rev3',
    developerId: 'dev-abc', // Another review for Bobbie
    founderId: 'user-000', // David Lee
    rating: 5,
    comment: 'A true professional. She contributed great ideas and the final product was flawless.',
    timestamp: '2023-09-20T10:30:00Z'
  }
];