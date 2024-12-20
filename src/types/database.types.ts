export type Retailer = {
  id: string;
  name: string;
  base_url: string;
  logo_url: string | null;
  affiliate_program: string;
  commission_rate: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type UserSession = {
  id: string;
  user_id: string;
  retailer_id: string;
  session_id: string;
  created_at: string;
  expires_at: string;
};

export type Purchase = {
  id: string;
  session_id: string;
  referrer_id: string;
  retailer_id: string;
  purchase_amount: number;
  commission_amount: number;
  status: 'pending' | 'completed' | 'failed' | 'paid';
  created_at: string;
};
