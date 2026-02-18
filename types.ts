
export interface Post {
  id: string;
  title: string;
  platform: 'instagram' | 'facebook' | 'tiktok';
  status: 'sent' | 'pending' | 'analyzing';
  imageUrl: string;
  likes?: number;
  comments?: number;
  timestamp: string;
  caption?: string;
}

export interface StatCardProps {
  label: string;
  value: string;
  trend?: number;
  icon: string;
  colorClass: string;
}
