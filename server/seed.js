const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/User');

dotenv.config();

const sampleUsers = [
  {
    name: 'Priya Patel',
    email: 'priya@example.com',
    password: 'password123',
    bio: 'Passionate about classical dance (Kathak) and contemporary choreography. Looking for creative dancers & musicians to collaborate in Mumbai.',
    passions: ['dance', 'kathak', 'music', 'performing arts'],
    location: { city: 'Mumbai', state: 'Maharashtra' },
  },
  {
    name: 'Rohan Deshmukh',
    email: 'rohan@example.com',
    password: 'password123',
    bio: 'Existentialist and stoic philosophy enthusiast. Love weekend coffee discussions on ethics, consciousness, and metaphysics.',
    passions: ['philosophy', 'ethics', 'reading', 'books'],
    location: { city: 'Mumbai', state: 'Maharashtra' },
  },
  {
    name: 'Ananya Iyer',
    email: 'ananya@example.com',
    password: 'password123',
    bio: 'Astrophysics nerd & telescope stargazer. Spending clear night skies hunting planets and deep space nebulas.',
    passions: ['science', 'astronomy', 'physics', 'stargazing'],
    location: { city: 'Bengaluru', state: 'Karnataka' },
  },
  {
    name: 'Kabir Mehta',
    email: 'kabir@example.com',
    password: 'password123',
    bio: 'Indie musician, songwriter & acoustic guitarist. Searching for vocalists and percussionists in Indiranagar/Koramangala.',
    passions: ['music', 'guitar', 'songwriting', 'indie rock'],
    location: { city: 'Bengaluru', state: 'Karnataka' },
  },
  {
    name: 'Diya Sen',
    email: 'diya@example.com',
    password: 'password123',
    bio: 'AI researcher and theoretical neuroscience geek. Keen to debate machine consciousness and cognitive models.',
    passions: ['science', 'neuroscience', 'philosophy', 'ai'],
    location: { city: 'Bengaluru', state: 'Karnataka' },
  },
  {
    name: 'Vikram Rajput',
    email: 'vikram@example.com',
    password: 'password123',
    bio: 'Street dance, hip-hop & breakdancing freestyle artist. Let us battle, practice cyphers, and groove!',
    passions: ['dance', 'hip hop', 'fitness', 'music'],
    location: { city: 'Delhi', state: 'Delhi' },
  },
  {
    name: 'Sanya Verma',
    email: 'sanya@example.com',
    password: 'password123',
    bio: 'Oil painter, ceramic potter, and lover of abstract visual arts. Hosting weekend art jams and gallery walks.',
    passions: ['art', 'painting', 'pottery', 'design'],
    location: { city: 'Pune', state: 'Maharashtra' },
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    for (const u of sampleUsers) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create(u);
        console.log(`Created user: ${u.name}`);
      } else {
        console.log(`User already exists: ${u.name}`);
      }
    }

    console.log('Seeding finished successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();

