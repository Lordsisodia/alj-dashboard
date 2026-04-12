// ─── Types ─────────────────────────────────────────────────────────────────────

export type UserRole = 'chatter' | 'model' | 'manager' | 'owner';

export interface PayRecord {
  id: string;
  period: string;       // e.g. "March 2026"
  amount: number;
  paidAt: string;      // ISO date
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

// ─── Demo data ─────────────────────────────────────────────────────────────────

export const CHATTER_PAY: EmployeePay[] = [
  { id: 'sofia',    name: 'Sofia',    role: 'Chatter',    department: 'Sales',   basePay: 550, deductions: 0, bonuses: 15, commission: 320, status: 'pending' },
  { id: 'kristine', name: 'Kristine', role: 'Chatter',    department: 'Sales',   basePay: 550, deductions: 10, bonuses: 0, commission: 280, status: 'pending' },
  { id: 'macy',     name: 'Macy',     role: 'Chatter',    department: 'Sales',   basePay: 550, deductions: 0, bonuses: 20, commission: 195, status: 'pending' },
];

export const VA_PAY: EmployeePay[] = [
  { id: 'yssa', name: 'Yssa',   role: 'Social Media VA', department: 'Social Media', basePay: 550, deductions: 0,  bonuses: 25, commission: 0, status: 'pending' },
  { id: 'mikeee', name: 'Mikeee', role: 'Social Media VA', department: 'Social Media', basePay: 550, deductions: 10, bonuses: 0, commission: 0, status: 'pending' },
];

export const TEAM_PAYROLL: EmployeePay[] = [
  { id: 'sofia',    name: 'Sofia',    role: 'Chatter',    department: 'Sales',         basePay: 550, deductions: 0,  bonuses: 15,  commission: 320, status: 'pending' },
  { id: 'kristine', name: 'Kristine', role: 'Chatter',    department: 'Sales',         basePay: 550, deductions: 10, bonuses: 0,   commission: 280, status: 'pending' },
  { id: 'macy',     name: 'Macy',     role: 'Chatter',    department: 'Sales',         basePay: 550, deductions: 0,  bonuses: 20,  commission: 195, status: 'pending' },
  { id: 'yssa',     name: 'Yssa',     role: 'Social VA',  department: 'Social Media', basePay: 550, deductions: 0,  bonuses: 25,  commission: 0,   status: 'pending' },
  { id: 'mikeee',   name: 'Mikeee',   role: 'Social VA',  department: 'Social Media', basePay: 550, deductions: 10, bonuses: 0,   commission: 0,   status: 'pending' },
  { id: 'aria',     name: 'Aria',     role: 'Manager',   department: 'Management',  basePay: 0,   deductions: 0,  bonuses: 0,   commission: 0,   status: 'pending' },
  { id: 'jack',     name: 'Jack',     role: 'Manager',   department: 'Management',  basePay: 0,   deductions: 0,  bonuses: 0,   commission: 0,   status: 'pending' },
];

export const PAY_HISTORY: PayRecord[] = [
  { id: 'ph-1', period: 'March 2026',   amount: 885,  paidAt: '2026-03-30T10:00:00Z', status: 'paid' },
  { id: 'ph-2', period: 'February 2026', amount: 870,  paidAt: '2026-02-28T10:00:00Z', status: 'paid' },
  { id: 'ph-3', period: 'January 2026',  amount: 885,  paidAt: '2026-01-30T10:00:00Z', status: 'paid' },
];

export const MODEL_PAY_HISTORY: PayRecord[] = [
  { id: 'mph-1', period: 'March 2026',   amount: 2400, paidAt: '2026-03-30T10:00:00Z', status: 'paid' },
  { id: 'mph-2', period: 'February 2026', amount: 2180, paidAt: '2026-02-28T10:00:00Z', status: 'paid' },
  { id: 'mph-3', period: 'January 2026',  amount: 1950, paidAt: '2026-01-30T10:00:00Z', status: 'paid' },
];

export const OWNER_STATS = {
  totalPayroll: 3520,
  modelEarnings: 12400,
  businessExpenses: 3850,
  netRevenue: 6030,
};
