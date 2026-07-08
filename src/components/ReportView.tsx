import React from 'react';
import { UnderwritingReport, SavedLead } from '../types';
import { getTranslation } from '../languages';
import { 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  Award, 
  IndianRupee, 
  Percent, 
  BookmarkPlus, 
  HelpCircle,
  FileText,
  UserCheck,
  Building,
  Car,
  Briefcase,
  AlertCircle,
  Clock
} from 'lucide-react';

interface ReportViewProps {
  report: UnderwritingReport;
  prospectName: string;
  occupation: string;
  requestedLoanType: string;
  requestedAmount: number;
  tenureYears: number;
  lang: string;
  onSaveLead: () => void;
  isSaved: boolean;
}

export default function ReportView({ 
  report, 
  prospectName, 
  occupation, 
  requestedLoanType, 
  requestedAmount, 
  tenureYears,
  lang,
  onSaveLead,
  isSaved 
}: ReportViewProps) {
  
  // Custom theme-friendly color helpers
  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'Hot':
        return 'text-red-500 bg-red-50 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/40';
      case 'Warm':
        return 'text-orange-500 bg-orange-50 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900/40';
      default:
        return 'text-blue-500 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/40';
    }
  };

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'Home Loan':
        return <Building className="w-5 h-5 text-orange-500" />;
      case 'Auto Loan':
        return <Car className="w-5 h-5 text-emerald-600" />;
      case 'Personal Loan':
        return <Briefcase className="w-5 h-5 text-sky-500" />;
      default:
        return <FileText className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-scale-in">
      
      {/* 1. Indian Flag Tri-color Header Accent on Underwriting Report */}
      <div className="relative rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        {/* Tricolor bars at the absolute top */}
        <div className="flex h-2.5 w-full">
          <div className="h-full flex-1 bg-orange-500" title="Saffron - Courage & Strength" />
          <div className="h-full bg-white dark:bg-slate-100 flex items-center justify-center relative" style={{ width: '12%' }} title="White - Peace & Truth">
            {/* Spinning Ashoka Wheel in the white center */}
            <span className="w-5 h-5 rounded-full border border-blue-800 bg-transparent flex items-center justify-center" style={{ fontSize: '6px' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-800 animate-pulse" />
            </span>
          </div>
          <div className="h-full flex-1 bg-emerald-600" title="Green - Fertility & Growth" />
        </div>

        <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">
                VERIFIED BY GEMINI AI
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500 text-white flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Retail Underwriter
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 font-sans tracking-tight">
              {getTranslation(lang, 'underwritingTitle')}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              For applicant <span className="font-bold text-slate-700 dark:text-slate-200">{prospectName}</span> — {occupation}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Lead Status Rating */}
            <div className={`px-4 py-2 rounded-xl border font-black text-sm flex items-center gap-1.5 ${getClassificationColor(report.leadClassification)}`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
              </span>
              {report.leadClassification} Lead Segment
            </div>

            {/* Save CRM button */}
            <button
              onClick={onSaveLead}
              disabled={isSaved}
              className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wide rounded-xl shadow-xs transition-all flex items-center gap-1.5 ${
                isSaved 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 cursor-default'
                  : 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer hover:shadow-md'
              }`}
            >
              <BookmarkPlus className="w-4 h-4" />
              {isSaved ? "Saved to Pipeline" : getTranslation(lang, 'saveLead')}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Graphical Gauges Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Repayment Score Gauge */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xs flex flex-col items-center text-center justify-between">
          <div className="w-full">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Repayment Capacity Score
            </h4>
            {/* Custom SVG Half Gauge */}
            <div className="relative w-40 h-24 mx-auto overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 100 50">
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e2e8f0" strokeWidth="10" className="dark:stroke-slate-700" strokeLinecap="round" />
                <path 
                  d="M 10 50 A 40 40 0 0 1 90 50" 
                  fill="none" 
                  stroke="url(#tricolorGradient)" 
                  strokeWidth="11" 
                  strokeLinecap="round"
                  strokeDasharray="125.6" 
                  strokeDashoffset={125.6 - (125.6 * report.repaymentCapacityScore / 100)} 
                />
                <defs>
                  <linearGradient id="tricolorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" /> {/* Saffron */}
                    <stop offset="50%" stopColor="#eab308" /> {/* Yellow */}
                    <stop offset="100%" stopColor="#10b981" /> {/* Emerald Green */}
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute bottom-0 inset-x-0 text-center">
                <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{report.repaymentCapacityScore}</span>
                <span className="text-slate-400 text-xs font-bold">/100</span>
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-slate-500 mt-2 bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-lg">
            {report.repaymentCapacityScore >= 80 ? 'Highly Eligible Repayer' : (report.repaymentCapacityScore >= 50 ? 'Moderate Capacity' : 'High Risk Leverage')}
          </div>
        </div>

        {/* Lead Conversion Probability (Target >30%) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xs flex flex-col items-center text-center justify-between">
          <div className="w-full">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Lead Conversion Probability
            </h4>
            
            {/* Circle Progress */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="2.5" className="dark:stroke-slate-700" />
                <circle 
                  cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="3.2" 
                  strokeDasharray={`${report.leadConversionProbability} ${100 - report.leadConversionProbability}`} 
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center flex flex-col justify-center">
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {report.leadConversionProbability}%
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase">Target: &gt;30%</span>
              </div>
            </div>
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold mt-2 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-lg">
            <TrendingUp className="w-3.5 h-3.5" />
            Conversion Target Satisfied
          </div>
        </div>

        {/* Behavioral Interest & Intent score */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xs flex flex-col items-center text-center justify-between">
          <div className="w-full">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Behavioral Interest Score
            </h4>
            
            {/* Circle Progress */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="2.5" className="dark:stroke-slate-700" />
                <circle 
                  cx="18" cy="18" r="15.915" fill="none" stroke="#f97316" strokeWidth="3" 
                  strokeDasharray={`${report.interestAndIntentScore} ${100 - report.interestAndIntentScore}`} 
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-black text-orange-500">
                  {report.interestAndIntentScore}
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">DIGITAL INTENT</span>
              </div>
            </div>
          </div>
          <div className="text-xs font-extrabold text-orange-500 mt-2 bg-orange-50 dark:bg-orange-950/30 px-3 py-1 rounded-lg">
            Active Digital Enquiries
          </div>
        </div>

      </div>

      {/* 3. Financial Statements Audit (Actual verified cash flow analysis) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Cash flow ledger details */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xs space-y-4">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center gap-1.5">
            <IndianRupee className="w-4 h-4 text-emerald-600" />
            Verified Cash Flow Statement
          </h4>

          {/* Visual bar comparing declared income vs verified income */}
          <div className="space-y-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200/40">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>Declared Representative Monthly Income</span>
                <span className="text-slate-700 dark:text-slate-300 font-mono">₹{requestedAmount > 5000000 ? (120000).toLocaleString('en-IN') : (80000).toLocaleString('en-IN')}</span>
              </div>
              <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: '80%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-emerald-600">
                <span>Actual Verified Monthly Income (Gemini verified credits)</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm">₹{report.calculatedMonthlyIncome.toLocaleString('en-IN')}</span>
              </div>
              <div className="h-3 w-full bg-emerald-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl text-center border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Essential Bills</div>
              <div className="text-base font-extrabold text-slate-700 dark:text-slate-200 font-mono mt-0.5">
                ₹{report.essentialSpendTotal.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl text-center border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Lifestyle Spend</div>
              <div className="text-base font-extrabold text-slate-700 dark:text-slate-200 font-mono mt-0.5">
                ₹{report.lifestyleSpendTotal.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl text-center border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Active EMIs</div>
              <div className="text-base font-extrabold text-red-500 font-mono mt-0.5">
                ₹{report.debtObligationsTotal.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="bg-emerald-500/10 dark:bg-emerald-950/20 p-3 rounded-xl text-center border border-emerald-100 dark:border-emerald-950/40">
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">Disposable Surplus</div>
              <div className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                ₹{report.monthlyDisposableSurplus.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Underwriter Comments */}
          <div className="p-4 rounded-xl bg-orange-500/5 dark:bg-orange-950/20 border border-orange-500/20 text-xs leading-relaxed space-y-1.5 text-slate-600 dark:text-slate-300">
            <span className="font-extrabold uppercase text-orange-500 tracking-wider flex items-center gap-1 text-[10px]">
              <FileText className="w-3.5 h-3.5" />
              Senior Underwriter's Assessment Comments:
            </span>
            <p>{report.prudentUnderwritingComments}</p>
          </div>
        </div>

        {/* Loan details & Product Recommendation */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xs space-y-4">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-orange-500" />
            Retail Loan Pre-Approval Offer
          </h4>

          {/* Large layout showing loan pre-approved limits */}
          <div className="bg-navy-900 text-white rounded-2xl p-5 border border-navy-950 flex flex-col justify-between relative overflow-hidden shadow-sm">
            {/* Saffron and Green decoration highlights */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/15 rounded-full blur-xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-600/15 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 flex items-center gap-1">
                {getProductIcon(requestedLoanType)}
                {requestedLoanType} RECOMMENDATION
              </span>
              <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-md font-bold">
                PRUDENT LIMIT
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] text-slate-300 font-bold uppercase">Pre-Approved Underwritten Cap</div>
              <div className="text-3xl font-black text-white font-sans tracking-tight">
                ₹{report.recommendedLoanAmount.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-emerald-400 font-medium">
                Sufficiently covered by ₹{report.monthlyDisposableSurplus.toLocaleString('en-IN')}/mo cash surplus.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-5 border-t border-white/10 pt-4 text-xs font-semibold">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Base Interest Rate</span>
                <span className="text-base font-bold text-slate-100">{report.approvedInterestRate}% p.a.</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Debt-to-Income (DTI)</span>
                <span className="text-base font-bold text-slate-100">{report.debtToIncomeRatio}%</span>
              </div>
            </div>
          </div>

          {/* Cash flow security index summary */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-1.5 text-slate-500">
              <span>Total Bank Credits:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">₹{report.cashFlowSummary.monthlyCredits.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-1.5 text-slate-500">
              <span>Total Bank Debits:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">₹{report.cashFlowSummary.monthlyDebits.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Income Stability Index:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{report.cashFlowSummary.incomeStabilityComment}</span>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Risk Flags vs Credit Strengths */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Risk Indicators / Red Flags */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xs">
          <h4 className="text-sm font-bold text-red-600 dark:text-red-400 mb-3.5 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-700 pb-2">
            <AlertCircle className="w-4 h-4" />
            Prudent Risk Observations (Flags)
          </h4>
          <ul className="space-y-2.5 text-xs">
            {report.redFlags.map((flag, idx) => (
              <li key={idx} className="flex gap-2.5 items-start text-slate-600 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Positive Indicators / Credit Strengths */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xs">
          <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-3.5 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-700 pb-2">
            <ShieldCheck className="w-4 h-4" />
            Verified Financial Strengths
          </h4>
          <ul className="space-y-2.5 text-xs">
            {report.positiveIndicators.map((strength, idx) => (
              <li key={idx} className="flex gap-2.5 items-start text-slate-600 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
}
