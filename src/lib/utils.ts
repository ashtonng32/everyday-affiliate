import { nanoid } from 'nanoid';
import { supabase } from './supabase';
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface AffiliateProgram {
  id: string;
  retailer_id: string;
  program_name: string;
  affiliate_id: string;
  base_url: string;
  affiliate_parameter: string;
}

interface CreateAffiliateLinkParams {
  userId: string;
  clickId: string;
  productUrl: string;
  affiliateProgram: AffiliateProgram;
}

export const createAffiliateLink = ({
  userId,
  clickId,
  productUrl,
  affiliateProgram,
}: CreateAffiliateLinkParams): string => {
  try {
    const url = new URL(productUrl);
    
    // For Amazon specifically, we need to handle their affiliate structure differently
    if (url.hostname.includes('amazon')) {
      // Clear any existing affiliate tags
      url.searchParams.delete('tag');
      
      // Add our affiliate tag - this needs to be first for Amazon
      url.searchParams.set('tag', affiliateProgram.affiliate_id);
      
      // Add a special parameter that Amazon uses to track the original referrer
      url.searchParams.set('ref', 'everydayaffiliate');
      
      // Add our tracking parameters at the end
      url.searchParams.append('ea_click', clickId);
      url.searchParams.append('ea_user', userId);
      
      return url.toString();
    }
    
    // For other retailers, use the standard approach
    url.searchParams.append('ea_click', clickId);
    url.searchParams.append('ea_user', userId);
    url.searchParams.append(
      affiliateProgram.affiliate_parameter,
      affiliateProgram.affiliate_id
    );

    return url.toString();
  } catch (error) {
    console.error('Error creating affiliate link:', error);
    return productUrl;
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const calculateCommission = (amount: number, rate: number) => {
  return amount * (rate / 100);
};

export const generateSessionId = () => nanoid();
