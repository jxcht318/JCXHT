
export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: '堂務消息' | '活動公告' | '慶典公告';
  summary: string;
  content?: string;
  imageUrl?: string; // 舊有單圖相容
  imageUrls?: string[]; // 新增多圖支援
  lunarDate?: string;
  solarTerm?: string;
  festival?: string;
  timestamp?: string;
}

export interface CharityActivity {
  id: string;
  title: string;
  date: string;
  type: '慈善捐助' | '社會服務';
  description: string;
  content?: string;
  imageUrl?: string; // 舊有單圖相容
  imageUrls?: string[]; // 支援最高 20 張
  timestamp?: string;
}

export interface CharityDonationRecord {
  id: string;
  name: string;
  phone: string;
  address: string;
  amount: number;
  platform?: string;
  timestamp: string;
  status: 'paid' | 'pending';
}

export interface DeityInfo {
  id: string;
  name: string;
  title: string;
  description: string;
  fullDescription: string;
  imageUrl: string;
  merits: string[];
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: '點燈' | '拔度法會' | '祈福法會';
}

export interface RegistrationRecord {
  id: string;
  serviceName: string;
  amount: number;
  name: string;
  phone: string;
  gender: string;
  birthday: string;
  birthdayType: 'solar' | 'lunar';
  formattedBirthday?: string;
  address: string;
  wish: string;
  timestamp: string;
  status: 'paid' | 'pending';
  platform?: string;
}

export interface VolunteerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  experience?: string;
  timestamp: string;
}
