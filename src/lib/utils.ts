import { nanoid } from 'nanoid';
import { supabase } from './supabase';
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateSessionId = () => nanoid();

export const createAffiliateLink = async (
  userId: string,
  retailerId: string,
  productUrl?: string
) => {
  const sessionId = generateSessionId();
  
  // Create a new user session
  const { error } = await supabase
    .from('user_sessions')
    .insert({
      user_id: userId,
      retailer_id: retailerId,
      session_id: sessionId,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });

  if (error) {
    throw new Error('Failed to create session');
  }

  // If a product URL is provided, append our tracking parameters
  if (productUrl) {
    const url = new URL(productUrl);
    url.searchParams.append('sid', sessionId);
    return url.toString();
  }

  // Otherwise, return just the session ID for later use
  return sessionId;
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
