export type UserRole = 'admin' | 'author';
export type LinkStatus = 'active' | 'inactive';

export const LINK_TYPES = [
  'Google Sheets',
  'Google Docs',
  'Google Forms',
  'Microsoft Forms',
  'Microsoft Excel',
  'Microsoft Word',
  'Other',
] as const;

export type LinkType = (typeof LINK_TYPES)[number];

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Link {
  _id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  type: LinkType;
  status: LinkStatus;
  createdBy: { _id: string; name: string; email: string } | string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export type ActivityAction =
  | 'Login'
  | 'Logout'
  | 'Link Clicked'
  | 'Link Created'
  | 'Link Updated'
  | 'Link Deleted'
  | 'User Created'
  | 'User Updated'
  | 'User Deleted'
  | 'Password Reset';

export interface Activity {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: ActivityAction;
  details: string;
  linkTitle?: string;
  ipAddress: string;
  timestamp: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
