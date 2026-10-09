export interface User {
  id: string;
  username: string;
  email?: string;
  passwordHash?: string;
  avatar?: string;
  name?: string;
  bio?: string;
  role?: 'admin' | 'user';
  isPrivate?: boolean;
  twoFactorEnabled?: boolean;
  quietMode?: boolean;
}

export interface Post {
  id: string;
  username: string;
  title?: string;
  content: string;
  visibility: string;
  image?: string;
  createdAt: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

export interface Capsule {
  id: string;
  username: string;
  caption: string;
  message: string;
  scheduleDate: string;
  visibility: string;
  imageUrl?: string;
  createdAt: string;
  isUnlocked?: boolean;
}

// Hardcoded Admin User
export const adminUser: User = {
  id: 'user-admin-root',
  username: 'admin',
  email: 'admin@timecapsule.com',
  name: 'System Administrator',
  avatar: '/profile-1.jpg',
  bio: 'Time Capsule 3.0 Platform Super Administrator',
  role: 'admin',
  isPrivate: false,
  twoFactorEnabled: true,
  quietMode: false,
};

// Hardcoded Demo User
export const demoUser: User = {
  id: 'user-demo-1',
  username: 'demo',
  email: 'demo@timecapsule.com',
  name: 'Charana Pramoad',
  avatar: '/profile-8.jpg',
  bio: 'Preserving precious memories and digital time capsules ⏳✨',
  role: 'user',
  isPrivate: false,
  twoFactorEnabled: false,
  quietMode: false,
};

export const memoryStore = {
  users: [
    {
      ...adminUser,
      // admin123 bcrypt hash
      passwordHash: '$2a$10$6Rsm5B7H6YnB5s6rY.k0z.tA6cEvH5sR2y4z.56s7t8u9v0w1x2y3',
    },
    {
      ...demoUser,
      // demo123 bcrypt hash
      passwordHash: '$2a$10$tMh39u53aR458Z08sFbvz.X/d.3U5m.H8bovjQ1qSgJ6h2r.Yl9/S',
    },
  ] as User[],

  posts: [
    {
      id: 'post-1',
      username: 'Lana Rose',
      title: 'A lovely sunny weekend',
      content: 'Enjoying the sunset at the beach with friends! Memories to cherish forever. 🌅🌊',
      visibility: 'public',
      image: '/feed-1.jpg',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      likes: 124,
      comments: 18,
    },
    {
      id: 'post-2',
      username: 'Charana Pramoad',
      title: 'Time Capsule 3.0 Launch',
      content: 'Welcome to Time Capsule 3.0! Storing digital memories, scheduling future revelations, and keeping moments safe forever. ⏳✨',
      visibility: 'public',
      image: '/feed-2.jpg',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      likes: 342,
      comments: 45,
    },
    {
      id: 'post-3',
      username: 'Ernest Achiever',
      title: 'Coding the Future',
      content: 'Just sealed a capsule to be opened when our startup turns 5 years old. What a journey so far! 💻🚀',
      visibility: 'friends',
      image: '/feed-3.jpg',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
      likes: 89,
      comments: 12,
    },
  ] as Post[],

  capsules: [
    {
      id: 'capsule-1',
      username: 'demo',
      caption: 'Message to my Future Self in 1 Year',
      message: 'Remember where you started today, keep coding, and never stop building awesome things!',
      scheduleDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(),
      visibility: 'private',
      imageUrl: '/feed-3.jpg',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'capsule-2',
      username: 'demo',
      caption: 'Next Milestone Checkpoint',
      message: 'Did you launch Time Capsule 3.0 to the world? Time to celebrate!',
      scheduleDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      visibility: 'friends',
      imageUrl: '/feed-4.jpg',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'capsule-3',
      username: 'admin',
      caption: 'System Genesis Capsule (Admin)',
      message: 'Time Capsule 3.0 platform deployed with administrative controls and verified database vaulting.',
      scheduleDate: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // Already unlocked!
      visibility: 'public',
      imageUrl: '/feed-5.jpg',
      createdAt: new Date().toISOString(),
      isUnlocked: true,
    },
  ] as Capsule[],
};
