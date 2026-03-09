export type Role = 'buyer' | 'seller' | 'admin';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  file_url: string;
  cover_image: string;
  seller_id: string;
  created_at: string;
  sales_count?: number;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}
