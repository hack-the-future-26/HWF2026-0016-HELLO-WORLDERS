import { User, Product, Conversation, Message, Notification, Ride } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user-alex',
    name: 'Alex Rivera',
    email: 'alex.rivera@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    campus: 'Main University Campus',
    dorm: 'Engineering Quad - Hall B',
    department: 'Computer Science',
    graduationYear: 'Class of 2026',
    verifiedStudent: true,
    rating: 4.9,
    reviewCount: 18,
    joinedDate: 'September 2023',
    responseTime: 'Under 15 mins',
    bio: 'Junior studying CS. Mostly selling tech accessories, textbooks from intro years, and dorm appliances I no longer need.'
  },
  {
    id: 'user-maya',
    name: 'Maya Lin',
    email: 'maya.lin@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    campus: 'Main University Campus',
    dorm: 'Maple Hall (North)',
    department: 'Biology & Pre-Med',
    graduationYear: 'Class of 2025',
    verifiedStudent: true,
    rating: 5.0,
    reviewCount: 32,
    joinedDate: 'August 2022',
    responseTime: 'Under 30 mins',
    bio: 'Senior Bio major! Happy to meet up at the Science Library or Student Union lobby for handoffs.'
  },
  {
    id: 'user-jordan',
    name: 'Jordan Patel',
    email: 'jordan.p@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    campus: 'Main University Campus',
    dorm: 'West Campus Apartments',
    department: 'Mechanical Engineering',
    graduationYear: 'Class of 2025',
    verifiedStudent: true,
    rating: 4.8,
    reviewCount: 14,
    joinedDate: 'January 2023',
    responseTime: 'Under 1 hour',
    bio: 'MechE student. Have tools to help disassemble furniture if needed. Prefer meeting near West Quad.'
  },
  {
    id: 'user-chloe',
    name: 'Chloe Zhao',
    email: 'chloe.zhao@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    campus: 'Main University Campus',
    dorm: 'South Commons Tower',
    department: 'Economics & Data Science',
    graduationYear: 'Class of 2026',
    verifiedStudent: true,
    rating: 4.7,
    reviewCount: 9,
    joinedDate: 'September 2023',
    responseTime: 'Within 2 hours',
    bio: 'Selling course books, study lamps, and stationery. Fast replies in afternoon hours.'
  },
  {
    id: 'user-marcus',
    name: 'Marcus Vance',
    email: 'marcus.v@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    campus: 'Main University Campus',
    dorm: 'Arts Quad Residency',
    department: 'Architecture & Design',
    graduationYear: 'Class of 2024',
    verifiedStudent: true,
    rating: 4.9,
    reviewCount: 27,
    joinedDate: 'September 2021',
    responseTime: 'Under 45 mins',
    bio: 'Graduating senior clearing out studio materials, monitors, and dorm gear.'
  },
  {
    id: 'user-samira',
    name: 'Samira Khan',
    email: 'samira.k@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    campus: 'North Medical Campus',
    dorm: 'Health Sciences Housing',
    department: 'Biochemistry',
    graduationYear: 'Class of 2027',
    verifiedStudent: true,
    rating: 5.0,
    reviewCount: 6,
    joinedDate: 'September 2024',
    responseTime: 'Under 20 mins',
    bio: 'Sophomore biochem. Always meet at campus coffee shop or student lounge.'
  }
];

export const mockProducts: Product[] = [
  {
    id: 'prod-calc-ti84',
    title: 'TI-84 Plus CE Color Graphing Calculator',
    price: 55,
    originalPrice: 139,
    category: 'electronics',
    condition: 'like-new',
    description: 'Texas Instruments TI-84 Plus CE in pristine condition. Comes with charging cable, slide cover, and recent battery charge. Essential for Calculus, Stats, and Physics courses. No scratches on screen.',
    images: [
      'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user-maya',
    campus: 'Main University Campus',
    pickupLocation: 'Science Library Lobby (Safe Zone)',
    tags: ['calculator', 'stem', 'math', 'exam-approved'],
    createdAt: '2026-03-01T10:30:00Z',
    status: 'active',
    views: 142
  },
  {
    id: 'prod-text-calc9',
    title: 'Stewart Calculus: Early Transcendentals (9th Edition)',
    price: 40,
    originalPrice: 185,
    category: 'textbooks',
    condition: 'good',
    description: 'Hardcover 9th edition used for MATH 21A/B/C. Binding is solid and tight. Light pencil notes on a few chapters that can be erased easily. Save \$140+ compared to campus bookstore pricing.',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user-jordan',
    campus: 'Main University Campus',
    pickupLocation: 'Engineering Quad Courtyard',
    tags: ['textbook', 'calculus', 'math', 'hardcover'],
    createdAt: '2026-03-02T14:15:00Z',
    status: 'active',
    views: 89
  },
  {
    id: 'prod-dorm-fridge',
    title: '3.2 Cu. Ft. Compact Dorm Fridge with Freezer',
    price: 70,
    originalPrice: 199,
    category: 'dorm-essentials',
    condition: 'good',
    description: 'Two-door mini fridge with dedicated freezer section that actually freezes ice trays. Super quiet, dorm inspection certified, clean interior. Thoroughly wiped and defrosted. Pick up at West Campus.',
    images: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user-marcus',
    campus: 'Main University Campus',
    pickupLocation: 'West Campus Apartments Parking Lot',
    tags: ['dorm', 'appliances', 'fridge', 'room-essentials'],
    createdAt: '2026-03-03T09:00:00Z',
    status: 'active',
    views: 215
  },
  {
    id: 'prod-tech-headphones',
    title: 'Sony WH-CH720N Wireless Noise Cancelling Headphones',
    price: 65,
    originalPrice: 148,
    category: 'electronics',
    condition: 'like-new',
    description: 'Black Sony over-ear noise cancelling headphones. Lightweight and comfortable for 6+ hour library study sessions. Includes 3.5mm backup cable and USB-C charging cable. 35hr battery life.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user-chloe',
    campus: 'Main University Campus',
    pickupLocation: 'Student Union 2nd Floor Lounge',
    tags: ['audio', 'sony', 'headphones', 'study-gear'],
    createdAt: '2026-03-03T16:20:00Z',
    status: 'active',
    views: 180
  },
  {
    id: 'prod-bike-trek',
    title: 'Trek 7.2 FX Hybrid Commuter Bicycle (17.5" Medium)',
    price: 130,
    originalPrice: 480,
    category: 'bicycles',
    condition: 'good',
    description: 'Solid commuter bike perfect for getting between North and South campus in 5 minutes. Shimano 24-speed gearing, puncture-resistant Bontrager tires, tuned brakes. Includes kickstand and water bottle cage.',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user-jordan',
    campus: 'Main University Campus',
    pickupLocation: 'Campus Bike Repair Station (by Student Union)',
    tags: ['bicycle', 'trek', 'commute', 'transit'],
    createdAt: '2026-03-01T11:45:00Z',
    status: 'active',
    views: 310
  },
  {
    id: 'prod-lab-goggles',
    title: 'Knee-Length Lab Coat (Size M) + Splash Safety Goggles',
    price: 18,
    originalPrice: 45,
    category: 'lab-equipment',
    condition: 'like-new',
    description: '100% cotton lab coat required for Chem 1A/2B and Bio labs. Clean, freshly laundered, no acid burns or stains. Includes ANSI Z87.1 certified anti-fog safety splash goggles.',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user-samira',
    campus: 'North Medical Campus',
    pickupLocation: 'Chemistry Annex Room 101 Lobby',
    tags: ['lab', 'chemistry', 'safety', 'stem'],
    createdAt: '2026-03-04T08:30:00Z',
    status: 'active',
    views: 65
  },
  {
    id: 'prod-text-bio12',
    title: 'Campbell Biology (12th Edition) - Urry / Cain',
    price: 45,
    originalPrice: 210,
    category: 'textbooks',
    condition: 'good',
    description: 'Comprehensive general biology textbook. Zero missing pages. Highlighting in first 5 chapters only. Extremely helpful for Pre-Med students taking intro biology sequences.',
    images: [
      'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user-maya',
    campus: 'Main University Campus',
    pickupLocation: 'Life Sciences Courtyard',
    tags: ['biology', 'pre-med', 'textbook', 'campbell'],
    createdAt: '2026-02-28T15:10:00Z',
    status: 'active',
    views: 112
  },
  {
    id: 'prod-tech-monitor',
    title: 'Dell 24" 1080p IPS Monitor (HDMI + DisplayPort)',
    price: 60,
    originalPrice: 150,
    category: 'electronics',
    condition: 'like-new',
    description: 'Dell SE2422H 24-inch Full HD monitor with ultra-thin bezel. Works great as a dual screen setup for coding, writing essays, or gaming. Comes with power brick and high-speed HDMI cable.',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user-marcus',
    campus: 'Main University Campus',
    pickupLocation: 'Student Union North Entrance',
    tags: ['monitor', 'screen', 'dell', 'coding', 'dorm-desk'],
    createdAt: '2026-03-04T12:00:00Z',
    status: 'active',
    views: 245
  },
  {
    id: 'prod-dorm-lamp',
    title: 'Dimmable LED Desk Lamp with Wireless Qi Fast Charger',
    price: 22,
    originalPrice: 50,
    category: 'dorm-essentials',
    condition: 'brand-new',
    description: 'Box opened once to test. Has 5 color temperatures, auto timer, and wireless phone charging pad integrated into the base. Saves precious dorm outlet space!',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user-chloe',
    campus: 'Main University Campus',
    pickupLocation: 'South Commons Mail Center',
    tags: ['lamp', 'desk', 'wireless-charger', 'dorm'],
    createdAt: '2026-03-02T18:00:00Z',
    status: 'active',
    views: 94
  },
  {
    id: 'prod-cloth-hoodie',
    title: 'Campus-Thrift Collegiate Heavyweight Hoodie (Size L)',
    price: 25,
    originalPrice: 68,
    category: 'clothing',
    condition: 'like-new',
    description: 'Official collegiate licensed heavyweight fleece hoodie in forest green. Worn twice, super warm for morning 8 AM winter lectures. No fading or shrinking.',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user-alex',
    campus: 'Main University Campus',
    pickupLocation: 'Memorial Union Steps',
    tags: ['hoodie', 'apparel', 'winter', 'campus-thrift'],
    createdAt: '2026-03-04T14:40:00Z',
    status: 'active',
    views: 78
  },
  {
    id: 'prod-transit-scooter',
    title: 'Razor A5 Lux Kick Scooter (Large 200mm Wheels)',
    price: 35,
    originalPrice: 110,
    category: 'bicycles',
    condition: 'good',
    description: 'Folds up smoothly to bring directly into classrooms or lecture halls without locking outside. Giant urethane wheels glide over sidewalk cracks effortlessly.',
    images: [
      'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user-chloe',
    campus: 'Main University Campus',
    pickupLocation: 'Student Union Bike Racks',
    tags: ['scooter', 'commute', 'campus-transit'],
    createdAt: '2026-03-03T11:10:00Z',
    status: 'active',
    views: 120
  },
  {
    id: 'prod-text-clrs',
    title: 'Introduction to Algorithms (CLRS 4th Edition)',
    price: 50,
    originalPrice: 120,
    category: 'textbooks',
    condition: 'like-new',
    description: 'The bible for Computer Science algorithms courses and technical interview prep. Clean hardcover, zero marks. Bought brand new last semester.',
    images: [
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user-alex',
    campus: 'Main University Campus',
    pickupLocation: 'CS Building Atrium',
    tags: ['cs', 'algorithms', 'textbook', 'coding'],
    createdAt: '2026-03-04T15:00:00Z',
    status: 'active',
    views: 198
  },
  {
    id: 'prod-furn-chair',
    title: 'Ergonomic Mesh Swivel Desk Chair with Lumbar Support',
    price: 45,
    originalPrice: 130,
    category: 'furniture',
    condition: 'good',
    description: 'Breathable mesh back, adjustable height, smooth rolling casters. Miles better than the painful wooden chairs provided in university dorm rooms.',
    images: [
      'https://images.unsplash.com/photo-1580481077195-c3a9a32296c0?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user-marcus',
    campus: 'Main University Campus',
    pickupLocation: 'Arts Quad Residency Hallway',
    tags: ['furniture', 'chair', 'ergonomic', 'study'],
    createdAt: '2026-03-01T16:00:00Z',
    status: 'active',
    views: 165
  },
  {
    id: 'prod-dorm-kettle',
    title: 'Instant Pot Stainless Steel Electric Kettle (Auto Shut-Off)',
    price: 18,
    originalPrice: 42,
    category: 'dorm-essentials',
    condition: 'like-new',
    description: 'Boils 1.5L of water in under 4 minutes. Essential for dorm ramen, tea, pour-over coffee, and instant oatmeal. Auto shut-off safety feature approved for dorm rooms.',
    images: [
      'https://images.unsplash.com/photo-1594213114663-d94db9b17125?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user-maya',
    campus: 'Main University Campus',
    pickupLocation: 'Maple Hall Lobby',
    tags: ['kettle', 'dorm', 'kitchen', 'tea'],
    createdAt: '2026-03-02T19:30:00Z',
    status: 'active',
    views: 82
  },
  {
    id: 'prod-tech-mouse',
    title: 'Logitech MX Master 3S Wireless Performance Mouse',
    price: 58,
    originalPrice: 99,
    category: 'electronics',
    condition: 'like-new',
    description: 'Quiet clicks, 8K DPI sensor that works on dorm glass desks, dual bluetooth / USB receiver. Ultra ergonomic for design, engineering, and long research papers.',
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user-jordan',
    campus: 'Main University Campus',
    pickupLocation: 'West Quad Cafe',
    tags: ['mouse', 'logitech', 'productivity', 'tech'],
    createdAt: '2026-03-04T11:00:00Z',
    status: 'active',
    views: 140
  },
  {
    id: 'prod-gear-backpack',
    title: 'The North Face Borealis 28L Laptop Backpack',
    price: 45,
    originalPrice: 99,
    category: 'clothing',
    condition: 'good',
    description: 'Classic durable campus backpack with protective fleece-lined 15" laptop sleeve, water bottle side pockets, and bungee cord storage. Clean with no tears or broken zippers.',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user-chloe',
    campus: 'Main University Campus',
    pickupLocation: 'South Commons Quad',
    tags: ['backpack', 'northface', 'bag', 'student-gear'],
    createdAt: '2026-03-03T10:15:00Z',
    status: 'active',
    views: 110
  },
  {
    id: 'prod-lab-breadboard',
    title: 'EE Starter Kit: Solderless Breadboard, Jumper Wires & Multimeter',
    price: 24,
    originalPrice: 65,
    category: 'lab-equipment',
    condition: 'good',
    description: 'Complete kit used for introductory circuits lab (EE 101). Includes digital multimeter with fresh 9V battery, 830-point breadboard, resistors, LEDs, and jumper bundle.',
    images: [
      'https://images.unsplash.com/photo-1517055729445-fa7d27394b48?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user-alex',
    campus: 'Main University Campus',
    pickupLocation: 'Makerspace Entrance (Hall B)',
    tags: ['electronics', 'ee', 'circuits', 'multimeter'],
    createdAt: '2026-03-02T13:40:00Z',
    status: 'active',
    views: 95
  },
  {
    id: 'prod-text-ochem',
    title: 'Organic Chemistry by Wade (9th Edition) + Solution Manual',
    price: 48,
    originalPrice: 195,
    category: 'textbooks',
    condition: 'good',
    description: 'Includes both the main textbook and the separate solutions manual which is a lifesaver for practice synthesis problems. No missing pages.',
    images: [
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user-samira',
    campus: 'North Medical Campus',
    pickupLocation: 'Health Sciences Library Breezeway',
    tags: ['chemistry', 'ochem', 'textbook', 'solutions'],
    createdAt: '2026-02-27T16:20:00Z',
    status: 'active',
    views: 135
  },
  {
    id: 'prod-dorm-brita',
    title: 'Brita 6-Cup Water Filter Pitcher + 2 Brand New Filters',
    price: 15,
    originalPrice: 38,
    category: 'dorm-essentials',
    condition: 'like-new',
    description: 'Saves tons of money vs buying bottled water. Fits easily in compact mini fridges. Includes 2 sealed replacement Standard Brita filters.',
    images: [
      'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user-maya',
    campus: 'Main University Campus',
    pickupLocation: 'Maple Hall Courtyard',
    tags: ['brita', 'dorm', 'water-filter', 'clean'],
    createdAt: '2026-03-01T17:15:00Z',
    status: 'active',
    views: 70
  },
  {
    id: 'prod-tech-charger',
    title: 'Anker 65W GaN Dual USB-C Fast Charger with 6ft Cable',
    price: 25,
    originalPrice: 55,
    category: 'electronics',
    condition: 'brand-new',
    description: 'Powerful enough to fast-charge a MacBook Pro or Dell laptop plus your phone simultaneously from one tiny outlet block. Foldable prongs.',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user-alex',
    campus: 'Main University Campus',
    pickupLocation: 'CS Building Student Lounge',
    tags: ['charger', 'anker', 'usbc', 'tech'],
    createdAt: '2026-03-04T17:00:00Z',
    status: 'active',
    views: 104
  },
  {
    id: 'prod-furn-drawer',
    title: '3-Tier Rolling Storage Cart / Organizer on Wheels',
    price: 20,
    originalPrice: 48,
    category: 'furniture',
    condition: 'good',
    description: 'Sturdy steel utility cart with lockable wheels. Perfect for toiletries, snacks, desk supplies, or coffee station beside your bed.',
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user-chloe',
    campus: 'Main University Campus',
    pickupLocation: 'South Commons Lobby',
    tags: ['storage', 'cart', 'dorm-furniture', 'wheels'],
    createdAt: '2026-03-03T14:00:00Z',
    status: 'active',
    views: 88
  },
  {
    id: 'prod-bicycles-lock',
    title: 'Kryptonite New-U Evolution Heavy-Duty U-Lock with Cable',
    price: 38,
    originalPrice: 85,
    category: 'bicycles',
    condition: 'like-new',
    description: 'Gold standard campus bike theft protection. 13mm hardened steel shackle with 4ft double-loop cable for securing wheels. Includes 2 keys.',
    images: [
      'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user-jordan',
    campus: 'Main University Campus',
    pickupLocation: 'Engineering Courtyard',
    tags: ['lock', 'security', 'bike', 'kryptonite'],
    createdAt: '2026-03-02T12:00:00Z',
    status: 'active',
    views: 155
  },
  {
    id: 'prod-other-whiteboard',
    title: '36" x 24" Magnetic Dry Erase Whiteboard + Marker Set',
    price: 16,
    originalPrice: 40,
    category: 'other',
    condition: 'good',
    description: 'Great for dorm wall study sessions, problem sets, and tracking weekly assignments. Non-damaging Command hanging strips included.',
    images: [
      'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user-marcus',
    campus: 'Main University Campus',
    pickupLocation: 'Arts Quad Courtyard',
    tags: ['whiteboard', 'study', 'stationery', 'dorm'],
    createdAt: '2026-03-01T15:30:00Z',
    status: 'active',
    views: 62
  },
  {
    id: 'prod-text-stats',
    title: 'Probability and Statistics for Engineering (9th Edition)',
    price: 35,
    originalPrice: 160,
    category: 'textbooks',
    condition: 'fair',
    description: 'Devore textbook used for ENGR 105. Cover has corner wear, but interior text is clean and intact. Great budget option for the course.',
    images: [
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user-jordan',
    campus: 'Main University Campus',
    pickupLocation: 'West Quad Library Cafe',
    tags: ['statistics', 'engineering', 'textbook'],
    createdAt: '2026-02-26T10:00:00Z',
    status: 'active',
    views: 75
  },
  {
    id: 'prod-dorm-fan',
    title: 'Honeywell TurboForce Power Air Circulator Fan',
    price: 14,
    originalPrice: 30,
    category: 'dorm-essentials',
    condition: 'good',
    description: 'Compact 3-speed desktop/floor fan with 90 degree pivoting head. Essential for un-airconditioned dorms during the warm months.',
    images: [
      'https://images.unsplash.com/photo-1618941716939-553df3c6c278?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user-alex',
    campus: 'Main University Campus',
    pickupLocation: 'Engineering Quad - Hall B',
    tags: ['fan', 'honeywell', 'dorm', 'summer'],
    createdAt: '2026-03-04T16:15:00Z',
    status: 'active',
    views: 92
  }
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    productId: 'prod-calc-ti84',
    participantIds: ['user-alex', 'user-maya'],
    lastMessage: 'Sounds great! Let’s meet at the Science Library lobby at 2:30 PM tomorrow.',
    lastMessageTimestamp: '2026-03-04T14:45:00Z',
    unreadCount: 0
  },
  {
    id: 'conv-2',
    productId: 'prod-bike-trek',
    participantIds: ['user-alex', 'user-jordan'],
    lastMessage: 'Could you do \$120 if I can pick it up today right after class?',
    lastMessageTimestamp: '2026-03-04T11:20:00Z',
    unreadCount: 1
  },
  {
    id: 'conv-3',
    productId: 'prod-tech-headphones',
    participantIds: ['user-alex', 'user-chloe'],
    lastMessage: 'Yes, it comes with both the aux cable and the original USB-C cable!',
    lastMessageTimestamp: '2026-03-03T18:10:00Z',
    unreadCount: 0
  },
  {
    id: 'conv-4',
    productId: 'prod-lab-goggles',
    participantIds: ['user-alex', 'user-samira'],
    lastMessage: 'Is the lab coat size medium unisex or womens?',
    lastMessageTimestamp: '2026-03-04T09:15:00Z',
    unreadCount: 0
  }
];

export const mockMessages: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'm1-1',
      conversationId: 'conv-1',
      senderId: 'user-alex',
      text: 'Hi Maya! Is the TI-84 still available? Does the battery hold charge well?',
      timestamp: '2026-03-04T13:30:00Z'
    },
    {
      id: 'm1-2',
      conversationId: 'conv-1',
      senderId: 'user-maya',
      text: 'Hey Alex! Yes it is! The battery holds charge for over 2 weeks with daily math use.',
      timestamp: '2026-03-04T13:42:00Z'
    },
    {
      id: 'm1-3',
      conversationId: 'conv-1',
      senderId: 'user-alex',
      text: 'Awesome. Would you take \$50 cash or campus card?',
      timestamp: '2026-03-04T14:10:00Z',
      isQuickOffer: true,
      offerAmount: 50
    },
    {
      id: 'm1-4',
      conversationId: 'conv-1',
      senderId: 'user-maya',
      text: 'How about \$52? That covers the new charging cable I just got for it.',
      timestamp: '2026-03-04T14:30:00Z'
    },
    {
      id: 'm1-5',
      conversationId: 'conv-1',
      senderId: 'user-alex',
      text: 'Deal! Where is a good place on campus to meet?',
      timestamp: '2026-03-04T14:35:00Z'
    },
    {
      id: 'm1-6',
      conversationId: 'conv-1',
      senderId: 'user-maya',
      text: 'Sounds great! Let’s meet at the Science Library lobby at 2:30 PM tomorrow.',
      timestamp: '2026-03-04T14:45:00Z'
    }
  ],
  'conv-2': [
    {
      id: 'm2-1',
      conversationId: 'conv-2',
      senderId: 'user-alex',
      text: 'Hey Jordan, nice Trek! What height is the 17.5" frame best suited for?',
      timestamp: '2026-03-04T10:45:00Z'
    },
    {
      id: 'm2-2',
      conversationId: 'conv-2',
      senderId: 'user-jordan',
      text: 'Hey Alex! It fits riders between roughly 5\'6" and 5\'11". The seatpost has plenty of adjustment.',
      timestamp: '2026-03-04T11:00:00Z'
    },
    {
      id: 'm2-3',
      conversationId: 'conv-2',
      senderId: 'user-alex',
      text: 'Could you do \$120 if I can pick it up today right after class?',
      timestamp: '2026-03-04T11:20:00Z',
      isQuickOffer: true,
      offerAmount: 120
    }
  ],
  'conv-3': [
    {
      id: 'm3-1',
      conversationId: 'conv-3',
      senderId: 'user-alex',
      text: 'Hello Chloe! Are all original cables included with the Sony headphones?',
      timestamp: '2026-03-03T17:55:00Z'
    },
    {
      id: 'm3-2',
      conversationId: 'conv-3',
      senderId: 'user-chloe',
      text: 'Yes, it comes with both the aux cable and the original USB-C cable!',
      timestamp: '2026-03-03T18:10:00Z'
    }
  ],
  'conv-4': [
    {
      id: 'm4-1',
      conversationId: 'conv-4',
      senderId: 'user-alex',
      text: 'Is the lab coat size medium unisex or womens?',
      timestamp: '2026-03-04T09:15:00Z'
    }
  ]
};

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-alex',
    type: 'message',
    title: 'New message from Maya Lin',
    body: 'Sounds great! Let’s meet at the Science Library lobby at 2:30 PM tomorrow.',
    timestamp: '2026-03-04T14:45:00Z',
    isRead: false,
    link: '/chat/conv-1'
  },
  {
    id: 'notif-2',
    userId: 'user-alex',
    type: 'offer',
    title: 'Offer received on CLRS Textbook',
    body: 'Jordan Patel offered \$45 for Introduction to Algorithms (CLRS 4th Edition).',
    timestamp: '2026-03-04T12:10:00Z',
    isRead: false,
    link: '/my-listings'
  },
  {
    id: 'notif-3',
    userId: 'user-alex',
    type: 'safety',
    title: 'Campus Safe Meet-up Reminder',
    body: 'Always conduct marketplace exchanges during daylight hours in designated campus safe zones.',
    timestamp: '2026-03-03T10:00:00Z',
    isRead: true
  },
  {
    id: 'notif-4',
    userId: 'user-alex',
    type: 'listing_update',
    title: 'Price drop alert on saved item',
    body: 'The North Face Borealis Backpack was reduced from \$55 to \$45.',
    timestamp: '2026-03-02T16:00:00Z',
    isRead: true,
    link: '/product/prod-gear-backpack'
  }
];

export const mockRides: Ride[] = [
  {
    id: 'ride-1',
    driverId: 'user-jordan',
    driverName: 'Jordan Patel',
    driverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    driverRating: 4.9,
    driverVerified: true,
    from: 'Campus Student Union (Circle Drive)',
    to: 'Metropolitan International Airport (Terminal 2 & 3)',
    date: 'Friday, March 13, 2026',
    departureTime: '2:30 PM',
    price: 15,
    availableSeats: 3,
    totalSeats: 4,
    vehicleInfo: 'Silver Honda Civic (Trunk space for 3 carry-ons)',
    notes: 'Heading home for Spring Break! Leaving promptly at 2:30 from the union circle drive.'
  },
  {
    id: 'ride-2',
    driverId: 'user-marcus',
    driverName: 'Marcus Vance',
    driverAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    driverRating: 4.8,
    driverVerified: true,
    from: 'West Campus Residence Halls',
    to: 'Costco & Trader Joe’s Shopping Center',
    date: 'Saturday, March 7, 2026',
    departureTime: '11:00 AM',
    price: 5,
    availableSeats: 2,
    totalSeats: 4,
    vehicleInfo: 'Subaru Outback (Lots of grocery cargo room)',
    notes: 'Weekly grocery run. Planning to stay there for about 1 hour and 15 mins then head straight back.'
  },
  {
    id: 'ride-3',
    driverId: 'user-maya',
    driverName: 'Maya Lin',
    driverAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    driverRating: 5.0,
    driverVerified: true,
    from: 'Main Campus Quad',
    to: 'Amtrak Central Station',
    date: 'Friday, March 13, 2026',
    departureTime: '4:15 PM',
    price: 10,
    availableSeats: 3,
    totalSeats: 4,
    vehicleInfo: 'Blue Toyota Corolla Hybrid',
    notes: 'Catching the 5:15 PM northbound train. Can drop off right at passenger loading.'
  },
  {
    id: 'ride-4',
    driverId: 'user-alex',
    driverName: 'Alex Rivera',
    driverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    driverRating: 4.9,
    driverVerified: true,
    from: 'Engineering Complex',
    to: 'Tech Innovation Park & Research Labs',
    date: 'Monday, March 9, 2026',
    departureTime: '8:15 AM',
    price: 4,
    availableSeats: 2,
    totalSeats: 3,
    vehicleInfo: 'Mazda 3 Hatchback',
    notes: 'Morning internship carpool. Leaves Mon/Wed mornings consistently.'
  },
  {
    id: 'ride-5',
    driverId: 'user-chloe',
    driverName: 'Chloe Zhao',
    driverAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    driverRating: 4.7,
    driverVerified: true,
    from: 'South Commons Transit Bay',
    to: 'Downtown City Center / Plaza Mall',
    date: 'Saturday, March 7, 2026',
    departureTime: '1:00 PM',
    price: 6,
    availableSeats: 3,
    totalSeats: 4,
    vehicleInfo: 'Hyundai Elantra',
    notes: 'Weekend shopping trip. Returning around 5:30 PM.'
  },
  {
    id: 'ride-6',
    driverId: 'user-samira',
    driverName: 'Samira Khan',
    driverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    driverRating: 5.0,
    driverVerified: true,
    from: 'Main Campus',
    to: 'North Medical Campus Hospital',
    date: 'Tuesday, March 10, 2026',
    departureTime: '7:45 AM',
    price: 3,
    availableSeats: 2,
    totalSeats: 4,
    vehicleInfo: 'Toyota Prius',
    notes: 'Early morning clinical rotation commute. Quiet ride with coffee!'
  },
  {
    id: 'ride-7',
    driverId: 'user-jordan',
    driverName: 'Jordan Patel',
    driverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    driverRating: 4.9,
    driverVerified: true,
    from: 'Campus Recreation Center',
    to: 'State Park Hiking Trailhead',
    date: 'Sunday, March 8, 2026',
    departureTime: '9:00 AM',
    price: 8,
    availableSeats: 3,
    totalSeats: 4,
    vehicleInfo: 'Subaru Outback',
    notes: 'Sunday morning outdoor club day hike. Bringing trail snacks!'
  },
  {
    id: 'ride-8',
    driverId: 'user-marcus',
    driverName: 'Marcus Vance',
    driverAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    driverRating: 4.8,
    driverVerified: true,
    from: 'East Dorms Parking Lot',
    to: 'IKEA Furniture Superstore',
    date: 'Sunday, March 15, 2026',
    departureTime: '1:30 PM',
    price: 7,
    availableSeats: 2,
    totalSeats: 4,
    vehicleInfo: 'Ford Escape (Roof racks available)',
    notes: 'Post-break dorm furniture pickup. Can help fit small flat-pack boxes.'
  }
];
