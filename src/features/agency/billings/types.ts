// ─── Types ─────────────────────────────────────────────────────────────────────

export interface PayRecord {
  id: string;
  period: string;
  amount: number;
  paidAt: string;
  status: 'paid' | 'pending' | 'processing';
}

export interface EmployeePay {
  id: string;
  name: string;
  role: string;
  department: string;
  basePay: number;
  deductions: number;
  bonuses: number;
  commission?: number;
  status: 'paid' | 'pending' | 'processing';
}

export interface ModelEarnings {
  id: string;
  name: string;
  initials: string;
  gradient: string;
  revenue: number;
  margin: number;
  trend: 'up' | 'down' | 'flat';
  trendValue: string;
}
