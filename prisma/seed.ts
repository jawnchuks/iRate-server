import {
  PrismaClient,
  UserRole,
  Gender,
  SubscriptionPlanType,
  SubscriptionStatus,
  SubscriptionTier,
  User,
  UserPhoto,
} from '@prisma/client';

const prisma = new PrismaClient();

// Realistic user data
const userData = [
  {
    email: 'chinedu.okafor@gmail.com',
    firstName: 'Chinedu',
    lastName: 'Okafor',
    dob: new Date('1992-05-14'),
    gender: Gender.MALE,
    selfDescription: ['ambitious', 'friendly', 'resourceful', 'optimistic'],
    valuesInOthers: ['honesty', 'hard work', 'humor', 'kindness'],
    interests: ['football', 'tech', 'music', 'travel'],
    bio: 'Software engineer passionate about building solutions for Africa. Loves football and Afrobeats.',
    username: 'chinedu_dev',
    nationality: 'Nigerian',
    religion: 'Christian',
    ethnicity: 'Igbo',
    zodiacSign: 'Taurus',
    relationshipStatus: 'Single',
    school: 'University of Lagos',
    work: 'Backend Developer at FinTech NG',
    biggestWin: 'Built a payment app used by 100k+ people',
    mission: 'To empower African youth through technology',
    energyEmoji: '💻',
    passions: ['coding', 'mentoring', 'community service'],
    profilePicUrl:
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=800&h=800&facepad=2',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=800&h=800&facepad=2',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=800&h=800&facepad=2',
    ],
  },
  {
    email: 'amina.bello@yahoo.com',
    firstName: 'Amina',
    lastName: 'Bello',
    dob: new Date('1995-08-22'),
    gender: Gender.FEMALE,
    selfDescription: ['driven', 'caring', 'curious', 'resilient'],
    valuesInOthers: ['empathy', 'integrity', 'ambition', 'patience'],
    interests: ['medicine', 'reading', 'fashion', 'volunteering'],
    bio: "Medical doctor and advocate for women's health. Loves fashion and helping others.",
    username: 'amina_md',
    nationality: 'Nigerian',
    religion: 'Muslim',
    ethnicity: 'Hausa',
    zodiacSign: 'Leo',
    relationshipStatus: 'Single',
    school: 'Ahmadu Bello University',
    work: 'Medical Doctor at Lagos University Teaching Hospital',
    biggestWin: 'Organized a free health outreach for 500+ women',
    mission: 'To improve healthcare access for women in Nigeria',
    energyEmoji: '🩺',
    passions: ['healthcare', 'fashion', 'community outreach'],
    profilePicUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=800&h=800&facepad=2',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=800&h=800&facepad=2',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=800&h=800&facepad=2',
    ],
  },
  {
    email: 'tunde.adesina@outlook.com',
    firstName: 'Tunde',
    lastName: 'Adesina',
    dob: new Date('1988-11-10'),
    gender: Gender.MALE,
    selfDescription: ['creative', 'funny', 'adventurous', 'loyal'],
    valuesInOthers: ['creativity', 'loyalty', 'humor', 'courage'],
    interests: ['music', 'photography', 'travel', 'basketball'],
    bio: 'Music producer and photographer. Always seeking new adventures and good vibes.',
    username: 'tunde_beats',
    nationality: 'Nigerian',
    religion: 'Christian',
    ethnicity: 'Yoruba',
    zodiacSign: 'Scorpio',
    relationshipStatus: 'In a relationship',
    school: 'Obafemi Awolowo University',
    work: 'Music Producer at Lagos Studios',
    biggestWin: 'Produced a hit song for a top Nigerian artist',
    mission: 'To inspire through music and art',
    energyEmoji: '🎶',
    passions: ['music', 'photography', 'travel'],
    profilePicUrl:
      'https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=facearea&w=800&h=800&facepad=2',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=800&h=800&facepad=2',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=800&h=800&facepad=2',
    ],
  },
  {
    email: 'ifeoma.nwosu@gmail.com',
    firstName: 'Ifeoma',
    lastName: 'Nwosu',
    dob: new Date('1993-03-18'),
    gender: Gender.FEMALE,
    selfDescription: ['thoughtful', 'ambitious', 'cheerful', 'supportive'],
    valuesInOthers: ['kindness', 'ambition', 'cheerfulness', 'support'],
    interests: ['law', 'debate', 'travel', 'cooking'],
    bio: 'Lawyer and food enthusiast. Loves to travel and debate on social issues.',
    username: 'ifeoma_law',
    nationality: 'Nigerian',
    religion: 'Christian',
    ethnicity: 'Igbo',
    zodiacSign: 'Pisces',
    relationshipStatus: 'Single',
    school: 'University of Nigeria, Nsukka',
    work: 'Legal Associate at Abuja Law Firm',
    biggestWin: 'Won a national moot court competition',
    mission: 'To fight for justice and equality',
    energyEmoji: '⚖️',
    passions: ['law', 'travel', 'cooking'],
    profilePicUrl:
      'https://images.unsplash.com/photo-1519340333755-c1aa5571fd46?auto=format&fit=facearea&w=800&h=800&facepad=2',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=facearea&w=800&h=800&facepad=2',
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=800&h=800&facepad=2',
    ],
  },
  {
    email: 'babatunde.ogundipe@gmail.com',
    firstName: 'Babatunde',
    lastName: 'Ogundipe',
    dob: new Date('1990-07-25'),
    gender: Gender.MALE,
    selfDescription: ['analytical', 'calm', 'dedicated', 'curious'],
    valuesInOthers: ['dedication', 'curiosity', 'calmness', 'integrity'],
    interests: ['engineering', 'reading', 'football', 'chess'],
    bio: 'Mechanical engineer and chess lover. Enjoys solving problems and reading.',
    username: 'baba_engineer',
    nationality: 'Nigerian',
    religion: 'Christian',
    ethnicity: 'Yoruba',
    zodiacSign: 'Leo',
    relationshipStatus: 'Married',
    school: 'University of Ibadan',
    work: 'Mechanical Engineer at Dangote Group',
    biggestWin: 'Designed a new energy-efficient machine',
    mission: 'To innovate for a better Nigeria',
    energyEmoji: '🔧',
    passions: ['engineering', 'chess', 'reading'],
    profilePicUrl:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=800&h=800&facepad=2',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1519340333755-c1aa5571fd46?auto=format&fit=facearea&w=800&h=800&facepad=2',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=800&h=800&facepad=2',
    ],
  },
  {
    email: 'zainab.suleiman@gmail.com',
    firstName: 'Zainab',
    lastName: 'Suleiman',
    dob: new Date('1996-12-02'),
    gender: Gender.FEMALE,
    selfDescription: ['outgoing', 'creative', 'supportive', 'fun-loving'],
    valuesInOthers: ['creativity', 'support', 'fun', 'loyalty'],
    interests: ['fashion', 'blogging', 'travel', 'dancing'],
    bio: 'Fashion blogger and dancer. Loves to travel and meet new people.',
    username: 'zainab_fashion',
    nationality: 'Nigerian',
    religion: 'Muslim',
    ethnicity: 'Hausa',
    zodiacSign: 'Sagittarius',
    relationshipStatus: 'Single',
    school: 'Bayero University Kano',
    work: 'Fashion Blogger',
    biggestWin: 'Featured in a top Nigerian fashion magazine',
    mission: 'To inspire confidence through fashion',
    energyEmoji: '💃',
    passions: ['fashion', 'dancing', 'blogging'],
    profilePicUrl:
      'https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=facearea&w=800&h=800&facepad=2',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=800&h=800&facepad=2',
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=800&h=800&facepad=2',
    ],
  },
  {
    email: 'uchechi.nwankwo@gmail.com',
    firstName: 'Uchechi',
    lastName: 'Nwankwo',
    dob: new Date('1994-09-15'),
    gender: Gender.FEMALE,
    selfDescription: ['innovative', 'diligent', 'friendly', 'visionary'],
    valuesInOthers: ['innovation', 'diligence', 'vision', 'friendship'],
    interests: ['entrepreneurship', 'reading', 'travel', 'public speaking'],
    bio: 'Entrepreneur and motivational speaker. Passionate about empowering women in business.',
    username: 'uchechi_entrepreneur',
    nationality: 'Nigerian',
    religion: 'Christian',
    ethnicity: 'Igbo',
    zodiacSign: 'Virgo',
    relationshipStatus: 'Single',
    school: 'Covenant University',
    work: 'Founder at Inspire Women Africa',
    biggestWin: 'Launched a startup that supports 200+ women',
    mission: 'To inspire and empower women entrepreneurs',
    energyEmoji: '🚀',
    passions: ['entrepreneurship', 'public speaking', 'mentoring'],
    profilePicUrl:
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=800&h=800&facepad=2',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=800&h=800&facepad=2',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=800&h=800&facepad=2',
    ],
  },
  {
    email: 'segun.adebayo@gmail.com',
    firstName: 'Segun',
    lastName: 'Adebayo',
    dob: new Date('1987-04-10'),
    gender: Gender.MALE,
    selfDescription: ['strategic', 'calm', 'hardworking', 'supportive'],
    valuesInOthers: ['strategy', 'calmness', 'hard work', 'support'],
    interests: ['business', 'football', 'mentoring', 'reading'],
    bio: 'Business consultant and football enthusiast. Loves mentoring young professionals.',
    username: 'segun_biz',
    nationality: 'Nigerian',
    religion: 'Christian',
    ethnicity: 'Yoruba',
    zodiacSign: 'Aries',
    relationshipStatus: 'Married',
    school: 'Lagos Business School',
    work: 'Business Consultant at KPMG',
    biggestWin: 'Helped 50+ startups grow their business',
    mission: 'To support the next generation of business leaders',
    energyEmoji: '📈',
    passions: ['business', 'mentoring', 'football'],
    profilePicUrl:
      'https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=facearea&w=800&h=800&facepad=2',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=800&h=800&facepad=2',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=800&h=800&facepad=2',
    ],
  },
  {
    email: 'fatima.garba@gmail.com',
    firstName: 'Fatima',
    lastName: 'Garba',
    dob: new Date('1998-06-21'),
    gender: Gender.FEMALE,
    selfDescription: ['compassionate', 'curious', 'energetic', 'optimistic'],
    valuesInOthers: ['compassion', 'curiosity', 'energy', 'optimism'],
    interests: ['science', 'volunteering', 'travel', 'cooking'],
    bio: 'Science teacher and volunteer. Loves to travel and cook new dishes.',
    username: 'fatima_science',
    nationality: 'Nigerian',
    religion: 'Muslim',
    ethnicity: 'Hausa',
    zodiacSign: 'Gemini',
    relationshipStatus: 'Single',
    school: 'University of Maiduguri',
    work: 'Science Teacher at Kano Secondary School',
    biggestWin: 'Organized a science fair for 300+ students',
    mission: 'To make science fun and accessible',
    energyEmoji: '🔬',
    passions: ['science', 'volunteering', 'cooking'],
    profilePicUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=800&h=800&facepad=2',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=800&h=800&facepad=2',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=800&h=800&facepad=2',
    ],
  },
  {
    email: 'emeka.eze@gmail.com',
    firstName: 'Emeka',
    lastName: 'Eze',
    dob: new Date('1991-02-28'),
    gender: Gender.MALE,
    selfDescription: ['innovative', 'friendly', 'analytical', 'adventurous'],
    valuesInOthers: ['innovation', 'friendship', 'analysis', 'adventure'],
    interests: ['engineering', 'tech', 'travel', 'music'],
    bio: 'Civil engineer and tech enthusiast. Loves music and exploring new places.',
    username: 'emeka_engineer',
    nationality: 'Nigerian',
    religion: 'Christian',
    ethnicity: 'Igbo',
    zodiacSign: 'Pisces',
    relationshipStatus: 'Single',
    school: 'Federal University of Technology Owerri',
    work: 'Civil Engineer at Julius Berger',
    biggestWin: 'Led a bridge construction project',
    mission: 'To build infrastructure for a better Nigeria',
    energyEmoji: '🏗️',
    passions: ['engineering', 'tech', 'music'],
    profilePicUrl:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=800&h=800&facepad=2',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1519340333755-c1aa5571fd46?auto=format&fit=facearea&w=800&h=800&facepad=2',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=800&h=800&facepad=2',
    ],
  },
  {
    email: 'blessing.udo@gmail.com',
    firstName: 'Blessing',
    lastName: 'Udo',
    dob: new Date('1997-11-05'),
    gender: Gender.FEMALE,
    selfDescription: ['cheerful', 'supportive', 'creative', 'ambitious'],
    valuesInOthers: ['cheerfulness', 'support', 'creativity', 'ambition'],
    interests: ['art', 'fashion', 'travel', 'mentoring'],
    bio: 'Artist and mentor. Loves to inspire others through creativity and travel.',
    username: 'blessing_artist',
    nationality: 'Nigerian',
    religion: 'Christian',
    ethnicity: 'Ibibio',
    zodiacSign: 'Scorpio',
    relationshipStatus: 'Single',
    school: 'University of Uyo',
    work: 'Art Teacher at Akwa Ibom Art School',
    biggestWin: 'Held a solo art exhibition',
    mission: 'To inspire creativity in young minds',
    energyEmoji: '🎨',
    passions: ['art', 'mentoring', 'travel'],
    profilePicUrl:
      'https://images.unsplash.com/photo-1519340333755-c1aa5571fd46?auto=format&fit=facearea&w=800&h=800&facepad=2',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=facearea&w=800&h=800&facepad=2',
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=800&h=800&facepad=2',
    ],
  },
  {
    email: 'abdul.kareem@gmail.com',
    firstName: 'Abdul',
    lastName: 'Kareem',
    dob: new Date('1993-08-19'),
    gender: Gender.MALE,
    selfDescription: ['disciplined', 'curious', 'friendly', 'supportive'],
    valuesInOthers: ['discipline', 'curiosity', 'friendship', 'support'],
    interests: ['finance', 'reading', 'football', 'volunteering'],
    bio: 'Accountant and volunteer. Loves football and supporting community projects.',
    username: 'abdul_accountant',
    nationality: 'Nigerian',
    religion: 'Muslim',
    ethnicity: 'Yoruba',
    zodiacSign: 'Leo',
    relationshipStatus: 'Single',
    school: 'University of Ilorin',
    work: 'Accountant at GTBank',
    biggestWin: 'Managed a major audit project',
    mission: 'To promote financial literacy',
    energyEmoji: '💼',
    passions: ['finance', 'volunteering', 'football'],
    profilePicUrl:
      'https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=facearea&w=800&h=800&facepad=2',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=800&h=800&facepad=2',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=800&h=800&facepad=2',
    ],
  },
  {
    email: 'ngozi.obi@gmail.com',
    firstName: 'Ngozi',
    lastName: 'Obi',
    dob: new Date('1992-12-30'),
    gender: Gender.FEMALE,
    selfDescription: ['thoughtful', 'creative', 'supportive', 'ambitious'],
    valuesInOthers: ['thoughtfulness', 'creativity', 'support', 'ambition'],
    interests: ['writing', 'fashion', 'mentoring', 'travel'],
    bio: 'Writer and mentor. Passionate about helping young women find their voice.',
    username: 'ngozi_writer',
    nationality: 'Nigerian',
    religion: 'Christian',
    ethnicity: 'Igbo',
    zodiacSign: 'Capricorn',
    relationshipStatus: 'Single',
    school: 'University of Port Harcourt',
    work: 'Writer at Naija Stories',
    biggestWin: 'Published a bestselling novel',
    mission: 'To inspire women through storytelling',
    energyEmoji: '✍️',
    passions: ['writing', 'mentoring', 'fashion'],
    profilePicUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=800&h=800&facepad=2',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=800&h=800&facepad=2',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=800&h=800&facepad=2',
    ],
  },
  {
    email: 'olumide.akinola@gmail.com',
    firstName: 'Olumide',
    lastName: 'Akinola',
    dob: new Date('1989-03-12'),
    gender: Gender.MALE,
    selfDescription: ['innovative', 'strategic', 'friendly', 'curious'],
    valuesInOthers: ['innovation', 'strategy', 'friendship', 'curiosity'],
    interests: ['tech', 'business', 'reading', 'travel'],
    bio: 'Tech entrepreneur and business strategist. Loves reading and exploring new ideas.',
    username: 'olumide_tech',
    nationality: 'Nigerian',
    religion: 'Christian',
    ethnicity: 'Yoruba',
    zodiacSign: 'Pisces',
    relationshipStatus: 'Married',
    school: 'Obafemi Awolowo University',
    work: 'CEO at Lagos Tech Hub',
    biggestWin: 'Founded a successful tech startup',
    mission: 'To drive innovation in Africa',
    energyEmoji: '🚀',
    passions: ['tech', 'business', 'reading'],
    profilePicUrl:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=800&h=800&facepad=2',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1519340333755-c1aa5571fd46?auto=format&fit=facearea&w=800&h=800&facepad=2',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=800&h=800&facepad=2',
    ],
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean up existing data
  console.log('🧹 Cleaning up existing data...');
  await prisma.userPhoto.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
  await prisma.user.deleteMany();

  // Create subscription plans
  console.log('💳 Creating subscription plans...');
  const premiumPlan = await prisma.subscriptionPlan.create({
    data: {
      name: 'Premium Plan',
      description:
        'Access to all premium features including unlimited messages and priority support',
      price: 19.99,
      type: SubscriptionPlanType.MONTHLY,
      messagesPerMonth: -1, // unlimited
      isActive: true,
    },
  });

  const standardPlan = await prisma.subscriptionPlan.create({
    data: {
      name: 'Standard Plan',
      description: 'Basic features with limited messages per month',
      price: 9.99,
      type: SubscriptionPlanType.MONTHLY,
      messagesPerMonth: 500,
      isActive: true,
    },
  });

  const annualPlan = await prisma.subscriptionPlan.create({
    data: {
      name: 'Annual Premium',
      description: 'Premium features with annual billing discount',
      price: 199.99,
      type: SubscriptionPlanType.ANNUAL,
      messagesPerMonth: -1, // unlimited
      isActive: true,
    },
  });

  // Create users
  console.log('👥 Creating users...');
  const createdUsers: (User & { profilePhotos: UserPhoto[] })[] = [];

  for (let i = 0; i < userData.length; i++) {
    const user = userData[i];
    console.log(`   Creating user: ${user.firstName} ${user.lastName}`);

    // Calculate profile completion percentage
    let completionScore = 0;
    const fields = [
      user.firstName,
      user.lastName,
      user.dob,
      user.gender,
      user.bio,
      user.interests?.length > 0,
      user.selfDescription?.length > 0,
      user.valuesInOthers?.length > 0,
      user.nationality,
      user.work,
    ];
    completionScore = Math.round((fields.filter(Boolean).length / fields.length) * 100);

    const createdUser = await prisma.user.create({
      data: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        dob: user.dob,
        gender: user.gender,
        bio: user.bio,
        selfDescription: user.selfDescription,
        valuesInOthers: user.valuesInOthers,
        interests: user.interests,
        nationality: user.nationality,
        religion: user.religion,
        ethnicity: user.ethnicity,
        zodiacSign: user.zodiacSign,
        relationshipStatus: user.relationshipStatus,
        school: user.school,
        work: user.work,
        biggestWin: user.biggestWin,
        mission: user.mission,
        energyEmoji: user.energyEmoji,
        passions: user.passions,
        roles: [UserRole.USER],
        onboardingComplete: true,
        emailVerified: true,
        profileCompletionPercentage: completionScore,
        isVerified: Math.random() > 0.3, // 70% are verified
        verificationScore: Math.floor(Math.random() * 50) + 50, // 50-100
        trustScore: Math.floor(Math.random() * 30) + 70, // 70-100
        riskLevel: Math.floor(Math.random() * 20), // 0-20
        averageRating: Math.random() * 2 + 3, // 3.0-5.0
        totalRatings: Math.floor(Math.random() * 50),
        coins: Math.floor(Math.random() * 500) + 100, // 100-600 coins
        location: {
          city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'][
            Math.floor(Math.random() * 6)
          ],
          country: user.nationality || 'United States',
          coordinates: {
            lat: (Math.random() - 0.5) * 180,
            lng: (Math.random() - 0.5) * 360,
          },
        },
        notificationPreferences: {
          email: Math.random() > 0.3,
          push: Math.random() > 0.2,
          sms: Math.random() > 0.7,
          newMessages: true,
          chatRequests: true,
          marketing: Math.random() > 0.6,
        },
        preferences: {
          language: ['en', 'es', 'fr', 'de', 'zh'][Math.floor(Math.random() * 5)],
          timezone: ['UTC', 'EST', 'PST', 'GMT+1', 'GMT+8'][Math.floor(Math.random() * 5)],
          notifications: {
            email: Math.random() > 0.3,
            push: Math.random() > 0.2,
            sms: Math.random() > 0.7,
          },
        },
        privacy: {
          isProfilePublic: Math.random() > 0.2,
          areRatingsPublic: Math.random() > 0.4,
          isLocationPublic: Math.random() > 0.6,
          isContactPublic: Math.random() > 0.8,
        },
        visibility: {
          isVisibleInSearch: Math.random() > 0.1,
          isVisibleToNearby: Math.random() > 0.3,
          isVisibleToRecommended: Math.random() > 0.2,
        },
        settings: {
          theme: ['light', 'dark', 'system'][Math.floor(Math.random() * 3)],
          emailNotifications: Math.random() > 0.3,
          pushNotifications: Math.random() > 0.2,
          smsNotifications: Math.random() > 0.7,
        },
        profilePhotos: {
          create: [
            {
              url: user.profilePicUrl,
              isProfilePicture: true,
            },
            ...user.additionalPhotos.map((url) => ({
              url,
              isProfilePicture: false,
            })),
          ],
        },
      },
      include: {
        profilePhotos: true,
      },
    });

    // Set profile picture ID
    const profilePic = createdUser.profilePhotos.find((p) => p.isProfilePicture);
    if (profilePic) {
      await prisma.user.update({
        where: { id: createdUser.id },
        data: { profilePictureId: profilePic.id },
      });
    }

    createdUsers.push(createdUser);
  }

  // Create some subscriptions (30% of users have subscriptions)
  console.log('💰 Creating subscriptions...');
  const subscriberCount = Math.floor(createdUsers.length * 0.3);
  const shuffledUsers = [...createdUsers].sort(() => 0.5 - Math.random());

  for (let i = 0; i < subscriberCount; i++) {
    const user = shuffledUsers[i];
    const plans = [premiumPlan, standardPlan, annualPlan];
    const selectedPlan = plans[Math.floor(Math.random() * plans.length)];
    const startDate = new Date();
    const endDate = new Date();

    if (selectedPlan.type === SubscriptionPlanType.ANNUAL) {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: selectedPlan.id,
        status: Math.random() > 0.1 ? SubscriptionStatus.ACTIVE : SubscriptionStatus.CANCELLED,
        startDate,
        endDate,
        tier: selectedPlan.name.includes('Premium')
          ? SubscriptionTier.PREMIUM
          : SubscriptionTier.STANDARD,
        benefits: selectedPlan.name.includes('Premium')
          ? ['unlimited-messages', 'priority-support', 'advanced-features', 'ad-free']
          : ['limited-messages', 'basic-support'],
        messagesUsed: Math.floor(Math.random() * 100),
        autoRenew: Math.random() > 0.3,
      },
    });
  }

  console.log('✨ Seed completed successfully!');
  console.log(`📊 Created:`);
  console.log(`   • ${createdUsers.length} users`);
  console.log(`   • ${subscriberCount} subscriptions`);
  console.log(`   • 3 subscription plans`);
  console.log(
    `   • ${createdUsers.reduce((acc, user) => acc + user.profilePhotos.length, 0)} profile photos`,
  );
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
