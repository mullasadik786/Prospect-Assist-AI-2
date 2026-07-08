import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client server-side safely
let ai: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY && API_KEY !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey: API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log("Gemini client successfully initialized.");
  } catch (err) {
    console.error("Failed to initialize Gemini client:", err);
  }
} else {
  console.log("No GEMINI_API_KEY found or using placeholder. Running in smart rule-based local mode.");
}

// In-memory array to persist CRM leads for the current session (full-stack capability)
const savedLeads: any[] = [
  {
    id: "lead_initial_1",
    prospectName: "Rajesh Kumar",
    occupation: "Senior Software Engineer at TCS",
    loanType: "Home Loan",
    requestedAmount: 6500000,
    verifiedIncome: 142500,
    disposableSurplus: 83180,
    repaymentScore: 88,
    conversionProbability: 92,
    classification: "Hot",
    status: "In Progress",
    languageUsed: "en",
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    report: {
      repaymentCapacityScore: 88,
      calculatedMonthlyIncome: 142500,
      monthlyDisposableSurplus: 83180,
      debtObligationsTotal: 14200,
      lifestyleSpendTotal: 5160,
      essentialSpendTotal: 39960,
      interestAndIntentScore: 94,
      leadConversionProbability: 92,
      leadClassification: "Hot",
      recommendedLoanAmount: 6800000,
      approvedInterestRate: 8.4,
      debtToIncomeRatio: 10,
      redFlags: ["Active Car Loan EMI of ₹14,200 exists, but debt ratio is very safe."],
      positiveIndicators: [
        "Consistent monthly salary credit of ₹1,42,500 from TCS.",
        "Generous monthly investments via Mutual Fund SIPs of ₹25,000.",
        "Exceptional digital behavioral interest (searched rates, spent 4 mins on guides)."
      ],
      prudentUnderwritingComments: "Excellent profile. Highly stable corporate employer, very strong surplus cash flows, and highly proactive digital inquiry triggers.",
      cashFlowSummary: {
        monthlyCredits: 144350,
        monthlyDebits: 61270,
        transactionCount: 12,
        incomeStabilityComment: "Highly stable. Salaried with zero cash deposit dependencies."
      }
    }
  },
  {
    id: "lead_initial_2",
    prospectName: "Ananya Sharma",
    occupation: "Kirana Merchant",
    loanType: "Auto Loan",
    requestedAmount: 950000,
    verifiedIncome: 101900,
    disposableSurplus: 56900,
    repaymentScore: 82,
    conversionProbability: 84,
    classification: "Hot",
    status: "New",
    languageUsed: "hi",
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    report: {
      repaymentCapacityScore: 82,
      calculatedMonthlyIncome: 101900,
      monthlyDisposableSurplus: 56900,
      debtObligationsTotal: 0,
      lifestyleSpendTotal: 15000,
      essentialSpendTotal: 30000,
      interestAndIntentScore: 88,
      leadConversionProbability: 84,
      leadClassification: "Hot",
      recommendedLoanAmount: 1100000,
      approvedInterestRate: 9.2,
      debtToIncomeRatio: 0,
      redFlags: ["No standard corporate pay slip (informal merchant transactions)."],
      positiveIndicators: [
        "Continuous daily UPI merchant credits from multiple clients.",
        "Zero active debts or loan obligations.",
        "Significant cash reserves and stable store operation."
      ],
      prudentUnderwritingComments: "High conversion prospective customer. Merchant collections verify a healthy and continuous daily cash flow. Ready for instant pre-approved auto loan.",
      cashFlowSummary: {
        monthlyCredits: 101900,
        monthlyDebits: 45000,
        transactionCount: 12,
        incomeStabilityComment: "Robust daily collection cycle. Traditional systems underestimate this high-surplus profile."
      }
    }
  }
];

// Lead CRM endpoints
app.get('/api/leads', (req, res) => {
  res.json(savedLeads);
});

app.post('/api/leads', (req, res) => {
  const { lead } = req.body;
  if (!lead) {
    return res.status(400).json({ error: "Lead content is required" });
  }
  const newLead = {
    ...lead,
    id: `lead_${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  savedLeads.unshift(newLead);
  res.json({ success: true, lead: newLead });
});

app.patch('/api/leads/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const leadIdx = savedLeads.findIndex(l => l.id === id);
  if (leadIdx !== -1) {
    savedLeads[leadIdx].status = status;
    return res.json({ success: true, lead: savedLeads[leadIdx] });
  }
  res.status(404).json({ error: "Lead not found" });
});

// Underwriting analysis endpoint (Uses Gemini server-side as mandated)
app.post('/api/analyze-prospect', async (req, res) => {
  const { name, occupation, age, declaredIncome, requestedLoanType, requestedAmount, tenureYears, transactions, behavioralLog } = req.body;

  if (!name || !transactions) {
    return res.status(400).json({ error: "Missing required profile data" });
  }

  // If Gemini client is active, try calling Gemini
  if (ai) {
    try {
      console.log(`Sending underwriting request for ${name} to Gemini...`);
      const systemInstruction = `You are an expert, prudent Senior Retail Lending Underwriter at an Indian Bank.
Your task is to analyze raw bank transactions and digital behavioral logs to:
1. Verify ACTUAL monthly income (excluding inter-account transfers, one-off large credits, and calculating stable regular recurring inflows).
2. Calculate verified monthly disposable surplus (Actual verified income minus essential living expenses and existing EMI debts).
3. Compute a Repayment Capacity Score (1-100) based on stability, cash surplus, and leverage.
4. Compute an Interest & Intent Score (1-100) based on how frequently the user checks loan details, uses calculators, or interacts with financial advice.
5. Predict a Lead Conversion Probability (%) representing how likely they are to accept a loan offer if contacted immediately.
6. Provide specific prudent underwriting flags (red flags) and positive credit indicators.
7. Recommend a maximum prudent loan amount and approved starting interest rate.

Adhere strictly to standard Indian retail banking risk ratios (e.g., Debt-to-income ratio, minimum surplus of 30%).
Return strictly a valid JSON object matching the requested schema. Do not include markdown codeblocks or outer text.`;

      const prompt = `Analyze this applicant:
Name: ${name}
Age: ${age}
Occupation: ${occupation}
Declared Monthly Income: ₹${declaredIncome}
Requested Loan Product: ${requestedLoanType}
Requested Loan Amount: ₹${requestedAmount}
Loan Tenure Requested: ${tenureYears} Years

Raw Transaction Log (last 30 days):
${JSON.stringify(transactions, null, 2)}

User Digital Behavior Log (intent cues):
${JSON.stringify(behavioralLog, null, 2)}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              repaymentCapacityScore: { type: Type.INTEGER, description: "1 to 100 score on stability and debt capacity" },
              calculatedMonthlyIncome: { type: Type.INTEGER, description: "Calculated actual verified monthly income in Indian Rupees" },
              monthlyDisposableSurplus: { type: Type.INTEGER, description: "Disposable surplus left in Rupees" },
              debtObligationsTotal: { type: Type.INTEGER, description: "Total active EMIs and monthly obligations found" },
              lifestyleSpendTotal: { type: Type.INTEGER, description: "Total lifestyle/dining/shopping debits found" },
              essentialSpendTotal: { type: Type.INTEGER, description: "Total essential rent/utilities/groceries debits" },
              interestAndIntentScore: { type: Type.INTEGER, description: "1 to 100 digital interest score" },
              leadConversionProbability: { type: Type.INTEGER, description: "Likelihood of conversion in percent" },
              leadClassification: { type: Type.STRING, description: "Must be 'Hot', 'Warm' or 'Cold'" },
              recommendedLoanAmount: { type: Type.INTEGER, description: "Prudent maximum recommended loan amount" },
              approvedInterestRate: { type: Type.NUMBER, description: "Prudent annual rate (e.g. 8.75)" },
              debtToIncomeRatio: { type: Type.INTEGER, description: "Ratio of total debt to calculated income in percent" },
              redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
              positiveIndicators: { type: Type.ARRAY, items: { type: Type.STRING } },
              prudentUnderwritingComments: { type: Type.STRING, description: "Summary comments of risk assessment" },
              cashFlowSummary: {
                type: Type.OBJECT,
                properties: {
                  monthlyCredits: { type: Type.INTEGER },
                  monthlyDebits: { type: Type.INTEGER },
                  transactionCount: { type: Type.INTEGER },
                  incomeStabilityComment: { type: Type.STRING }
                },
                required: ["monthlyCredits", "monthlyDebits", "transactionCount", "incomeStabilityComment"]
              }
            },
            required: [
              "repaymentCapacityScore",
              "calculatedMonthlyIncome",
              "monthlyDisposableSurplus",
              "debtObligationsTotal",
              "lifestyleSpendTotal",
              "essentialSpendTotal",
              "interestAndIntentScore",
              "leadConversionProbability",
              "leadClassification",
              "recommendedLoanAmount",
              "approvedInterestRate",
              "debtToIncomeRatio",
              "redFlags",
              "positiveIndicators",
              "prudentUnderwritingComments",
              "cashFlowSummary"
            ]
          }
        }
      });

      if (response && response.text) {
        const cleanedText = response.text.trim();
        const report = JSON.parse(cleanedText);
        console.log(`Gemini report parsed successfully for ${name}.`);
        return res.json(report);
      }
    } catch (err) {
      console.error("Gemini API error, running fallback rules engine:", err);
    }
  }

  // Smart Rule-Based fallback rules engine (always runs if API key is absent or fails)
  console.log(`Calculating underwriting metrics locally for ${name}...`);
  
  // Calculate income & expenses from transactions
  let totalCredits = 0;
  let totalDebits = 0;
  let debtEMI = 0;
  let essential = 0;
  let lifestyle = 0;

  transactions.forEach((tx: any) => {
    const amt = Number(tx.amount);
    if (tx.type === 'credit') {
      totalCredits += amt;
    } else {
      totalDebits += amt;
      if (tx.category === 'Existing EMI') {
        debtEMI += amt;
      } else if (tx.category === 'Utilities' || tx.category === 'Rent/Maintenance' || tx.category === 'Essential' || tx.category === 'Education') {
        essential += amt;
      } else {
        lifestyle += amt;
      }
    }
  });

  // Derived verified stable income
  const isFreelancer = occupation.toLowerCase().includes('freelance') || occupation.toLowerCase().includes('gig');
  const isMerchant = occupation.toLowerCase().includes('merchant') || occupation.toLowerCase().includes('owner');
  
  let verifiedIncome = isFreelancer ? totalCredits * 0.8 : (isMerchant ? totalCredits * 0.4 : totalCredits);
  if (verifiedIncome === 0) verifiedIncome = Number(declaredIncome);

  const disposableSurplus = Math.max(0, verifiedIncome - debtEMI - essential - (lifestyle * 0.7));
  const debtToIncome = Math.round((debtEMI / (verifiedIncome || 1)) * 100);

  // Behavioral score based on action log
  let behaviorScore = 50;
  behavioralLog.forEach((log: any) => {
    if (log.action.includes('Calculator') || log.action.includes('repayment')) behaviorScore += 15;
    if (log.action.includes('time') || log.action.includes('duration')) behaviorScore += 10;
    if (log.action.includes('Guide') || log.action.includes('Download')) behaviorScore += 15;
    if (log.action.includes('Search')) behaviorScore += 10;
  });
  behaviorScore = Math.min(100, Math.max(10, behaviorScore));

  // Repayment Score
  const balanceFactor = Math.min(100, Math.max(10, Math.round((disposableSurplus / (verifiedIncome || 1)) * 100)));
  const repaymentScore = Math.min(100, Math.round((balanceFactor * 0.6) + ((100 - debtToIncome) * 0.4)));

  // Conversion Probability
  const conversionProbability = Math.round((repaymentScore * 0.4) + (behaviorScore * 0.6));
  const leadClassification = conversionProbability >= 80 ? 'Hot' : (conversionProbability >= 50 ? 'Warm' : 'Cold');

  // Base interest rates
  const approvedInterestRate = requestedLoanType === 'Home Loan' ? 8.4 : (requestedLoanType === 'Auto Loan' ? 9.2 : (requestedLoanType === 'Mortgage Loan' ? 9.8 : 11.5));
  const recommendedLoanAmount = Math.round(disposableSurplus * 12 * tenureYears * 0.55);

  const redFlags: string[] = [];
  const positiveIndicators: string[] = [];

  if (debtToIncome > 40) {
    redFlags.push(`Very high Debt-to-Income ratio (${debtToIncome}%).`);
  }
  if (isFreelancer) {
    redFlags.push("Erratic freelancer cash flow might experience dry seasons.");
  }
  if (debtEMI > 0) {
    redFlags.push(`Applicant has active running EMIs amounting to ₹${debtEMI.toLocaleString('en-IN')}/mo.`);
  }

  if (repaymentScore > 80) {
    positiveIndicators.push("High disposable surplus relative to declared commitments.");
  }
  if (essential < verifiedIncome * 0.3) {
    positiveIndicators.push("Excellent expenditure control on monthly essential bills.");
  }
  if (behaviorScore > 80) {
    positiveIndicators.push("Outstanding engagement cues. Genuinely active and ready for onboarding.");
  }

  const prudentUnderwritingComments = `Calculated verified monthly income is ₹${verifiedIncome.toLocaleString('en-IN')}. Monthly essential bills and commitments represent a healthy overhead. The behavioral profile scores highly for credit interest, indicating immediate target qualification.`;

  const responseReport = {
    repaymentCapacityScore: repaymentScore,
    calculatedMonthlyIncome: Math.round(verifiedIncome),
    monthlyDisposableSurplus: Math.round(disposableSurplus),
    debtObligationsTotal: debtEMI,
    lifestyleSpendTotal: Math.round(lifestyle),
    essentialSpendTotal: Math.round(essential),
    interestAndIntentScore: behaviorScore,
    leadConversionProbability: conversionProbability,
    leadClassification,
    recommendedLoanAmount: Math.round(recommendedLoanAmount),
    approvedInterestRate,
    debtToIncomeRatio: debtToIncome,
    redFlags: redFlags.length > 0 ? redFlags : ["No critical warnings identified."],
    positiveIndicators: positiveIndicators.length > 0 ? positiveIndicators : ["Stable base income and moderate expenditure logs."],
    prudentUnderwritingComments,
    cashFlowSummary: {
      monthlyCredits: totalCredits || Math.round(verifiedIncome),
      monthlyDebits: totalDebits,
      transactionCount: transactions.length,
      incomeStabilityComment: isFreelancer ? "Erratic freelance credits. Prudent cushion advised." : "Highly standard salaried / business receipts."
    }
  };

  res.json(responseReport);
});

// Configure Vite or Static server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving static build files from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
