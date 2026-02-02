
export type Language = 'SC' | 'TC' | 'EN' | 'JP' | 'KR';

export interface User {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
  palateScore: number;
  badges: Badge[];
  unlockedVarietals: string[]; // 存储已解锁的品种ID
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  isLocked?: boolean;
}

export interface FlavorProfile {
  acidity: number;   // 酸质
  sweetness: number; // 甜感
  body: number;      // 醇厚度
  bitterness: number;// 苦度
  aftertaste: number;// 余韵
}

export interface Post {
  id: string;
  title: string;
  productName: string;
  region: string; 
  origin?: string; 
  varietal?: string; // 新增：品种ID (用于解锁标本)
  location?: string;
  distance?: string;
  images: string[];
  author: {
    id: string;
    name: string;
    avatar: string;
    isOfficial?: boolean;
  };
  likes: number;
  hasLiked: boolean;
  roastLevel: number;
  process: string;
  method: string;
  flavorProfile: FlavorProfile;
  flavors: string[];
  topics: string[];
  priceRange: string;
  content: string;
  date: string;
  rating?: number;
}

export enum ViewType {
  HOME = 'home',
  ADD = 'add',
  PROFILE = 'profile',
  MESSAGES = 'messages' // 新增消息页面
}

export enum AppState {
  SPLASH = 'splash',
  AUTH = 'auth',
  ONBOARDING = 'onboarding',
  MAIN = 'main'
}

export enum HomeTab {
  FOLLOWING = 'Following',
  DISCOVER = 'Discover',
  LOCAL = 'Local'
}

export interface PrefillData {
  productName: string;
  roastLevel: number;
  process: string;
  method: string;
  region: string;
  varietal?: string; // 新增
}

export interface VarietalInfo {
  id: string;
  name: string;
  latinName: string;
  description: string;
  icon: string;
}

export interface FilterState {
  roasts: number[];
  methods: string[];
  regions: string[];
}

// 新增：消息相关类型
export interface ChatSession {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    isOfficial?: boolean;
  };
  lastMessage: string;
  time: string;
  unreadCount: number;
  isStranger: boolean; // 是否陌生人
  hasReplied: boolean; // 我是否回复过 (用于陌生人逻辑)
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  isMe: boolean;
  text: string;
  time: string;
  type: 'text' | 'image' | 'audio';
}

export interface NotificationStats {
  likes: number;
  followers: number;
  comments: number;
}
