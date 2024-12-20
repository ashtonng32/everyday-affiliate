import { nanoid } from 'nanoid';
import { supabase } from './supabase';
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateSessionId = () => nanoid();

export const createAffiliateLink = (
  userId: string,
  retailerUrl: string,
  retailerName: string
): string => {
  try {
    const url = new URL(retailerUrl);
    const domain = url.hostname.toLowerCase();

    // Add tracking parameter based on retailer domain
    if (domain.includes('amazon')) {
      // Amazon affiliate format
      url.searchParams.append('tag', `${userId}-20`);
    } else if (domain.includes('wayfair')) {
      // Wayfair affiliate format
      url.searchParams.append('refid', userId);
    } else if (domain.includes('target')) {
      // Target affiliate format
      url.searchParams.append('afid', userId);
    } else if (domain.includes('walmart')) {
      // Walmart affiliate format
      url.searchParams.append('wmlspartner', userId);
    } else {
      // Generic format for other retailers
      url.searchParams.append('ref', userId);
    }

    return url.toString();
  } catch (error) {
    console.error('Error creating affiliate link:', error);
    return retailerUrl; // Return original URL if there's an error
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const calculateCommission = (amount: number, rate: number) => {
  return (amount * rate) / 100;
};
