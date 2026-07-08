import React, { useState, useEffect } from 'react';
import { ProspectProfile, Transaction, BehavioralAction } from '../types';
import { PROSPECT_PROFILES } from '../profiles';
import { getTranslation } from '../languages';
import { 
  Briefcase, 
  User, 
  TrendingUp, 
  FileText, 
  Upload, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Sparkles, 
  Layers, 
  HelpCircle,
  Plus,
  Trash2,
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react';

interface ProspectFormProps {
  onAnalyze: (profile: ProspectProfile) => void;
  isAnalyzing: boolean;
  lang: string;
}

export default function ProspectForm({ onAnalyze, isAnalyzing, lang }: ProspectFormProps) {
  // Select profile state
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  
  // Form input states
  const [name, setName] = useState('Rajesh Kumar');
  const [occupation, setOccupation] = useState('Senior Software Engineer at TCS');
  const [age, setAge] = useState(32);
  const [declaredIncome, setDeclaredIncome] = useState(150000);
  const [requestedLoanType, setRequestedLoanType] = useState<ProspectProfile['requestedLoanType']>('Home Loan');
  const [requestedAmount, setRequestedAmount] = useState(6500000);
  const [tenureYears, setTenureYears] = useState(20);
  
  // Bank transactions state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // Manual transaction inputs
  const [newTxDate, setNewTxDate] = useState('2026-07-01');
  const [newTxDesc, setNewTxDesc] = useState('');
  const [newTxAmt, setNewTxAmt] = useState<number>(0);
  const [newTxType, setNewTxType] = useState<'credit' | 'debit'>('debit');
  const [newTxCategory, setNewTxCategory] = useState('Lifestyle');

  // Paste raw block
  const [pasteBlock, setPasteBlock] = useState('');

  // Digital behaviors checkboxes
  const [behaviorList, setBehaviorList] = useState<BehavioralAction[]>([]);
  
  // Pre-load the first profile on mount
  useEffect(() => {
    handleLoadProfile(PROSPECT_PROFILES[0]);
  }, []);

  const handleLoadProfile = (profile: ProspectProfile) => {
    setSelectedProfileId(profile.id);
    setName(profile.name);
    setOccupation(profile.occupation);
    setAge(profile.age);
    setDeclaredIncome(profile.declaredMonthlyIncome);
    setRequestedLoanType(profile.requestedLoanType);
    setRequestedAmount(profile.requestedAmount);
    setTenureYears(profile.tenureYears);
    setTransactions([...profile.transactions]);
    setBehaviorList([...profile.behavioralLog]);
  };

  // Add individual transaction
  const handleAddTransaction = () => {
    if (!newTxDesc || newTxAmt <= 0) return;
    const tx: Transaction = {
      date: newTxDate,
      description: newTxDesc,
      amount: newTxAmt,
      type: newTxType,
      category: newTxCategory
    };
    setTransactions([tx, ...transactions]);
    setNewTxDesc('');
    setNewTxAmt(0);
  };

  // Delete individual transaction
  const handleDeleteTx = (index: number) => {
    setTransactions(transactions.filter((_, idx) => idx !== index));
  };

  // Parse pasted statements
  const handleParsePaste = () => {
    if (!pasteBlock.trim()) return;
    
    // Simple line-by-line smart text parser
    const lines = pasteBlock.split('\n');
    const parsedTxs: Transaction[] = [];
    
    lines.forEach(line => {
      const parts = line.split(',');
      if (parts.length >= 4) {
        // Expected CSV: date, description, amount, type, category
        const date = parts[0].trim() || new Date().toISOString().split('T')[0];
        const desc = parts[1].trim();
        const amt = parseFloat(parts[2].trim()) || 0;
        const type = parts[3].trim().toLowerCase() === 'credit' ? 'credit' : 'debit';
        const cat = parts[4]?.trim() || 'Uncategorized';
        
        if (desc && amt > 0) {
          parsedTxs.push({ date, description: desc, amount: amt, type, category: cat });
        }
      }
    });

    if (parsedTxs.length > 0) {
      setTransactions([...parsedTxs, ...transactions]);
      setPasteBlock('');
    } else {
      // Direct raw text analysis fallback
      const tx: Transaction = {
        date: new Date().toISOString().split('T')[0],
        description: pasteBlock.substring(0, 100),
        amount: declaredIncome * 0.4, // estimated debit
        type: 'debit',
        category: 'Essential'
      };
      setTransactions([tx, ...transactions]);
      setPasteBlock('');
    }
  };

  // Toggle behavior log triggers
  const handleToggleBehavior = (actName: string, isChecked: boolean) => {
    if (isChecked) {
      const newAction: BehavioralAction = {
        action: actName,
        timestamp: new Date().toISOString(),
        details: "Triggered from assessment control simulator"
      };
      setBehaviorList([...behaviorList, newAction]);
    } else {
      setBehaviorList(behaviorList.filter(b => b.action !== actName));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({
      id: selectedProfileId || `prof_custom_${Date.now()}`,
      name,
      occupation,
      age,
      declaredMonthlyIncome: declaredIncome,
      requestedLoanType,
      requestedAmount,
      tenureYears,
      transactions,
      behavioralLog: behaviorList
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      
      {/* 1. Indian Customer Profiles Quick-Loader bar */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
          {getTranslation(lang, 'loadProfile')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PROSPECT_PROFILES.map((prof) => {
            const isSelected = selectedProfileId === prof.id;
            return (
              <button
                key={prof.id}
                type="button"
                onClick={() => handleLoadProfile(prof)}
                className={`text-left p-3.5 rounded-xl border transition-all relative flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-gradient-to-br from-white via-orange-50/10 to-emerald-50/10 border-orange-500 shadow-md ring-1 ring-orange-400 dark:bg-slate-800 dark:border-orange-500' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-xs'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                )}
                <div>
                  <div className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{prof.name}</div>
                  <div className="text-xs text-slate-400 font-medium truncate mb-2">{prof.occupation}</div>
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px] font-semibold border-t border-slate-100 dark:border-slate-700 pt-1.5 w-full">
                  <span className="text-orange-500">{prof.requestedLoanType}</span>
                  <span className="text-emerald-600 dark:text-emerald-400">₹{(prof.declaredMonthlyIncome/1000).toFixed(0)}k/mo</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Applicant details & Loan Eligibility setup */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-orange-500" />
              1. Prospect Profile Info
            </h3>

            {/* Inputs */}
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">FullName</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => { setName(e.target.value); setSelectedProfileId(''); }} 
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Age</label>
                  <input 
                    type="number" 
                    value={age} 
                    onChange={e => setAge(Number(e.target.value))} 
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">{getTranslation(lang, 'occupation')}</label>
                <input 
                  type="text" 
                  value={occupation} 
                  onChange={e => setOccupation(e.target.value)} 
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">{getTranslation(lang, 'declaredIncome')} (₹/mo)</label>
                <input 
                  type="number" 
                  value={declaredIncome} 
                  onChange={e => setDeclaredIncome(Number(e.target.value))} 
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">{getTranslation(lang, 'requestedLoan')}</label>
                <select 
                  value={requestedLoanType} 
                  onChange={e => setRequestedLoanType(e.target.value as ProspectProfile['requestedLoanType'])} 
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
                >
                  <option value="Home Loan">Home Loan</option>
                  <option value="Auto Loan">Auto Loan</option>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Mortgage Loan">Mortgage Loan</option>
                </select>
              </div>

              {/* Sliders for Loan Details */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>{getTranslation(lang, 'requestedAmt')} (₹)</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">
                    ₹{requestedAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <input 
                  type="range" 
                  min={100000} 
                  max={10000000} 
                  step={50000}
                  value={requestedAmount} 
                  onChange={e => setRequestedAmount(Number(e.target.value))} 
                  className="w-full accent-orange-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>1 Lakh</span>
                  <span>1 Crore</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>{getTranslation(lang, 'tenure')}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">
                    {tenureYears} Years
                  </span>
                </div>
                <input 
                  type="range" 
                  min={1} 
                  max={30} 
                  value={tenureYears} 
                  onChange={e => setTenureYears(Number(e.target.value))} 
                  className="w-full accent-emerald-600"
                />
              </div>

            </div>
          </div>

          {/* Interactive digital behavioral cues (High Conversion triggers) */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              2. Digital Intent Simulator
            </h3>
            <p className="text-xs text-slate-400">
              Check behaviors this customer took on the banking portal. Gemini will assess their purchase intention and conversion score.
            </p>
            <div className="space-y-2.5 text-sm">
              {[
                { label: "Used interactive EMI Calculator multi-times", act: "Used Home Loan EMI Calculator" },
                { label: "Spent 4+ minutes reading eligibility criteria", act: "Spent time on loan eligibility page" },
                { label: "Downloaded retail loan brochure PDF", act: "Downloaded Home Loan Guide PDF" },
                { label: "Searched taxation rules on home loan rebates", act: "Searched 'Best tax benefits under Section 80C/24b'" },
                { label: "Initiated loan callback request", act: "Clicked callback request button but did not submit yet" }
              ].map(item => {
                const isChecked = behaviorList.some(b => b.action === item.act);
                return (
                  <label key={item.act} className="flex items-start gap-2.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/40 p-1.5 rounded-lg transition-colors">
                    <input 
                      type="checkbox" 
                      checked={isChecked}
                      onChange={(e) => handleToggleBehavior(item.act, e.target.checked)}
                      className="mt-1 rounded text-orange-500 focus:ring-orange-500 border-slate-300 w-4 h-4"
                    />
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-semibold block text-slate-700 dark:text-slate-200">{item.label}</span>
                      <span className="text-[10px] text-slate-400 italic">Log: {item.act}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Bank Transaction logs ledger */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xs space-y-4 flex flex-col h-full">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-500" />
                3. Financial Statement Ledger ({transactions.length} Records)
              </span>
              <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                Verified Repayment Data
              </span>
            </h3>

            {/* Quick manual transaction entry */}
            <div className="bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/50 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-2 gap-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                <input 
                  type="text" 
                  placeholder="e.g. Salary, Swiggy"
                  value={newTxDesc} 
                  onChange={e => setNewTxDesc(e.target.value)} 
                  className="w-full text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Amount (₹)</label>
                <input 
                  type="number" 
                  value={newTxAmt || ''} 
                  onChange={e => setNewTxAmt(Number(e.target.value))} 
                  className="w-full text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                <select 
                  value={newTxCategory} 
                  onChange={e => setNewTxCategory(e.target.value)} 
                  className="w-full text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                >
                  <option value="Salary">Salary</option>
                  <option value="Business Credits">Business Receipts</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Existing EMI">Existing EMI</option>
                  <option value="Rent/Maintenance">Rent/Housing</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Investment">Investment</option>
                  <option value="Lifestyle">Lifestyle / Dine</option>
                  <option value="Credit Card">Credit Card Bill</option>
                  <option value="High Risk Expense">High Risk Spend</option>
                </select>
              </div>

              <div className="space-y-1 flex flex-col justify-end">
                <div className="flex gap-1.5">
                  <button 
                    type="button" 
                    onClick={() => { setNewTxType('credit'); }}
                    className={`flex-1 text-[10px] font-bold py-1 px-2 rounded-lg border text-center ${
                      newTxType === 'credit' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    CR
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setNewTxType('debit'); }}
                    className={`flex-1 text-[10px] font-bold py-1 px-2 rounded-lg border text-center ${
                      newTxType === 'debit' ? 'bg-red-600 text-white border-red-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    DR
                  </button>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-4 text-right">
                <button
                  type="button"
                  onClick={handleAddTransaction}
                  className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Tx Record
                </button>
              </div>
            </div>

            {/* Paste statement block */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Paste Raw Transactions (CSV or list)
                </span>
                <span className="text-[10px] text-slate-400">
                  Format: YYYY-MM-DD, Desc, Amount, debit/credit, Category
                </span>
              </div>
              <div className="flex gap-2">
                <textarea
                  rows={2}
                  placeholder="2026-06-25, ZOMATO FOOD DELIVERY, 450, debit, Lifestyle"
                  value={pasteBlock}
                  onChange={e => setPasteBlock(e.target.value)}
                  className="flex-1 text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono text-slate-800 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={handleParsePaste}
                  className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 px-3 rounded-xl flex flex-col items-center justify-center text-xs font-extrabold gap-1"
                >
                  <Upload className="w-4 h-4" />
                  Parse
                </button>
              </div>
            </div>

            {/* Table layout of current Statement Transactions */}
            <div className="flex-1 overflow-y-auto max-h-[300px] border border-slate-100 dark:border-slate-700 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0 font-bold text-slate-400 border-b border-slate-100 dark:border-slate-700 uppercase">
                  <tr>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Description</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5 text-right">Amount</th>
                    <th className="p-2.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium">
                  {transactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-2.5 text-slate-400 font-mono whitespace-nowrap">{tx.date}</td>
                      <td className="p-2.5 text-slate-700 dark:text-slate-200 font-semibold line-clamp-1 truncate max-w-[150px]" title={tx.description}>
                        {tx.description}
                      </td>
                      <td className="p-2.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          tx.category === 'Existing EMI' 
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400' 
                            : (tx.category === 'Salary' || tx.category === 'Business Credits' || tx.category === 'Freelance'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-700/60 dark:text-slate-300')
                        }`}>
                          {tx.category}
                        </span>
                      </td>
                      <td className={`p-2.5 text-right font-bold font-mono whitespace-nowrap ${
                        tx.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
                      }`}>
                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteTx(idx)}
                          className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>

      {/* Main Analysis submission CTA with glowing Indian Tricolors & Spinner */}
      <div className="flex flex-col items-center justify-center pt-3 gap-3">
        <button
          type="submit"
          disabled={isAnalyzing || transactions.length === 0}
          className={`w-full max-w-xl py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-widest relative overflow-hidden shadow-lg transition-all flex items-center justify-center gap-3 border ${
            isAnalyzing 
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700 cursor-not-allowed'
              : 'bg-navy-900 text-white border-navy-950 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
          }`}
        >
          {/* Saffron background light-wave */}
          {!isAnalyzing && (
            <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-orange-600/10 pointer-events-none" />
          )}
          {/* Green background light-wave */}
          {!isAnalyzing && (
            <div className="absolute top-0 bottom-0 right-0 w-1/3 bg-emerald-600/10 pointer-events-none" />
          )}
          
          {isAnalyzing ? (
            <>
              {/* Spinning Ashoka Wheel style blue spinner */}
              <div className="w-6 h-6 border-4 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
              <span className="text-slate-500 font-extrabold tracking-normal">
                {getTranslation(lang, 'analyzingText')}
              </span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-orange-400 animate-pulse" />
              <span>{getTranslation(lang, 'runAI')}</span>
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            </>
          )}
        </button>
        <p className="text-[11px] text-slate-400 flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          Gemini 3.5 Flash verified pipeline triggers underwriting flags & savings ratios instantly.
        </p>
      </div>

    </form>
  );
}
