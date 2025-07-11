import {
  PrismaClient,
  Gender,
  SubscriptionPlanType,
  SubscriptionStatus,
  SubscriptionTier,
  User,
  // Removed: UserPhoto,
} from '@prisma/client';

const prisma = new PrismaClient();

// Realistic user data with updated African profile pictures
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
    profilePicture:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    languages: ['English', 'Igbo'],
    lookingFor: ['Friendship', 'Networking'],
    height: '180cm',
    location: { latitude: 6.5244, longitude: 3.3792, address: 'Lagos, Nigeria' },
    privacy: {
      isProfilePublic: true,
      areRatingsPublic: true,
      isLocationPublic: false,
      isContactPublic: false,
    },
    preferences: {
      language: 'en',
      timezone: 'Africa/Lagos',
      notifications: { email: true, push: true, sms: false },
    },
    notificationPreferences: { email: true, push: true, sms: false },
    visibility: { isVisibleInSearch: true, isVisibleToNearby: true, isVisibleToRecommended: true },
    settings: {
      theme: 'system',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
    },
    deactivatedAt: null,
    deletedAt: null,
    media: [
      {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face',
        type: 'IMAGE',
        caption: 'Profile Picture',
      },
      {
        url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop&crop=face',
        type: 'IMAGE',
      },
      {
        url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop&crop=face',
        type: 'IMAGE',
      },
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
    profilePicture:
      'https://res.cloudinary.com/do64gczom/image/upload/v1752146498/pexels-viscoseillusion-4006511_vdb1ce.jpg',
    languages: ['English', 'Hausa'],
    lookingFor: ['Networking', 'Mentorship'],
    height: '165cm',
    location: { latitude: 6.5244, longitude: 3.3792, address: 'Abuja, Nigeria' },
    privacy: {
      isProfilePublic: true,
      areRatingsPublic: true,
      isLocationPublic: true,
      isContactPublic: true,
    },
    preferences: {
      language: 'en',
      timezone: 'Africa/Lagos',
      notifications: { email: true, push: true, sms: false },
    },
    notificationPreferences: { email: true, push: true, sms: false },
    visibility: { isVisibleInSearch: true, isVisibleToNearby: true, isVisibleToRecommended: true },
    settings: {
      theme: 'light',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
    },
    deactivatedAt: null,
    deletedAt: null,
    media: [
      {
        url: 'https://res.cloudinary.com/do64gczom/image/upload/v1752146498/pexels-viscoseillusion-4006511_vdb1ce.jpg',
        type: 'IMAGE',
        caption: 'Profile Picture',
      },
      {
        url: 'https://res.cloudinary.com/do64gczom/video/upload/v1752146596/8026952-uhd_2160_4096_25fps_mfe5tp.mp4',
        type: 'VIDEO',
        caption: 'video clip',
      },
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
    profilePicture:
      'https://res.cloudinary.com/do64gczom/image/upload/v1752146459/tamarcus-brown-29pFbI_D1Sc-unsplash_skk7hj.jpg',
    languages: ['English', 'Yoruba'],
    lookingFor: ['Collaboration', 'Networking'],
    height: '175cm',
    location: { latitude: 6.5244, longitude: 3.3792, address: 'Ibadan, Nigeria' },
    privacy: {
      isProfilePublic: true,
      areRatingsPublic: true,
      isLocationPublic: true,
      isContactPublic: true,
    },
    preferences: {
      language: 'en',
      timezone: 'Africa/Lagos',
      notifications: { email: true, push: true, sms: false },
    },
    notificationPreferences: { email: true, push: true, sms: false },
    visibility: { isVisibleInSearch: true, isVisibleToNearby: true, isVisibleToRecommended: true },
    settings: {
      theme: 'dark',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
    },
    deactivatedAt: null,
    deletedAt: null,
    media: [
      {
        url: 'https://res.cloudinary.com/do64gczom/image/upload/v1752146344/pexels-cottonbro-9376467_bxp4lb.jpg',
        type: 'IMAGE',
        caption: 'Profile Picture',
      },
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
    profilePicture:
      'https://res.cloudinary.com/do64gczom/image/upload/v1752146344/pexels-cottonbro-9376467_bxp4lb.jpg',
    languages: ['English', 'Igbo'],
    lookingFor: ['Networking', 'Mentorship'],
    height: '160cm',
    location: { latitude: 6.5244, longitude: 3.3792, address: 'Enugu, Nigeria' },
    privacy: {
      isProfilePublic: true,
      areRatingsPublic: true,
      isLocationPublic: true,
      isContactPublic: true,
    },
    preferences: {
      language: 'en',
      timezone: 'Africa/Lagos',
      notifications: { email: true, push: true, sms: false },
    },
    notificationPreferences: { email: true, push: true, sms: false },
    visibility: { isVisibleInSearch: true, isVisibleToNearby: true, isVisibleToRecommended: true },
    settings: {
      theme: 'light',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
    },
    deactivatedAt: null,
    deletedAt: null,
    media: [
      {
        url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=800&fit=crop&crop=face',
        type: 'IMAGE',
        caption: 'Profile Picture',
      },
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
    profilePicture:
      'https://res.cloudinary.com/do64gczom/image/upload/v1752146535/osheen-turnbull-AN8wX45Rmew-unsplash_pmbi8s.jpg',
    languages: ['English', 'Yoruba'],
    lookingFor: ['Networking', 'Mentorship'],
    height: '185cm',
    location: { latitude: 6.5244, longitude: 3.3792, address: 'Ibadan, Nigeria' },
    privacy: {
      isProfilePublic: true,
      areRatingsPublic: true,
      isLocationPublic: true,
      isContactPublic: true,
    },
    preferences: {
      language: 'en',
      timezone: 'Africa/Lagos',
      notifications: { email: true, push: true, sms: false },
    },
    notificationPreferences: { email: true, push: true, sms: false },
    visibility: { isVisibleInSearch: true, isVisibleToNearby: true, isVisibleToRecommended: true },
    settings: {
      theme: 'dark',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
    },
    deactivatedAt: null,
    deletedAt: null,
    media: [
      {
        url: 'https://res.cloudinary.com/do64gczom/image/upload/v1752146321/pexels-luca-de-massis-83080741-8832601_hjykcz.jpg',
        type: 'IMAGE',
        caption: 'Profile Picture',
      },
      {
        url: 'https://res.cloudinary.com/do64gczom/image/upload/v1752146535/osheen-turnbull-AN8wX45Rmew-unsplash_pmbi8s.jpg',
        type: 'IMAGE',
        caption: 'Profile Picture',
      },
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
    profilePicture:
      'https://res.cloudinary.com/do64gczom/image/upload/v1752146498/pexels-viscoseillusion-4006511_vdb1ce.jpg',
    languages: ['English', 'Hausa'],
    lookingFor: ['Networking', 'Mentorship'],
    height: '168cm',
    location: { latitude: 6.5244, longitude: 3.3792, address: 'Kano, Nigeria' },
    privacy: {
      isProfilePublic: true,
      areRatingsPublic: true,
      isLocationPublic: true,
      isContactPublic: true,
    },
    preferences: {
      language: 'en',
      timezone: 'Africa/Lagos',
      notifications: { email: true, push: true, sms: false },
    },
    notificationPreferences: { email: true, push: true, sms: false },
    visibility: { isVisibleInSearch: true, isVisibleToNearby: true, isVisibleToRecommended: true },
    settings: {
      theme: 'light',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
    },
    deactivatedAt: null,
    deletedAt: null,
    media: [
      {
        url: 'https://res.cloudinary.com/do64gczom/image/upload/v1752146455/pexels-viscoseillusion-4006513_vaerbb.jpg',
        type: 'IMAGE',
        caption: 'Profile Picture',
      },
      {
        url: 'https://res.cloudinary.com/do64gczom/image/upload/v1752146498/pexels-viscoseillusion-4006511_vdb1ce.jpg',
        type: 'IMAGE',
        caption: 'Profile Picture',
      },
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
    profilePicture:
      'https://res.cloudinary.com/do64gczom/image/upload/v1752146494/pexels-enginakyurt-1458876_jj82sh.jpg',
    languages: ['English', 'Igbo'],
    lookingFor: ['Networking', 'Mentorship'],
    height: '170cm',
    location: { latitude: 6.5244, longitude: 3.3792, address: 'Abuja, Nigeria' },
    privacy: {
      isProfilePublic: true,
      areRatingsPublic: true,
      isLocationPublic: true,
      isContactPublic: true,
    },
    preferences: {
      language: 'en',
      timezone: 'Africa/Lagos',
      notifications: { email: true, push: true, sms: false },
    },
    notificationPreferences: { email: true, push: true, sms: false },
    visibility: { isVisibleInSearch: true, isVisibleToNearby: true, isVisibleToRecommended: true },
    settings: {
      theme: 'dark',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
    },
    deactivatedAt: null,
    deletedAt: null,
    media: [
      {
        url: 'https://res.cloudinary.com/do64gczom/image/upload/v1752146475/pexels-dioclick-5373985_sqec6s.jpg',
        type: 'IMAGE',
        caption: 'Profile Picture',
      },
      {
        url: 'https://res.cloudinary.com/do64gczom/video/upload/v1752146381/8456422-hd_1080_1920_30fps_rpdpvi.mp4',
        type: 'VIDEO',
        caption: 'media clip',
      },
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
    profilePicture:
      'https://res.cloudinary.com/do64gczom/image/upload/v1752149484/pexels-mikhail-nilov-6834308_xel0iq.jpg',
    languages: ['English', 'Yoruba'],
    lookingFor: ['Networking', 'Mentorship'],
    height: '182cm',
    location: { latitude: 6.5244, longitude: 3.3792, address: 'Lagos, Nigeria' },
    privacy: {
      isProfilePublic: true,
      areRatingsPublic: true,
      isLocationPublic: true,
      isContactPublic: true,
    },
    preferences: {
      language: 'en',
      timezone: 'Africa/Lagos',
      notifications: { email: true, push: true, sms: false },
    },
    notificationPreferences: { email: true, push: true, sms: false },
    visibility: { isVisibleInSearch: true, isVisibleToNearby: true, isVisibleToRecommended: true },
    settings: {
      theme: 'light',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
    },
    deactivatedAt: null,
    deletedAt: null,
    media: [
      {
        url: 'https://res.cloudinary.com/do64gczom/image/upload/v1752146344/pexels-cottonbro-9376467_bxp4lb.jpg',
        type: 'IMAGE',
        caption: 'Profile Picture',
      },
      {
        url: 'https://res.cloudinary.com/do64gczom/image/upload/v1752149484/pexels-mikhail-nilov-6834308_xel0iq.jpg',
        type: 'IMAGE',
        caption: 'Profile Picture',
      },
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
    profilePicture:
      'https://res.cloudinary.com/do64gczom/image/upload/v1752149699/pexels-godisable-jacob-226636-908884_xqv6ts.jpg',
    languages: ['English', 'Hausa'],
    lookingFor: ['Networking', 'Mentorship'],
    height: '162cm',
    location: { latitude: 6.5244, longitude: 3.3792, address: 'Kano, Nigeria' },
    privacy: {
      isProfilePublic: true,
      areRatingsPublic: true,
      isLocationPublic: true,
      isContactPublic: true,
    },
    preferences: {
      language: 'en',
      timezone: 'Africa/Lagos',
      notifications: { email: true, push: true, sms: false },
    },
    notificationPreferences: { email: true, push: true, sms: false },
    visibility: { isVisibleInSearch: true, isVisibleToNearby: true, isVisibleToRecommended: true },
    settings: {
      theme: 'dark',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
    },
    deactivatedAt: null,
    deletedAt: null,
    media: [
      {
        url: 'https://res.cloudinary.com/do64gczom/image/upload/v1752146475/pexels-dioclick-5373985_sqec6s.jpg',
        type: 'IMAGE',
        caption: ' Picture',
      },
      {
        url: 'https://res.cloudinary.com/do64gczom/image/upload/v1752149699/pexels-godisable-jacob-226636-908884_xqv6ts.jpg',
        type: 'IMAGE',
        caption: ' Picture',
      },
      {
        url: 'https://res.cloudinary.com/do64gczom/image/upload/v1752149484/pexels-shvetsa-6555434_tmn37a.jpg',
        type: 'IMAGE',
        caption: ' Picture',
      },
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
    profilePicture:
      'https://res.cloudinary.com/do64gczom/image/upload/v1752146530/bave-pictures-TOZYmlM4Amw-unsplash_d4utsa.jpg',
    languages: ['English', 'Igbo'],
    lookingFor: ['Networking', 'Mentorship'],
    height: '178cm',
    location: { latitude: 6.5244, longitude: 3.3792, address: 'Owerri, Nigeria' },
    privacy: {
      isProfilePublic: true,
      areRatingsPublic: true,
      isLocationPublic: true,
      isContactPublic: true,
    },
    preferences: {
      language: 'en',
      timezone: 'Africa/Lagos',
      notifications: { email: true, push: true, sms: false },
    },
    notificationPreferences: { email: true, push: true, sms: false },
    visibility: { isVisibleInSearch: true, isVisibleToNearby: true, isVisibleToRecommended: true },
    settings: {
      theme: 'light',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
    },
    deactivatedAt: null,
    deletedAt: null,
    media: [
      {
        url: 'https://images.unsplash.com/photo-1618568925826-7c0b5d3e0e8f?w=600&h=800&fit=crop&crop=face',
        type: 'IMAGE',
        caption: 'Profile Picture',
      },
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
    profilePicture:
      'https://res.cloudinary.com/do64gczom/image/upload/v1752146409/pexels-yaroslav-shuraev-6811728_yybevo.jpg',
    languages: ['English', 'Ibibio'],
    lookingFor: ['Networking', 'Mentorship'],
    height: '165cm',
    location: { latitude: 6.5244, longitude: 3.3792, address: 'Uyo, Nigeria' },
    privacy: {
      isProfilePublic: true,
      areRatingsPublic: true,
      isLocationPublic: true,
      isContactPublic: true,
    },
    preferences: {
      language: 'en',
      timezone: 'Africa/Lagos',
      notifications: { email: true, push: true, sms: false },
    },
    notificationPreferences: { email: true, push: true, sms: false },
    visibility: { isVisibleInSearch: true, isVisibleToNearby: true, isVisibleToRecommended: true },
    settings: {
      theme: 'dark',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
    },
    deactivatedAt: null,
    deletedAt: null,
    media: [
      {
        url: 'https://res.cloudinary.com/do64gczom/image/upload/v1752149475/pexels-elsimage-2791823_qtqw3o.jpg',
        type: 'IMAGE',
        caption: 'Profile Picture',
      },
      {
        url: 'https://res.cloudinary.com/do64gczom/image/upload/v1752149475/pexels-elsimage-2791823_qtqw3o.jpg',
        type: 'IMAGE',
        caption: 'Profile Picture',
      },
      {
        url: 'https://res.cloudinary.com/do64gczom/video/upload/v1752146349/5805836-hd_720_1144_30fps_n30cg2.mp4',
        type: 'VIDEO',
        caption: 'media clip',
      },
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
    profilePicture:
      'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=600&h=800&fit=crop&crop=face',
    languages: ['English', 'Yoruba'],
    lookingFor: ['Networking', 'Mentorship'],
    height: '180cm',
    location: { latitude: 6.5244, longitude: 3.3792, address: 'Ilorin, Nigeria' },
    privacy: {
      isProfilePublic: true,
      areRatingsPublic: true,
      isLocationPublic: true,
      isContactPublic: true,
    },
    preferences: {
      language: 'en',
      timezone: 'Africa/Lagos',
      notifications: { email: true, push: true, sms: false },
    },
    notificationPreferences: { email: true, push: true, sms: false },
    visibility: { isVisibleInSearch: true, isVisibleToNearby: true, isVisibleToRecommended: true },
    settings: {
      theme: 'light',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
    },
    deactivatedAt: null,
    deletedAt: null,
    media: [
      {
        url: 'https://res.cloudinary.com/do64gczom/image/upload/v1752149461/pexels-marcelodias-1970882_bq61s4.jpg',
        type: 'IMAGE',
        caption: 'Profile Picture',
      },
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
    profilePicture:
      'https://res.cloudinary.com/do64gczom/image/upload/v1752149727/judeus-samson-0UECcInuCR4-unsplash_f0xzan.jpg',
    languages: ['English', 'Igbo'],
    lookingFor: ['Networking', 'Mentorship'],
    height: '168cm',
    location: { latitude: 6.5244, longitude: 3.3792, address: 'Port Harcourt, Nigeria' },
    privacy: {
      isProfilePublic: true,
      areRatingsPublic: true,
      isLocationPublic: true,
      isContactPublic: true,
    },
    preferences: {
      language: 'en',
      timezone: 'Africa/Lagos',
      notifications: { email: true, push: true, sms: false },
    },
    notificationPreferences: { email: true, push: true, sms: false },
    visibility: { isVisibleInSearch: true, isVisibleToNearby: true, isVisibleToRecommended: true },
    settings: {
      theme: 'dark',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
    },
    deactivatedAt: null,
    deletedAt: null,
    media: [
      {
        url: 'https://res.cloudinary.com/do64gczom/image/upload/v1752146321/pexels-luca-de-massis-83080741-8832601_hjykcz.jpg',
        type: 'IMAGE',
        caption: 'Profile Picture',
      },
      {
        url: 'https://res.cloudinary.com/do64gczom/image/upload/v1752149727/judeus-samson-0UECcInuCR4-unsplash_f0xzan.jpg',
        type: 'IMAGE',
        caption: 'Profile Picture',
      },
      {
        url: 'https://res.cloudinary.com/do64gczom/video/upload/v1752146400/8410591-hd_1080_1920_25fps_th6zpn.mp4',
        type: 'VIDEO',
        caption: 'media clip',
      },
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
    profilePicture:
      'https://images.unsplash.com/photo-1614204424926-196a80bf0be8?w=600&h=800&fit=crop&crop=face',
    languages: ['English', 'Yoruba'],
    lookingFor: ['Networking', 'Mentorship'],
    height: '185cm',
    location: { latitude: 6.5244, longitude: 3.3792, address: 'Lagos, Nigeria' },
    privacy: {
      isProfilePublic: true,
      areRatingsPublic: true,
      isLocationPublic: true,
      isContactPublic: true,
    },
    preferences: {
      language: 'en',
      timezone: 'Africa/Lagos',
      notifications: { email: true, push: true, sms: false },
    },
    notificationPreferences: { email: true, push: true, sms: false },
    visibility: { isVisibleInSearch: true, isVisibleToNearby: true, isVisibleToRecommended: true },
    settings: {
      theme: 'light',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
    },
    deactivatedAt: null,
    deletedAt: null,
    media: [
      {
        url: 'https://images.unsplash.com/photo-1614204424926-196a80bf0be8?w=600&h=800&fit=crop&crop=face',
        type: 'IMAGE',
        caption: 'Profile Picture',
      },
    ],
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean up existing data
  console.log('🧹 Cleaning up existing data...');
  await prisma.rating.deleteMany();
  await prisma.media.deleteMany();
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
  const createdUsers: User[] = [];

  for (let i = 0; i < userData.length; i++) {
    const { media, ...userFields } = userData[i];
    const createdUser = await prisma.user.create({ data: userFields });
    if (media && media.length > 0) {
      await prisma.media.createMany({
        data: media.map((m) => ({ ...m, userId: createdUser.id })),
        skipDuplicates: true,
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

  console.log('⭐ Creating ratings...');
  for (let i = 0; i < createdUsers.length; i++) {
    const rater = createdUsers[i];
    // Pick 2 other users to rate (or as many as you want)
    const others = createdUsers.filter((u) => u.id !== rater.id);
    const toRate = others.sort(() => 0.5 - Math.random()).slice(0, 2);
    for (const target of toRate) {
      const score = Math.floor(Math.random() * 5) + 1; // 1-5 stars
      await prisma.rating.create({
        data: {
          raterId: rater.id,
          targetId: target.id,
          score,
        },
      });
      // Update totalRatings and averageRating for the target user
      const ratings = await prisma.rating.findMany({
        where: { targetId: target.id },
        select: { score: true },
      });
      const totalRatings = ratings.length;
      const averageRating =
        totalRatings > 0 ? ratings.reduce((sum, r) => sum + r.score, 0) / totalRatings : 0;
      await prisma.user.update({
        where: { id: target.id },
        data: {
          totalRatings,
          averageRating,
        },
      });
    }
  }

  console.log('✨ Seed completed successfully!');
  console.log(`📊 Created:`);
  console.log(`   • ${createdUsers.length} users`);
  console.log(`   • ${subscriberCount} subscriptions`);
  console.log(`   • 3 subscription plans`);
  console.log(
    `   • ${createdUsers.reduce((acc) => acc + 1, 0)} profile pictures`, // Changed to 1 for profile picture
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
