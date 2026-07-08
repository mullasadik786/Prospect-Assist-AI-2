export interface Transaction {
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
}

export interface BehavioralAction {
  action: string;
  timestamp: string;
  durationSeconds?: number;
  details?: string;
}

export interface ProspectProfile {
  id: string;
  name: string;
  occupation: string;
  age: number;
  declaredMonthlyIncome: number;
  requestedLoanType: 'Personal Loan' | 'Home Loan' | 'Mortgage Loan' | 'Auto Loan';
  requestedAmount: number;
  tenureYears: number;
  transactions: Transaction[];
  behavioralLog: BehavioralAction[];
  avatarUrl?: string;
}

export interface UnderwritingReport {
  repaymentCapacityScore: number; // 1-100
  calculatedMonthlyIncome: number; // actual verified income
  monthlyDisposableSurplus: number; // actual surplus
  debtObligationsTotal: number; // verified existing EMI / debts
  lifestyleSpendTotal: number; // verified non-essential spending
  essentialSpendTotal: number; // verified essential rent, bills, groceries
  interestAndIntentScore: number; // 1-100 based on digital behaviors
  leadConversionProbability: number; // 0-100 %
  leadClassification: 'Hot' | 'Warm' | 'Cold';
  recommendedLoanAmount: number;
  approvedInterestRate: number;
  debtToIncomeRatio: number; // percentage
  redFlags: string[];
  positiveIndicators: string[];
  prudentUnderwritingComments: string;
  cashFlowSummary: {
    monthlyCredits: number;
    monthlyDebits: number;
    transactionCount: number;
    incomeStabilityComment: string;
  };
}

export interface SavedLead {
  id: string;
  prospectName: string;
  occupation: string;
  loanType: string;
  requestedAmount: number;
  verifiedIncome: number;
  disposableSurplus: number;
  repaymentScore: number;
  conversionProbability: number;
  classification: 'Hot' | 'Warm' | 'Cold';
  status: 'New' | 'Contacted' | 'In Progress' | 'Approved' | 'Closed/Lost';
  languageUsed: string;
  createdAt: string;
  report?: UnderwritingReport;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}
