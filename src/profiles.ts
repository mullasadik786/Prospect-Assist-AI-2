import { ProspectProfile } from './types';

export const PROSPECT_PROFILES: ProspectProfile[] = [
  {
    id: "prof_1",
    name: "Rajesh Kumar",
    occupation: "Senior Software Engineer at TCS",
    age: 32,
    declaredMonthlyIncome: 150000,
    requestedLoanType: "Home Loan",
    requestedAmount: 6500000,
    tenureYears: 20,
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
    behavioralLog: [
      { action: "Used Home Loan EMI Calculator", timestamp: "2026-07-01T10:15:00Z", details: "Tested ₹65L, ₹60L, ₹50L options" },
      { action: "Spent time on loan eligibility page", timestamp: "2026-07-01T10:20:00Z", durationSeconds: 240 },
      { action: "Downloaded Home Loan Guide PDF", timestamp: "2026-07-01T10:25:00Z", details: "Guide for First-Time Buyers" },
      { action: "Searched 'Best tax benefits under Section 80C/24b'", timestamp: "2026-07-01T11:02:00Z" },
      { action: "Clicked callback request button but did not submit yet", timestamp: "2026-07-01T11:05:00Z" }
    ],
    transactions: [
      { date: "2026-06-30", description: "TCS SALARY CREDIT / NEFT", amount: 142500, type: "credit", category: "Salary" },
      { date: "2026-06-28", description: "INTEREST CREDIT - SAVINGS A/C", amount: 1850, type: "credit", category: "Investment" },
      { date: "2026-06-25", description: "AMAZON INDIA SHOPPING UPI", amount: 4320, type: "debit", category: "Shopping" },
      { date: "2026-06-22", description: "SWIGGY FOOD DELIVERY UPI", amount: 840, type: "debit", category: "Dining" },
      { date: "2026-06-20", description: "SOCIETY MAINTENANCE CHG", amount: 4500, type: "debit", category: "Rent/Maintenance" },
      { date: "2026-06-15", description: "SIP INVEST / HDFC MUTUAL FUND", amount: 25000, type: "debit", category: "Investment" },
      { date: "2026-06-12", description: "ZOMATO UPI PAY", amount: 650, type: "debit", category: "Dining" },
      { date: "2026-06-10", description: "TATA PLAY DTH RECHARGE", amount: 450, type: "debit", category: "Utilities" },
      { date: "2026-06-08", description: "AUTO DEBIT - ACTIVE CAR LOAN EMI", amount: 14200, type: "debit", category: "Existing EMI" },
      { date: "2026-06-05", description: "CREDIT CARD PAYMENT HDFC", amount: 18400, type: "debit", category: "Credit Card" },
      { date: "2026-06-03", description: "CASH WITHDRAWAL - SBI ATM", amount: 10000, type: "debit", category: "Cash" },
      { date: "2026-06-01", description: "ACT FIBERNET BROADBAND UPI", amount: 1150, type: "debit", category: "Utilities" }
    ]
  },
  {
    id: "prof_2",
    name: "Ananya Sharma",
    occupation: "Kirana Merchant & Grocery Store Owner",
    age: 41,
    declaredMonthlyIncome: 80000,
    requestedLoanType: "Auto Loan",
    requestedAmount: 950000,
    tenureYears: 5,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
    behavioralLog: [
      { action: "Searched Auto Loan interest rates on portal", timestamp: "2026-06-30T14:30:00Z" },
      { action: "Compared SUVs eligible for commercial/personal loans", timestamp: "2026-06-30T14:42:00Z", durationSeconds: 400 },
      { action: "Viewed repayment schedules for ₹10L loan over 5 years", timestamp: "2026-06-30T14:55:00Z" }
    ],
    transactions: [
      { date: "2026-06-29", description: "UPI QR RECEIVED / BHARATPE MERCHANT", amount: 8400, type: "credit", category: "Business Credits" },
      { date: "2026-06-28", description: "UPI QR RECEIVED / PAYTM MERCHANT", amount: 12500, type: "credit", category: "Business Credits" },
      { date: "2026-06-27", description: "CASH DEPOSIT AT CDM BANNERGHATTA", amount: 45000, type: "credit", category: "Business Credits" },
      { date: "2026-06-26", description: "UPI QR RECEIVED / BHARATPE MERCHANT", amount: 9600, type: "credit", category: "Business Credits" },
      { date: "2026-06-25", description: "METRO CASH & CARRY DEBIT / STOCK INVENTORY", amount: 32000, type: "debit", category: "Business Expenses" },
      { date: "2026-06-22", description: "UPI QR RECEIVED / PAYTM MERCHANT", amount: 14300, type: "credit", category: "Business Credits" },
      { date: "2026-06-20", description: "SHOP ELECTRICITY BILL AUTO DEBIT", amount: 6200, type: "debit", category: "Utilities" },
      { date: "2026-06-15", description: "UPI TO WHOLESALER RAMESH", amount: 18000, type: "debit", category: "Business Expenses" },
      { date: "2026-06-10", description: "UPI QR RECEIVED / PAYTM MERCHANT", amount: 22100, type: "credit", category: "Business Credits" },
      { date: "2026-06-08", description: "PERSONAL LIC INSURANCE DEBIT", amount: 3500, type: "debit", category: "Insurance" },
      { date: "2026-06-05", description: "UPI TRANSFER TO FAMILY", amount: 15000, type: "debit", category: "Family/Personal" },
      { date: "2026-06-02", description: "SHOP RENT DIRECT TRANSFER", amount: 12000, type: "debit", category: "Business Expenses" }
    ]
  },
  {
    id: "prof_3",
    name: "Siddharth Verma",
    occupation: "Freelance UI/UX Designer & Content Creator",
    age: 26,
    declaredMonthlyIncome: 110000,
    requestedLoanType: "Personal Loan",
    requestedAmount: 400000,
    tenureYears: 3,
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop",
    behavioralLog: [
      { action: "Searched 'Instant loan approval in 2 hours'", timestamp: "2026-07-02T01:00:00Z" },
      { action: "Checked Personal Loan minimum eligibility criteria", timestamp: "2026-07-02T01:05:00Z", durationSeconds: 60 },
      { action: "Calculated 36-month EMI for ₹4L on portal", timestamp: "2026-07-02T01:10:00Z" }
    ],
    transactions: [
      { date: "2026-06-28", description: "UPWORK ESCROW CR / DESIGN PAYOUT", amount: 64000, type: "credit", category: "Freelance" },
      { date: "2026-06-25", description: "AUTO DEBIT - KREDITBEE INSTANT LOAN EMI", amount: 6800, type: "debit", category: "Existing EMI" },
      { date: "2026-06-24", description: "AUTO DEBIT - CASHE INSTANT LOAN EMI", amount: 4200, type: "debit", category: "Existing EMI" },
      { date: "2026-06-22", description: "CREDIT - FREELANCE PROJECT PAYOUT", amount: 12000, type: "credit", category: "Freelance" },
      { date: "2026-06-18", description: "COFFEE SHOP INORBIT UPI", amount: 340, type: "debit", category: "Lifestyle" },
      { date: "2026-06-15", description: "CO-WORKING SPACE RENT DEBIT", amount: 8500, type: "debit", category: "Business Expenses" },
      { date: "2026-06-12", description: "APPLE MUSIC / CLOUD RECURRING", amount: 499, type: "debit", category: "Utilities" },
      { date: "2026-06-10", description: "CREDIT - YOUTUBE ADREVENUE PAYOUT", amount: 18500, type: "credit", category: "Freelance" },
      { date: "2026-06-08", description: "ZOMATO DINING UPI", amount: 2450, type: "debit", category: "Lifestyle" },
      { date: "2026-06-05", description: "ONE CARD CREDIT CARD PAY UPI", amount: 28400, type: "debit", category: "Credit Card" },
      { date: "2026-06-03", description: "SPORTSBOOK ONLINE PLAYING DEBIT", amount: 15000, type: "debit", category: "High Risk Expense" },
      { date: "2026-06-01", description: "INSTAGRAM AD CAMPAIGN DEBIT", amount: 5000, type: "debit", category: "Business Expenses" }
    ]
  },
  {
    id: "prof_4",
    name: "Vikram Singh",
    occupation: "Regional Sales Manager at FMCG",
    age: 45,
    declaredMonthlyIncome: 120000,
    requestedLoanType: "Mortgage Loan",
    requestedAmount: 3000000,
    tenureYears: 15,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    behavioralLog: [
      { action: "Spent 40 seconds on Mortgage rates page", timestamp: "2026-06-28T09:30:00Z" },
      { action: "Read FAQ on collateral valuation", timestamp: "2026-06-28T09:35:00Z" }
    ],
    transactions: [
      { date: "2026-06-30", description: "FMCG LTD SALARY CREDIT", amount: 118000, type: "credit", category: "Salary" },
      { date: "2026-06-26", description: "SBI HOME LOAN RECURRING EMI AUTO DEBIT", amount: 42000, type: "debit", category: "Existing EMI" },
      { date: "2026-06-25", description: "ICICI AUTO LOAN RECURRING EMI DEBIT", amount: 16500, type: "debit", category: "Existing EMI" },
      { date: "2026-06-20", description: "RELIANCE DIGITAL AC BUY EMI UPI", amount: 4800, type: "debit", category: "Existing EMI" },
      { date: "2026-06-18", description: "CLUB MEMBERSHIP ANNUAL CHG DEBIT", amount: 12000, type: "debit", category: "Lifestyle" },
      { date: "2026-06-15", description: "KIDS SCHOOL FEES AUTO DEBIT", amount: 18000, type: "debit", category: "Education" },
      { date: "2026-06-12", description: "AMAZON PAY CC OUTSTANDING DEBIT", amount: 24200, type: "debit", category: "Credit Card" },
      { date: "2026-06-10", description: "MUTUAL FUND SIP DEBIT", amount: 10000, type: "debit", category: "Investment" },
      { date: "2026-06-05", description: "GROCERY MART SWIPE", amount: 8400, type: "debit", category: "Essential" },
      { date: "2026-06-02", description: "POWER BILL AUTO DEBIT", amount: 4500, type: "debit", category: "Utilities" }
    ]
  }
];
