export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  isSuspended: boolean;
  savedAddress?: string;
  wishlist: string[]; // list of product IDs
  searchHistory: string[];
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  category: string;
  subcategory?: string;
  sku: string;
  availableStock: number;
  images: string[];
  primaryImage: string;
  materialsUsed: string[];
  dimensions: string; // e.g. "12 x 12 inches"
  weight: string;      // e.g. "1.5 kg"
  color: string;
  style: string;
  tags: string[];
  brand: string; // Defaults to Dr.Decors
  featured: boolean;
  trending: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  status: "draft" | "published" | "hidden";
  createdDate: string;
  updatedDate: string;
  views: number;
  purchaseClicks: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  banner?: string;
  order: number;
}

export interface WebsiteSettings {
  websiteName: string;
  logo: string;
  themeColor: "amber" | "rose" | "indigo" | "emerald" | "slate";
  whatsAppNumber: string;
  businessAddress: string;
  contactEmail: string;
  facebookUrl?: string;
  instagramUrl?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export interface PurchaseRequest {
  id: string;
  userId?: string;
  userName: string;
  userEmail: string;
  productId: string;
  productName: string;
  productPrice: number;
  clickedAt: string;
  whatsAppMessage: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  sentAt: string;
  status: "unread" | "read";
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}
