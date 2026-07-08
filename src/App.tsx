import React, { useState, useEffect } from 'react';
import { SavedLead, ProspectProfile, UnderwritingReport } from './types';
import { INDIAN_LANGUAGES, getTranslation } from './languages';
import Dashboard from './components/Dashboard';
import ProspectForm from './components/ProspectForm';
import ReportView from './components/ReportView';
import { 
  Building2, 
  Moon, 
  Sun, 
  Sparkles, 
  LayoutDashboard, 
  FileText, 
  TrendingUp, 
  Globe2, 
  CheckCircle2, 
  AlertCircle,
  Clock
} from 'lucide-react';

export default function App() {
  // Theme and language configurations
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [lang, setLang] = useState<string>('en');
  
  // Tab routing configuration
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assessment' | 'report'>('dashboard');
  
  // Pipeline data states
  const [leads, setLeads] = useState<SavedLead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  
  // Current analysis workspace states
  const [activeProfile, setActiveProfile] = useState<ProspectProfile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentReport, setCurrentReport] = useState<UnderwritingReport | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  
  // CRM Lead saving indicators
  const [isCurrentLeadSaved, setIsCurrentLeadSaved] = useState(false);

  // Apply visual theme class to document body on toggle
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Fetch saved pipeline leads from Express backend CRM (full-stack capability)
  const fetchLeads = async () => {
    try {
      setLoadingLeads(true);
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (err) {
      console.error("Failed to sync leads from CRM backend:", err);
    } finally {
      setLoadingLeads(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Show a beautiful sliding alert toast
  const triggerAlert = (message: string, type: 'success' | 'error' = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage(null);
    }, 4000);
  };

  // Submit profile to Gemini analysis API
  const handleRunUnderwriting = async (profile: ProspectProfile) => {
    try {
      setIsAnalyzing(true);
      setActiveProfile(profile);
      setCurrentReport(null);
      setIsCurrentLeadSaved(false);
      
      const res = await fetch('/api/analyze-prospect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      
      if (res.ok) {
        const report: UnderwritingReport = await res.json();
        setCurrentReport(report);
        setIsAnalyzing(false);
        setActiveTab('report');
        triggerAlert("Gemini AI Underwriting Analysis Completed successfully!", "success");
      } else {
        throw new Error("Analysis failed");
      }
    } catch (err) {
      console.error(err);
      setIsAnalyzing(false);
      triggerAlert("Unable to calculate underwriting details. Verify backend connection.", "error");
    }
  };

  // Save the currently active underwriting report to persistent CRM leads array
  const handleSaveLeadToCRM = async () => {
    if (!activeProfile || !currentReport) return;
    
    const leadToSave = {
      prospectName: activeProfile.name,
      occupation: activeProfile.occupation,
      loanType: activeProfile.requestedLoanType,
      requestedAmount: activeProfile.requestedAmount,
      verifiedIncome: currentReport.calculatedMonthlyIncome,
      disposableSurplus: currentReport.monthlyDisposableSurplus,
      repaymentScore: currentReport.repaymentCapacityScore,
      conversionProbability: currentReport.leadConversionProbability,
      classification: currentReport.leadClassification,
      status: 'New',
      languageUsed: lang,
      report: currentReport
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead: leadToSave })
      });

      if (res.ok) {
        setIsCurrentLeadSaved(true);
        triggerAlert(getTranslation(lang, 'savingAlert'), "success");
        fetchLeads(); // Refresh leads in background
      }
    } catch (err) {
      console.error("Failed to save lead to pipeline:", err);
      triggerAlert("Failed to save prospect record", "error");
    }
  };

  // Update CRM Lead status via PATCH
  const handleUpdateLeadStatus = async (id: string, status: SavedLead['status']) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        triggerAlert(`Lead status updated to ${status}`, "success");
        fetchLeads();
      }
    } catch (err) {
      console.error(err);
      triggerAlert("Failed to update status", "error");
    }
  };

  // Load a previously saved lead report to review
  const handleViewSavedLeadReport = (lead: SavedLead) => {
    if (lead.report) {
      // Re-map SavedLead back to active profile context
      setActiveProfile({
        id: lead.id,
        name: lead.prospectName,
        occupation: lead.occupation,
        age: 35, // default
        declaredMonthlyIncome: lead.verifiedIncome,
        requestedLoanType: lead.loanType as any,
        requestedAmount: lead.requestedAmount,
        tenureYears: lead.report.recommendedLoanAmount > 0 ? 15 : 5,
        transactions: [],
        behavioralLog: []
      });
      setCurrentReport(lead.report);
      setIsCurrentLeadSaved(true);
      setActiveTab('report');
    } else {
      triggerAlert("No detailed underwriting logs found for this legacy record.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-200 flex flex-col font-sans">
      
      {/* Absolute top sliding toast notification */}
      {alertMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in max-w-sm">
          <div className={`p-4 rounded-xl border shadow-lg flex items-center gap-3 ${
            alertType === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800' 
              : 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800'
          }`}>
            {alertType === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
            )}
            <span className="text-xs font-bold leading-snug">{alertMessage}</span>
          </div>
        </div>
      )}

      {/* Main Indian Patriotic Header Nav */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-xs">
        {/* Tricolor accent bar */}
        <div className="flex h-1.5 w-full">
          <div className="h-full flex-1 bg-orange-500" title="Saffron" />
          <div className="h-full bg-slate-100 dark:bg-slate-100 flex items-center justify-center relative" style={{ width: '8%' }}>
            <span className="w-3.5 h-3.5 rounded-full border border-blue-800 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div className="h-full flex-1 bg-emerald-600" title="Green" />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* National colors theme shield */}
            <div className="w-10 h-10 rounded-xl bg-navy-900 dark:bg-navy-800 flex items-center justify-center border border-white/10 shadow-md">
              <Building2 className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100 font-sans flex items-center gap-1.5">
                {getTranslation(lang, 'appName')}
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 bg-emerald-100/50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  v2.5
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">
                {getTranslation(lang, 'tagline')}
              </p>
            </div>
          </div>

          {/* Action configurations: 22 Indian Constitution Languages Dropdown + Dark/Light Mode */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            
            {/* 22 Constitutional Languages Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <Globe2 className="w-4 h-4 text-slate-400" />
              <select
                id="language-select"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-xs font-black text-slate-700 dark:text-slate-200 focus:outline-none pr-1.5 cursor-pointer max-w-[130px]"
              >
                {INDIAN_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="dark:bg-slate-800">
                    {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Light/Dark theme toggle */}
            <button
              id="theme-toggle"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <Moon className="w-4.5 h-4.5 text-slate-700" />
              ) : (
                <Sun className="w-4.5 h-4.5 text-orange-400" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Sub-Menu Bar */}
      <nav className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-start gap-1.5">
          {[
            { id: 'dashboard', label: getTranslation(lang, 'dashboard'), icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'assessment', label: getTranslation(lang, 'newAssessment'), icon: <FileText className="w-4 h-4" /> },
            { id: 'report', label: "AI Underwriting Report", icon: <TrendingUp className="w-4 h-4" />, disabled: !currentReport }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              disabled={tab.disabled}
              className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-navy-900 text-white shadow-sm scale-102 border border-navy-950 dark:bg-slate-800 dark:border-slate-700'
                  : tab.disabled
                  ? 'opacity-40 text-slate-400 cursor-not-allowed'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* Render appropriate active tab */}
        {activeTab === 'dashboard' && (
          <Dashboard 
            leads={leads} 
            onUpdateStatus={handleUpdateLeadStatus} 
            onViewReport={handleViewSavedLeadReport} 
            lang={lang}
            theme={theme}
          />
        )}

        {activeTab === 'assessment' && (
          <ProspectForm 
            onAnalyze={handleRunUnderwriting} 
            isAnalyzing={isAnalyzing} 
            lang={lang}
          />
        )}

        {activeTab === 'report' && currentReport && activeProfile && (
          <ReportView 
            report={currentReport}
            prospectName={activeProfile.name}
            occupation={activeProfile.occupation}
            requestedLoanType={activeProfile.requestedLoanType}
            requestedAmount={activeProfile.requestedAmount}
            tenureYears={activeProfile.tenureYears}
            lang={lang}
            onSaveLead={handleSaveLeadToCRM}
            isSaved={isCurrentLeadSaved}
          />
        )}

      </main>

      {/* Indian Patriotic Footer Accents */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-400 relative overflow-hidden">
        {/* Footer Tricolor stripes */}
        <div className="absolute bottom-0 left-0 right-0 h-1 flex">
          <div className="h-full flex-1 bg-orange-500" />
          <div className="h-full bg-white dark:bg-slate-100" style={{ width: '6%' }} />
          <div className="h-full flex-1 bg-emerald-600" />
        </div>

        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-medium">
          <div className="flex items-center gap-1.5 justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-100 border border-slate-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>Prospect Assist AI Underwriter • Secure Indian Bank Workspace</span>
          </div>
          <div>
            Authorized for apjabdulkalam596@gmail.com • Indian Tri-color Interface Active
          </div>
        </div>
      </footer>

    </div>
  );
}
